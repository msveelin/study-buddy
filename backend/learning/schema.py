import random

import graphene
from django.db.models import Avg, Count, Max
from django.utils import timezone
from graphene_django import DjangoObjectType

from .models import (MASTERED_BOX, CardReview, Course, Exercise, Flashcard, Learner, Lesson, LessonProgress,
                     Module, PracticeAttempt, ReviewQuestion, TypingAttempt)


class LearnerType(DjangoObjectType):
    class Meta:
        model = Learner
        fields = ("id", "name", "created_at")


class LessonType(DjangoObjectType):
    data = graphene.JSONString()
    kind = graphene.String()
    course_slug = graphene.String()
    course_title = graphene.String()
    module_title = graphene.String()

    class Meta:
        model = Lesson
        fields = ("id", "slug", "title", "kind", "order", "content", "data", "minutes", "module")

    def resolve_course_slug(self, info):
        return self.module.course.slug

    def resolve_course_title(self, info):
        return self.module.course.title

    def resolve_module_title(self, info):
        return self.module.title


class ModuleType(DjangoObjectType):
    lessons = graphene.List(LessonType)

    class Meta:
        model = Module
        fields = ("id", "title", "order", "course")

    def resolve_lessons(self, info):
        return self.lessons.all()


class CourseType(DjangoObjectType):
    modules = graphene.List(ModuleType)
    lesson_count = graphene.Int()

    class Meta:
        model = Course
        fields = ("id", "slug", "title", "description", "icon", "order")

    def resolve_modules(self, info):
        return self.modules.all()

    def resolve_lesson_count(self, info):
        return Lesson.objects.filter(module__course=self).count()


class ProgressType(DjangoObjectType):
    status = graphene.String()
    lesson_slug = graphene.String()
    course_slug = graphene.String()

    class Meta:
        model = LessonProgress
        fields = ("id", "status", "score", "best_wpm", "best_accuracy", "attempts",
                  "completed_at", "updated_at", "lesson")

    def resolve_lesson_slug(self, info):
        return self.lesson.slug

    def resolve_course_slug(self, info):
        return self.lesson.module.course.slug


class TypingAttemptType(DjangoObjectType):
    class Meta:
        model = TypingAttempt
        fields = ("id", "wpm", "accuracy", "seconds", "created_at", "lesson")


class CourseStatType(graphene.ObjectType):
    course_slug = graphene.String()
    total = graphene.Int()
    completed = graphene.Int()


class DashboardType(graphene.ObjectType):
    lessons_completed = graphene.Int()
    lessons_total = graphene.Int()
    best_wpm = graphene.Float()
    avg_accuracy = graphene.Float()
    typing_attempts = graphene.Int()
    courses = graphene.List(CourseStatType)
    next_lesson = graphene.Field(LessonType)
    cards_due = graphene.Int()
    practice_sessions = graphene.Int()


def count_due_cards(learner_id):
    """Cards the learner has never seen plus cards whose Leitner due date has passed."""
    now = timezone.now()
    seen = CardReview.objects.filter(learner_id=learner_id)
    due_seen = seen.filter(due__lte=now).count()
    unseen = Flashcard.objects.exclude(id__in=seen.values_list("card_id", flat=True)).count()
    return due_seen + unseen


class LessonQuery(graphene.ObjectType):
    learners = graphene.List(LearnerType)
    learner = graphene.Field(LearnerType, id=graphene.ID(required=True))
    courses = graphene.List(CourseType)
    course = graphene.Field(CourseType, slug=graphene.String(required=True))
    lesson = graphene.Field(LessonType, slug=graphene.String(required=True))
    progress = graphene.List(ProgressType, learner_id=graphene.ID(required=True))
    typing_history = graphene.List(TypingAttemptType, learner_id=graphene.ID(required=True),
                                   lesson_slug=graphene.String())
    dashboard = graphene.Field(DashboardType, learner_id=graphene.ID(required=True))

    def resolve_learners(self, info):
        return Learner.objects.order_by("name")

    def resolve_learner(self, info, id):
        return Learner.objects.filter(pk=id).first()

    def resolve_courses(self, info):
        return Course.objects.prefetch_related("modules__lessons").all()

    def resolve_course(self, info, slug):
        return Course.objects.prefetch_related("modules__lessons").filter(slug=slug).first()

    def resolve_lesson(self, info, slug):
        return Lesson.objects.select_related("module__course").filter(slug=slug).first()

    def resolve_progress(self, info, learner_id):
        return LessonProgress.objects.select_related("lesson__module__course").filter(learner_id=learner_id)

    def resolve_typing_history(self, info, learner_id, lesson_slug=None):
        qs = TypingAttempt.objects.filter(learner_id=learner_id)
        if lesson_slug:
            qs = qs.filter(lesson__slug=lesson_slug)
        return qs[:50]

    def resolve_dashboard(self, info, learner_id):
        progress = LessonProgress.objects.filter(learner_id=learner_id)
        completed_ids = set(progress.filter(status="completed").values_list("lesson_id", flat=True))
        attempts = TypingAttempt.objects.filter(learner_id=learner_id)
        agg = attempts.aggregate(best=Max("wpm"), acc=Avg("accuracy"), n=Count("id"))
        stats = []
        next_lesson = None
        for course in Course.objects.prefetch_related("modules__lessons"):
            lessons = [l for m in course.modules.all() for l in m.lessons.all()]
            done = sum(1 for l in lessons if l.id in completed_ids)
            stats.append(CourseStatType(course_slug=course.slug, total=len(lessons), completed=done))
            if next_lesson is None:
                for l in lessons:
                    if l.id not in completed_ids:
                        next_lesson = l
                        break
        return DashboardType(
            lessons_completed=len(completed_ids),
            lessons_total=Lesson.objects.count(),
            best_wpm=agg["best"],
            avg_accuracy=agg["acc"],
            typing_attempts=agg["n"],
            courses=stats,
            next_lesson=next_lesson,
            cards_due=count_due_cards(learner_id),
            practice_sessions=PracticeAttempt.objects.filter(learner_id=learner_id).count(),
        )


