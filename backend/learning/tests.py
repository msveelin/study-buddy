from datetime import timedelta

from django.core.management import call_command
from django.test import TestCase
from django.utils import timezone

from .models import (MASTERED_BOX, CardReview, Course, Exercise, Flashcard, Learner, Module, Lesson,
                     PracticeAttempt, ReviewQuestion)
from .schema import schema


class LeitnerTests(TestCase):
    def setUp(self):
        self.learner = Learner.objects.create(name="Tester")
        course = Course.objects.create(slug="typing", title="Typing", description="")
        self.card = Flashcard.objects.create(course=course, key="bumps", front="F and J?", back="Bumps")

    def test_known_moves_up_one_box_and_schedules_later(self):
        r = CardReview.objects.create(learner=self.learner, card=self.card)
        r.apply(True)
        self.assertEqual(r.box, 2)
        self.assertEqual(r.reviews, 1)
        self.assertGreater(r.due, timezone.now() + timedelta(hours=23))
        self.assertFalse(r.is_due)

    def test_unknown_drops_to_box_one_and_is_due_now(self):
        r = CardReview.objects.create(learner=self.learner, card=self.card, box=4)
        r.apply(False)
        self.assertEqual(r.box, 1)
        self.assertEqual(r.lapses, 1)
        self.assertTrue(r.is_due)

    def test_box_never_exceeds_mastered(self):
        r = CardReview.objects.create(learner=self.learner, card=self.card, box=MASTERED_BOX)
        r.apply(True)
        self.assertEqual(r.box, MASTERED_BOX)
        self.assertTrue(r.mastered)


