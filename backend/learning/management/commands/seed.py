from django.core.management.base import BaseCommand
from django.db import transaction

from learning.content import COURSES
from learning.content.practice import PRACTICE
from learning.models import Course, Exercise, Flashcard, Lesson, Module, ReviewQuestion


class Command(BaseCommand):
    help = "Load (or refresh) all course content. Learner progress is preserved."

    @transaction.atomic
    def handle(self, *args, **options):
        seen_lessons = set()
        for ci, c in enumerate(COURSES):
            course, _ = Course.objects.update_or_create(
                slug=c["slug"],
                defaults={"title": c["title"], "description": c["description"],
                          "icon": c.get("icon", "📘"), "order": ci},
            )
            keep_modules = []
            for mi, m in enumerate(c["modules"]):
                module = Module.objects.filter(course=course, title=m["title"]).first()
                if module is None:
                    module = Module.objects.create(course=course, title=m["title"], order=mi)
                else:
                    module.order = mi
                    module.save()
                keep_modules.append(module.id)
                for li, l in enumerate(m["lessons"]):
                    Lesson.objects.update_or_create(
                        slug=l["slug"],
                        defaults={
                            "module": module,
                            "title": l["title"],
                            "kind": l.get("kind", "reading"),
                            "order": li,
                            "content": l.get("content", "").strip(),
                            "data": l.get("data", {}),
                            "minutes": l.get("minutes", 5),
                        },
                    )
                    seen_lessons.add(l["slug"])
            Module.objects.filter(course=course).exclude(id__in=keep_modules).delete()
        Lesson.objects.exclude(slug__in=seen_lessons).delete()
        self.seed_practice()
        self.stdout.write(self.style.SUCCESS(
            f"Seeded {Course.objects.count()} courses, {Module.objects.count()} modules, "
            f"{Lesson.objects.count()} lessons, {Flashcard.objects.count()} flashcards, "
            f"{ReviewQuestion.objects.count()} questions, {Exercise.objects.count()} exercises."
        ))

    def seed_practice(self):
        """Flashcards, question bank and exercises. Lesson quizzes are folded into the bank."""
        seen_exercises = set()
        for course in Course.objects.all():
            spec = PRACTICE.get(course.slug, {})
            keep_cards, keep_questions = [], []

            for i, c in enumerate(spec.get("flashcards", [])):
                obj, _ = Flashcard.objects.update_or_create(
                    course=course, key=c["key"],
                    defaults={"front": c["front"], "back": c["back"], "order": i},
                )
                keep_cards.append(obj.id)
            Flashcard.objects.filter(course=course).exclude(id__in=keep_cards).delete()

            order = 0
            for lesson in Lesson.objects.filter(module__course=course, kind="quiz"):
                for qi, qq in enumerate((lesson.data or {}).get("questions", [])):
                    obj, _ = ReviewQuestion.objects.update_or_create(
                        course=course, key=f"{lesson.slug}-{qi}",
                        defaults={"question": qq["q"], "options": qq["options"], "answer": qq["answer"],
                                  "explain": qq.get("explain", ""), "order": order},
                    )
                    keep_questions.append(obj.id)
                    order += 1
            for qq in spec.get("questions", []):
                obj, _ = ReviewQuestion.objects.update_or_create(
                    course=course, key=qq["key"],
                    defaults={"question": qq["question"], "options": qq["options"], "answer": qq["answer"],
                              "explain": qq.get("explain", ""), "order": order},
                )
                keep_questions.append(obj.id)
                order += 1
            ReviewQuestion.objects.filter(course=course).exclude(id__in=keep_questions).delete()

            for i, e in enumerate(spec.get("exercises", [])):
                Exercise.objects.update_or_create(
                    key=e["key"],
                    defaults={"course": course, "title": e["title"], "kind": e["kind"], "order": i,
                              "content": e.get("content", "").strip(), "data": e.get("data", {}),
                              "minutes": e.get("minutes", 5)},
                )
                seen_exercises.add(e["key"])
        Exercise.objects.exclude(key__in=seen_exercises).delete()