class CreateLearner(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)

    learner = graphene.Field(LearnerType)

    def mutate(self, info, name):
        name = name.strip()
        if not name:
            raise Exception("Name cannot be empty")
        learner, _ = Learner.objects.get_or_create(name=name)
        return CreateLearner(learner=learner)


class SaveProgress(graphene.Mutation):
    class Arguments:
        learner_id = graphene.ID(required=True)
        lesson_slug = graphene.String(required=True)
        status = graphene.String(required=True)
        score = graphene.Float()

    progress = graphene.Field(ProgressType)

    def mutate(self, info, learner_id, lesson_slug, status, score=None):
        lesson = Lesson.objects.get(slug=lesson_slug)
        p, _ = LessonProgress.objects.get_or_create(learner_id=learner_id, lesson=lesson)
        p.attempts += 1
        if score is not None:
            p.score = max(score, p.score or 0)
        if status == "completed":
            p.status = "completed"
            if p.completed_at is None:
                p.completed_at = timezone.now()
        p.save()
        return SaveProgress(progress=p)


class RecordTypingAttempt(graphene.Mutation):
    class Arguments:
        learner_id = graphene.ID(required=True)
        lesson_slug = graphene.String(required=True)
        wpm = graphene.Float(required=True)
        accuracy = graphene.Float(required=True)
        seconds = graphene.Float(required=True)

    attempt = graphene.Field(TypingAttemptType)
    progress = graphene.Field(ProgressType)

    def mutate(self, info, learner_id, lesson_slug, wpm, accuracy, seconds):
        lesson = Lesson.objects.get(slug=lesson_slug)
        attempt = TypingAttempt.objects.create(
            learner_id=learner_id, lesson=lesson, wpm=wpm, accuracy=accuracy, seconds=seconds
        )
        p, _ = LessonProgress.objects.get_or_create(learner_id=learner_id, lesson=lesson)
        p.attempts += 1
        p.best_wpm = max(wpm, p.best_wpm or 0)
        p.best_accuracy = max(accuracy, p.best_accuracy or 0)
        target_wpm = (lesson.data or {}).get("targetWpm", 0)
        target_acc = (lesson.data or {}).get("targetAccuracy", 90)
        if accuracy >= target_acc and wpm >= target_wpm:
            p.status = "completed"
            if p.completed_at is None:
                p.completed_at = timezone.now()
        p.save()
        return RecordTypingAttempt(attempt=attempt, progress=p)


class ResetProgress(graphene.Mutation):
    class Arguments:
        learner_id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, learner_id):
        LessonProgress.objects.filter(learner_id=learner_id).delete()
        TypingAttempt.objects.filter(learner_id=learner_id).delete()
        CardReview.objects.filter(learner_id=learner_id).delete()
        PracticeAttempt.objects.filter(learner_id=learner_id).delete()
        return ResetProgress(ok=True)


class LessonMutation(graphene.ObjectType):
    create_learner = CreateLearner.Field()
    save_progress = SaveProgress.Field()
    record_typing_attempt = RecordTypingAttempt.Field()
    reset_progress = ResetProgress.Field()



# ---------------------------------------------------------------------------
# Practice: flashcards, quizzes, tests and exercises
# ---------------------------------------------------------------------------