class PracticeSchemaTests(TestCase):
    def setUp(self):
        self.learner = Learner.objects.create(name="Tester")
        self.course = Course.objects.create(slug="typing", title="Typing", description="")
        for i in range(3):
            Flashcard.objects.create(course=self.course, key=f"c{i}", front=f"Q{i}", back=f"A{i}", order=i)
        for i in range(4):
            ReviewQuestion.objects.create(course=self.course, key=f"q{i}", question=f"Q{i}",
                                          options=["a", "b"], answer=1, order=i)
        self.exercise = Exercise.objects.create(course=self.course, key="ex1", title="Ex", kind="typing",
                                                data={"text": "abc", "targetWpm": 0})

    def gql(self, query, **variables):
        result = schema.execute(query, variables=variables)
        self.assertIsNone(result.errors, result.errors)
        return result.data

    def test_unseen_cards_are_due_and_summary_counts_them(self):
        data = self.gql("""query($l: ID!) { flashcards(learnerId: $l, courseSlug: "typing", dueOnly: true) { id seen isDue box }
                           practice(learnerId: $l) { courseSlug cardsTotal cardsDue cardsMastered } }""", l=self.learner.id)
        self.assertEqual(len(data["flashcards"]), 3)
        self.assertTrue(all(c["isDue"] and not c["seen"] and c["box"] == 0 for c in data["flashcards"]))
        self.assertEqual(data["practice"][0], {"courseSlug": "typing", "cardsTotal": 3, "cardsDue": 3, "cardsMastered": 0})

    def test_review_card_removes_it_from_due_list(self):
        card_id = Flashcard.objects.first().id
        data = self.gql("""mutation($l: ID!, $c: ID!) { reviewCard(learnerId: $l, cardId: $c, known: true) { card { box seen isDue } } }""",
                        l=self.learner.id, c=card_id)
        self.assertEqual(data["reviewCard"]["card"], {"box": 2, "seen": True, "isDue": False})
        due = self.gql("""query($l: ID!) { flashcards(learnerId: $l, courseSlug: "typing", dueOnly: true) { id } }""", l=self.learner.id)
        self.assertEqual(len(due["flashcards"]), 2)
        dash = self.gql("""query($l: ID!) { dashboard(learnerId: $l) { cardsDue } }""", l=self.learner.id)
        self.assertEqual(dash["dashboard"]["cardsDue"], 2)

    def test_quiz_questions_are_sampled(self):
        data = self.gql("""query { quizQuestions(courseSlug: "typing", count: 2) { key options answer } }""")
        self.assertEqual(len(data["quizQuestions"]), 2)
        self.assertEqual(data["quizQuestions"][0]["options"], ["a", "b"])

    def test_record_test_passes_at_80_percent(self):
        data = self.gql("""mutation($l: ID!) { recordPractice(learnerId: $l, courseSlug: "typing", mode: "test", correct: 12, total: 15)
                           { attempt { score passed } summary { bestTestScore testPassed testAttempts } } }""", l=self.learner.id)
        self.assertEqual(data["recordPractice"]["attempt"], {"score": 80.0, "passed": True})
        self.assertEqual(data["recordPractice"]["summary"], {"bestTestScore": 80.0, "testPassed": True, "testAttempts": 1})
        data = self.gql("""mutation($l: ID!) { recordPractice(learnerId: $l, courseSlug: "typing", mode: "test", correct: 11, total: 15)
                           { attempt { passed } } }""", l=self.learner.id)
        self.assertFalse(data["recordPractice"]["attempt"]["passed"])

    def test_exercise_done_after_passed_attempt(self):
        self.gql("""mutation($l: ID!) { recordPractice(learnerId: $l, courseSlug: "typing", mode: "exercise", correct: 0, total: 1, exerciseKey: "ex1") { attempt { passed } } }""", l=self.learner.id)
        data = self.gql("""query($l: ID!) { exercises(learnerId: $l, courseSlug: "typing") { key done attempts } }""", l=self.learner.id)
        self.assertEqual(data["exercises"][0], {"key": "ex1", "done": False, "attempts": 1})
        self.gql("""mutation($l: ID!) { recordPractice(learnerId: $l, courseSlug: "typing", mode: "exercise", correct: 1, total: 1, exerciseKey: "ex1") { attempt { passed } } }""", l=self.learner.id)
        data = self.gql("""query($l: ID!) { exercises(learnerId: $l, courseSlug: "typing") { key done attempts }
                           practice(learnerId: $l) { exercisesDone } }""", l=self.learner.id)
        self.assertEqual(data["exercises"][0], {"key": "ex1", "done": True, "attempts": 2})
        self.assertEqual(data["practice"][0]["exercisesDone"], 1)

    def test_unknown_mode_is_rejected(self):
        result = schema.execute("""mutation($l: ID!) { recordPractice(learnerId: $l, courseSlug: "typing", mode: "nap", correct: 1, total: 1) { attempt { id } } }""",
                                variables={"l": self.learner.id})
        self.assertTrue(result.errors)

    def test_reset_progress_clears_practice(self):
        CardReview.objects.create(learner=self.learner, card=Flashcard.objects.first())
        PracticeAttempt.objects.create(learner=self.learner, course=self.course, mode="quiz", correct=1, total=1, score=100)
        self.gql("""mutation($l: ID!) { resetProgress(learnerId: $l) { ok } }""", l=self.learner.id)
        self.assertEqual(CardReview.objects.count(), 0)
        self.assertEqual(PracticeAttempt.objects.count(), 0)


class SeedTests(TestCase):
    def test_seed_loads_practice_content_and_folds_in_lesson_quizzes(self):
        call_command("seed", verbosity=0)
        for slug in ("typing", "word", "programming", "webdev"):
            course = Course.objects.get(slug=slug)
            self.assertGreaterEqual(course.flashcards.count(), 15, slug)
            self.assertGreaterEqual(course.exercises.count(), 5, slug)
            lesson_questions = sum(len(l.data.get("questions", []))
                                   for l in Lesson.objects.filter(module__course=course, kind="quiz"))
            self.assertGreater(course.questions.count(), lesson_questions, slug)
            self.assertTrue(course.questions.filter(key__startswith=f"{slug}").exists() or
                            course.questions.filter(key__contains="quiz").exists(), slug)
        # every question's answer index points at a real option
        for qq in ReviewQuestion.objects.all():
            self.assertLess(qq.answer, len(qq.options), qq.key)
        # seeding twice keeps keys stable (no duplicates)
        before = Flashcard.objects.count(), ReviewQuestion.objects.count(), Exercise.objects.count()
        call_command("seed", verbosity=0)
        self.assertEqual(before, (Flashcard.objects.count(), ReviewQuestion.objects.count(), Exercise.objects.count()))
