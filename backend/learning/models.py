from datetime import timedelta

from django.db import models
from django.utils import timezone


class Learner(models.Model):
    """A person using the app. No password: this is a local, single-machine app."""
    name = models.CharField(max_length=80, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Course(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=120)
    description = models.TextField()
    icon = models.CharField(max_length=8, default="📘")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title


class Module(models.Model):
    course = models.ForeignKey(Course, related_name="modules", on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.course.title} / {self.title}"


class Lesson(models.Model):
    KIND_CHOICES = [
        ("reading", "Reading"),
        ("typing", "Typing practice"),
        ("quiz", "Quiz"),
        ("word", "Word editor task"),
        ("code", "Code playground"),
        ("web", "HTML/CSS playground"),
        ("mouse", "Mouse practice"),
        ("shortcuts", "Keyboard shortcut practice"),
        ("files", "File Explorer practice"),
        ("browser", "Web browser practice"),
        ("email", "Email practice"),
        ("settings", "Settings practice"),
        ("sheet", "Spreadsheet practice"),
    ]
    module = models.ForeignKey(Module, related_name="lessons", on_delete=models.CASCADE)
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=160)
    kind = models.CharField(max_length=16, choices=KIND_CHOICES, default="reading")
    order = models.PositiveIntegerField(default=0)
    content = models.TextField(blank=True, help_text="Markdown shown to the learner")
    data = models.JSONField(default=dict, blank=True, help_text="Kind-specific payload")
    minutes = models.PositiveIntegerField(default=5)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title


class LessonProgress(models.Model):
    STATUS_CHOICES = [("started", "Started"), ("completed", "Completed")]
    learner = models.ForeignKey(Learner, related_name="progress", on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, related_name="progress", on_delete=models.CASCADE)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default="started")
    score = models.FloatField(null=True, blank=True, help_text="0-100 for quizzes / tasks")
    best_wpm = models.FloatField(null=True, blank=True)
    best_accuracy = models.FloatField(null=True, blank=True)
    attempts = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("learner", "lesson")


class TypingAttempt(models.Model):
    learner = models.ForeignKey(Learner, related_name="typing_attempts", on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, related_name="typing_attempts", on_delete=models.CASCADE)
    wpm = models.FloatField()
    accuracy = models.FloatField()
    seconds = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


# ---------------------------------------------------------------------------
# Practice: flashcards, question bank, exercises and attempts
# ---------------------------------------------------------------------------

class Flashcard(models.Model):
    """One front/back card belonging to a course. Seeded from content/practice.py."""
    course = models.ForeignKey(Course, related_name="flashcards", on_delete=models.CASCADE)
    key = models.SlugField()
    front = models.TextField()
    back = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        unique_together = ("course", "key")

    def __str__(self):
        return f"{self.course.slug}: {self.front[:40]}"


# Leitner boxes: after a correct answer a card moves up one box and comes back later.
# A wrong answer drops it back to box 1 so it is seen again right away.
LEITNER_INTERVALS_DAYS = {1: 0, 2: 1, 3: 3, 4: 7, 5: 30}
MASTERED_BOX = 5


class CardReview(models.Model):
    learner = models.ForeignKey(Learner, related_name="card_reviews", on_delete=models.CASCADE)
    card = models.ForeignKey(Flashcard, related_name="reviews", on_delete=models.CASCADE)
    box = models.PositiveSmallIntegerField(default=1)
    due = models.DateTimeField(default=timezone.now)
    reviews = models.PositiveIntegerField(default=0)
    lapses = models.PositiveIntegerField(default=0)
    last_reviewed = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("learner", "card")

    @property
    def is_due(self):
        return self.due <= timezone.now()

    @property
    def mastered(self):
        return self.box >= MASTERED_BOX

    def apply(self, known: bool):
        """Move the card to the next Leitner box (known) or back to box 1 (not known)."""
        now = timezone.now()
        self.reviews += 1
        self.last_reviewed = now
        if known:
            self.box = min(self.box + 1, MASTERED_BOX)
        else:
            self.box = 1
            self.lapses += 1
        self.due = now + timedelta(days=LEITNER_INTERVALS_DAYS[self.box])


class ReviewQuestion(models.Model):
    """A multiple-choice question in a course's question bank (used by quick quizzes and tests)."""
    course = models.ForeignKey(Course, related_name="questions", on_delete=models.CASCADE)
    key = models.SlugField()
    question = models.TextField()
    options = models.JSONField(default=list)
    answer = models.PositiveSmallIntegerField(help_text="Index of the correct option")
    explain = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        unique_together = ("course", "key")

    def __str__(self):
        return self.question[:60]


class Exercise(models.Model):
    """A short practice task (typing / word / code / web) outside the lesson sequence."""
    KIND_CHOICES = [
        ("typing", "Typing practice"),
        ("word", "Word editor task"),
        ("code", "Code playground"),
        ("web", "HTML/CSS playground"),
    ]
    course = models.ForeignKey(Course, related_name="exercises", on_delete=models.CASCADE)
    key = models.SlugField(unique=True)
    title = models.CharField(max_length=160)
    kind = models.CharField(max_length=16, choices=KIND_CHOICES)
    content = models.TextField(blank=True, help_text="Markdown shown above the task")
    data = models.JSONField(default=dict, blank=True)
    minutes = models.PositiveIntegerField(default=5)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title


class PracticeAttempt(models.Model):
    MODE_CHOICES = [
        ("flashcards", "Flashcard session"),
        ("quiz", "Quick quiz"),
        ("test", "Test"),
        ("exercise", "Exercise"),
    ]
    learner = models.ForeignKey(Learner, related_name="practice_attempts", on_delete=models.CASCADE)
    course = models.ForeignKey(Course, related_name="practice_attempts", on_delete=models.CASCADE)
    mode = models.CharField(max_length=12, choices=MODE_CHOICES)
    exercise = models.ForeignKey(Exercise, null=True, blank=True, related_name="attempts", on_delete=models.CASCADE)
    correct = models.PositiveIntegerField(default=0)
    total = models.PositiveIntegerField(default=0)
    score = models.FloatField(default=0, help_text="0-100")
    seconds = models.FloatField(default=0)
    passed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