TEST_PASS_SCORE = 80
QUIZ_PASS_SCORE = 70


class FlashcardType(graphene.ObjectType):
    id = graphene.ID()
    key = graphene.String()
    front = graphene.String()
    back = graphene.String()
    box = graphene.Int()
    due = graphene.DateTime()
    is_due = graphene.Boolean()
    mastered = graphene.Boolean()
    seen = graphene.Boolean()
    reviews = graphene.Int()
    lapses = graphene.Int()


def card_state(card, review):
    if review is None:
        return FlashcardType(id=card.id, key=card.key, front=card.front, back=card.back, box=0, due=None,
                             is_due=True, mastered=False, seen=False, reviews=0, lapses=0)
    return FlashcardType(id=card.id, key=card.key, front=card.front, back=card.back, box=review.box,
                         due=review.due, is_due=review.is_due, mastered=review.mastered, seen=True,
                         reviews=review.reviews, lapses=review.lapses)


class ReviewQuestionType(DjangoObjectType):
    options = graphene.List(graphene.String)

    class Meta:
        model = ReviewQuestion
        fields = ("id", "key", "question", "answer", "explain")

    def resolve_options(self, info):
        return list(self.options)


class ExerciseType(graphene.ObjectType):
    id = graphene.ID()
    key = graphene.String()
    title = graphene.String()
    kind = graphene.String()
    content = graphene.String()
    data = graphene.JSONString()
    minutes = graphene.Int()
    course_slug = graphene.String()
    course_title = graphene.String()
    done = graphene.Boolean()
    attempts = graphene.Int()


def exercise_state(ex, learner_id):
    attempts = PracticeAttempt.objects.filter(learner_id=learner_id, exercise=ex)
    return ExerciseType(id=ex.id, key=ex.key, title=ex.title, kind=ex.kind, content=ex.content, data=ex.data,
                        minutes=ex.minutes, course_slug=ex.course.slug, course_title=ex.course.title,
                        done=attempts.filter(passed=True).exists(), attempts=attempts.count())


class PracticeAttemptType(DjangoObjectType):
    mode = graphene.String()
    course_slug = graphene.String()
    exercise_key = graphene.String()
    exercise_title = graphene.String()

    class Meta:
        model = PracticeAttempt
        fields = ("id", "mode", "correct", "total", "score", "seconds", "passed", "created_at")

    def resolve_course_slug(self, info):
        return self.course.slug

    def resolve_exercise_key(self, info):
        return self.exercise.key if self.exercise else None

    def resolve_exercise_title(self, info):
        return self.exercise.title if self.exercise else None


class PracticeSummaryType(graphene.ObjectType):
    course_slug = graphene.String()
    course_title = graphene.String()
    course_icon = graphene.String()
    cards_total = graphene.Int()
    cards_due = graphene.Int()
    cards_seen = graphene.Int()
    cards_mastered = graphene.Int()
    questions_total = graphene.Int()
    exercises_total = graphene.Int()
    exercises_done = graphene.Int()
    best_test_score = graphene.Float()
    test_passed = graphene.Boolean()
    test_attempts = graphene.Int()
    last_quiz_score = graphene.Float()
    quiz_attempts = graphene.Int()
    last_practiced = graphene.DateTime()


def build_summary(learner_id, course):
    now = timezone.now()
    cards = Flashcard.objects.filter(course=course)
    reviews = CardReview.objects.filter(learner_id=learner_id, card__course=course)
    seen = reviews.count()
    attempts = PracticeAttempt.objects.filter(learner_id=learner_id, course=course)
    tests = attempts.filter(mode="test")
    quizzes = attempts.filter(mode="quiz")
    best_test = tests.aggregate(m=Max("score"))["m"]
    last_quiz = quizzes.first()
    return PracticeSummaryType(
        course_slug=course.slug,
        course_title=course.title,
        course_icon=course.icon,
        cards_total=cards.count(),
        cards_due=(cards.count() - seen) + reviews.filter(due__lte=now).count(),
        cards_seen=seen,
        cards_mastered=reviews.filter(box__gte=MASTERED_BOX).count(),
        questions_total=ReviewQuestion.objects.filter(course=course).count(),
        exercises_total=Exercise.objects.filter(course=course).count(),
        exercises_done=attempts.filter(mode="exercise", passed=True).values("exercise_id").distinct().count(),
        best_test_score=best_test,
        test_passed=tests.filter(passed=True).exists(),
        test_attempts=tests.count(),
        last_quiz_score=last_quiz.score if last_quiz else None,
        quiz_attempts=quizzes.count(),
        last_practiced=attempts.first().created_at if attempts.exists() else None,
    )


