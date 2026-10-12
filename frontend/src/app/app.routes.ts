import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LearnerService } from './core/learner.service';

const requireLearner = () => {
  const learner = inject(LearnerService);
  const router = inject(Router);
  return learner.current() ? true : router.createUrlTree(['/']);
};

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/welcome/welcome').then(m => m.WelcomePage) },
  { path: 'dashboard', canActivate: [requireLearner], loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardPage) },
  { path: 'course/:slug', canActivate: [requireLearner], loadComponent: () => import('./pages/course/course').then(m => m.CoursePage) },
  { path: 'lesson/:slug', canActivate: [requireLearner], loadComponent: () => import('./pages/lesson/lesson').then(m => m.LessonPage) },
  { path: 'practice', canActivate: [requireLearner], loadComponent: () => import('./pages/practice/practice-hub').then(m => m.PracticeHubPage) },
  { path: 'practice/:slug', canActivate: [requireLearner], loadComponent: () => import('./pages/practice/practice-course').then(m => m.PracticeCoursePage) },
  { path: 'practice/:slug/flashcards', canActivate: [requireLearner], loadComponent: () => import('./pages/practice/flashcards').then(m => m.FlashcardsPage) },
  { path: 'practice/:slug/quiz', canActivate: [requireLearner], data: { mode: 'quiz' }, loadComponent: () => import('./pages/practice/quiz-run').then(m => m.QuizRunPage) },
  { path: 'practice/:slug/test', canActivate: [requireLearner], data: { mode: 'test' }, loadComponent: () => import('./pages/practice/quiz-run').then(m => m.QuizRunPage) },
  { path: 'practice/:slug/exercises/:key', canActivate: [requireLearner], loadComponent: () => import('./pages/practice/exercise').then(m => m.ExercisePage) },
  { path: 'help', loadComponent: () => import('./pages/help/help').then(m => m.HelpPage) },
  { path: '**', redirectTo: '' },
];
