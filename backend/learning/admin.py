from django.contrib import admin
from .models import (CardReview, Course, Exercise, Flashcard, Learner, Lesson, LessonProgress, Module,
                     PracticeAttempt, ReviewQuestion, TypingAttempt)

admin.site.register(Learner)
admin.site.register(Course)
admin.site.register(Module)
admin.site.register(Lesson)
admin.site.register(LessonProgress)
admin.site.register(TypingAttempt)
admin.site.register(Flashcard)
admin.site.register(CardReview)
admin.site.register(ReviewQuestion)
admin.site.register(Exercise)
admin.site.register(PracticeAttempt)