def sample_questions(course_slug, count):
    qs = list(ReviewQuestion.objects.filter(course__slug=course_slug))
    random.shuffle(qs)
    return qs[:count] if count else qs


class PracticeQuery(graphene.ObjectType):
    practice = graphene.List(PracticeSummaryType, learner_id=graphene.ID(required=True))
    flashcards = graphene.List(FlashcardType, learner_id=graphene.ID(required=True),
                               course_slug=graphene.String(required=True), due_only=graphene.Boolean())
    quiz_questions = graphene.List(ReviewQuestionType, course_slug=graphene.String(required=True),
                                   count=graphene.Int())
    test_questions = graphene.List(ReviewQuestionType, course_slug=graphene.String(required=True),
                                   count=graphene.Int())
    exercises = graphene.List(ExerciseType, learner_id=graphene.ID(required=True),
                              course_slug=graphene.String(required=True))
    exercise = graphene.Field(ExerciseType, learner_id=graphene.ID(required=True), key=graphene.String(required=True))
    practice_history = graphene.List(PracticeAttemptType, learner_id=graphene.ID(required=True),
                                     course_slug=graphene.String(), limit=graphene.Int())

    def resolve_practice(self, info, learner_id):
        return [build_summary(learner_id, c) for c in Course.objects.all()]

    def resolve_flashcards(self, info, learner_id, course_slug, due_only=False):
        cards = Flashcard.objects.filter(course__slug=course_slug)
        reviews = {r.card_id: r for r in CardReview.objects.filter(learner_id=learner_id, card__course__slug=course_slug)}
        states = [card_state(c, reviews.get(c.id)) for c in cards]
        if due_only:
            states = [st for st in states if st.is_due]
        return states

    def resolve_quiz_questions(self, info, course_slug, count=8):
        return sample_questions(course_slug, count)

    def resolve_test_questions(self, info, course_slug, count=15):
        return sample_questions(course_slug, count)

    def resolve_exercises(self, info, learner_id, course_slug):
        qs = Exercise.objects.select_related("course").filter(course__slug=course_slug)
        return [exercise_state(e, learner_id) for e in qs]

    def resolve_exercise(self, info, learner_id, key):
        ex = Exercise.objects.select_related("course").filter(key=key).first()
        return exercise_state(ex, learner_id) if ex else None

    def resolve_practice_history(self, info, learner_id, course_slug=None, limit=20):
        qs = PracticeAttempt.objects.select_related("course", "exercise").filter(learner_id=learner_id)
        if course_slug:
            qs = qs.filter(course__slug=course_slug)
        return qs[:limit]


class ReviewCard(graphene.Mutation):
    class Arguments:
        learner_id = graphene.ID(required=True)
        card_id = graphene.ID(required=True)
        known = graphene.Boolean(required=True)

    card = graphene.Field(FlashcardType)

    def mutate(self, info, learner_id, card_id, known):
        card = Flashcard.objects.get(pk=card_id)
        review, _ = CardReview.objects.get_or_create(learner_id=learner_id, card=card)
        review.apply(known)
        review.save()
        return ReviewCard(card=card_state(card, review))


class RecordPractice(graphene.Mutation):
    class Arguments:
        learner_id = graphene.ID(required=True)
        course_slug = graphene.String(required=True)
        mode = graphene.String(required=True)
        correct = graphene.Int(required=True)
        total = graphene.Int(required=True)
        seconds = graphene.Float()
        exercise_key = graphene.String()

    attempt = graphene.Field(PracticeAttemptType)
    summary = graphene.Field(PracticeSummaryType)

    def mutate(self, info, learner_id, course_slug, mode, correct, total, seconds=0, exercise_key=None):
        if mode not in dict(PracticeAttempt.MODE_CHOICES):
            raise Exception(f"Unknown practice mode: {mode}")
        course = Course.objects.get(slug=course_slug)
        exercise = Exercise.objects.filter(key=exercise_key).first() if exercise_key else None
        score = round(correct / total * 100, 1) if total else 0.0
        if mode == "test":
            passed = score >= TEST_PASS_SCORE
        elif mode == "quiz":
            passed = score >= QUIZ_PASS_SCORE
        else:
            passed = total > 0 and correct >= total
        attempt = PracticeAttempt.objects.create(
            learner_id=learner_id, course=course, mode=mode, exercise=exercise,
            correct=correct, total=total, score=score, seconds=seconds or 0, passed=passed,
        )
        return RecordPractice(attempt=attempt, summary=build_summary(learner_id, course))


class PracticeMutation(graphene.ObjectType):
    review_card = ReviewCard.Field()
    record_practice = RecordPractice.Field()


class Query(LessonQuery, PracticeQuery, graphene.ObjectType):
    pass


class Mutation(LessonMutation, PracticeMutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
