import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';
import { Course, Dashboard, Exercise, Flashcard, Learner, Lesson, PracticeAttempt, PracticeMode, PracticeSummary, Progress, ReviewQuestion } from './models';

const LEARNERS = gql`query Learners { learners { id name } }`;
const CREATE_LEARNER = gql`mutation CreateLearner($name: String!) { createLearner(name: $name) { learner { id name } } }`;

const COURSES = gql`query Courses {
  courses { id slug title description icon lessonCount
    modules { id title lessons { id slug title kind minutes } } }
}`;
const COURSE = gql`query Course($slug: String!) {
  course(slug: $slug) { id slug title description icon lessonCount
    modules { id title lessons { id slug title kind minutes } } }
}`;
const LESSON = gql`query Lesson($slug: String!) {
  lesson(slug: $slug) { id slug title kind minutes content data courseSlug courseTitle moduleTitle }
}`;
const PROGRESS = gql`query Progress($learnerId: ID!) {
  progress(learnerId: $learnerId) { lessonSlug courseSlug status score bestWpm bestAccuracy attempts }
}`;
const DASHBOARD = gql`query Dashboard($learnerId: ID!) {
  dashboard(learnerId: $learnerId) {
    lessonsCompleted lessonsTotal bestWpm avgAccuracy typingAttempts cardsDue practiceSessions
    courses { courseSlug total completed }
    nextLesson { slug title kind courseTitle }
  }
}`;
const SAVE_PROGRESS = gql`mutation SaveProgress($learnerId: ID!, $lessonSlug: String!, $status: String!, $score: Float) {
  saveProgress(learnerId: $learnerId, lessonSlug: $lessonSlug, status: $status, score: $score) {
    progress { lessonSlug courseSlug status score bestWpm bestAccuracy attempts }
  }
}`;
const RECORD_TYPING = gql`mutation RecordTyping($learnerId: ID!, $lessonSlug: String!, $wpm: Float!, $accuracy: Float!, $seconds: Float!) {
  recordTypingAttempt(learnerId: $learnerId, lessonSlug: $lessonSlug, wpm: $wpm, accuracy: $accuracy, seconds: $seconds) {
    progress { lessonSlug courseSlug status score bestWpm bestAccuracy attempts }
  }
}`;
const RESET = gql`mutation Reset($learnerId: ID!) { resetProgress(learnerId: $learnerId) { ok } }`;

/* Practice */
const SUMMARY_FIELDS = `courseSlug courseTitle courseIcon cardsTotal cardsDue cardsSeen cardsMastered questionsTotal
  exercisesTotal exercisesDone bestTestScore testPassed testAttempts lastQuizScore quizAttempts lastPracticed`;
const CARD_FIELDS = `id key front back box due isDue mastered seen reviews lapses`;
const EXERCISE_FIELDS = `id key title kind content data minutes courseSlug courseTitle done attempts`;
const ATTEMPT_FIELDS = `id mode courseSlug exerciseKey exerciseTitle correct total score seconds passed createdAt`;

const PRACTICE = gql`query Practice($learnerId: ID!) { practice(learnerId: $learnerId) { ${SUMMARY_FIELDS} } }`;
const FLASHCARDS = gql`query Flashcards($learnerId: ID!, $courseSlug: String!, $dueOnly: Boolean) {
  flashcards(learnerId: $learnerId, courseSlug: $courseSlug, dueOnly: $dueOnly) { ${CARD_FIELDS} }
}`;
const QUIZ_QUESTIONS = gql`query QuizQuestions($courseSlug: String!, $count: Int) {
  quizQuestions(courseSlug: $courseSlug, count: $count) { id key question options answer explain }
}`;
const TEST_QUESTIONS = gql`query TestQuestions($courseSlug: String!, $count: Int) {
  testQuestions(courseSlug: $courseSlug, count: $count) { id key question options answer explain }
}`;
const EXERCISES = gql`query Exercises($learnerId: ID!, $courseSlug: String!) {
  exercises(learnerId: $learnerId, courseSlug: $courseSlug) { ${EXERCISE_FIELDS} }
}`;
const EXERCISE = gql`query Exercise($learnerId: ID!, $key: String!) {
  exercise(learnerId: $learnerId, key: $key) { ${EXERCISE_FIELDS} }
}`;
const PRACTICE_HISTORY = gql`query PracticeHistory($learnerId: ID!, $courseSlug: String, $limit: Int) {
  practiceHistory(learnerId: $learnerId, courseSlug: $courseSlug, limit: $limit) { ${ATTEMPT_FIELDS} }
}`;
const REVIEW_CARD = gql`mutation ReviewCard($learnerId: ID!, $cardId: ID!, $known: Boolean!) {
  reviewCard(learnerId: $learnerId, cardId: $cardId, known: $known) { card { ${CARD_FIELDS} } }
}`;
const RECORD_PRACTICE = gql`mutation RecordPractice($learnerId: ID!, $courseSlug: String!, $mode: String!, $correct: Int!, $total: Int!, $seconds: Float, $exerciseKey: String) {
  recordPractice(learnerId: $learnerId, courseSlug: $courseSlug, mode: $mode, correct: $correct, total: $total, seconds: $seconds, exerciseKey: $exerciseKey) {
    attempt { ${ATTEMPT_FIELDS} }
    summary { ${SUMMARY_FIELDS} }
  }
}`;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apollo = inject(Apollo);

  private async query<T>(query: any, variables: any = {}): Promise<T> {
    const res = await firstValueFrom(this.apollo.query<T>({ query, variables, fetchPolicy: 'network-only' }));
    return res.data as T;
  }

  private async mutate<T>(mutation: any, variables: any = {}): Promise<T> {
    const res = await firstValueFrom(this.apollo.mutate<T>({ mutation, variables }));
    return res.data as T;
  }

  async learners(): Promise<Learner[]> {
    return (await this.query<{ learners: Learner[] }>(LEARNERS)).learners;
  }

  async createLearner(name: string): Promise<Learner> {
    return (await this.mutate<{ createLearner: { learner: Learner } }>(CREATE_LEARNER, { name })).createLearner.learner;
  }

  async courses(): Promise<Course[]> {
    return (await this.query<{ courses: Course[] }>(COURSES)).courses;
  }

  async course(slug: string): Promise<Course | null> {
    return (await this.query<{ course: Course | null }>(COURSE, { slug })).course;
  }

  async lesson(slug: string): Promise<Lesson | null> {
    const raw = (await this.query<{ lesson: any }>(LESSON, { slug })).lesson;
    if (!raw) return null;
    return { ...raw, data: typeof raw.data === 'string' ? JSON.parse(raw.data) : raw.data ?? {} };
  }

  async progress(learnerId: string): Promise<Progress[]> {
    return (await this.query<{ progress: Progress[] }>(PROGRESS, { learnerId })).progress;
  }

  async dashboard(learnerId: string): Promise<Dashboard> {
    return (await this.query<{ dashboard: Dashboard }>(DASHBOARD, { learnerId })).dashboard;
  }

  async saveProgress(learnerId: string, lessonSlug: string, status: 'started' | 'completed', score?: number): Promise<Progress> {
    return (await this.mutate<{ saveProgress: { progress: Progress } }>(SAVE_PROGRESS, { learnerId, lessonSlug, status, score })).saveProgress.progress;
  }

  async recordTyping(learnerId: string, lessonSlug: string, wpm: number, accuracy: number, seconds: number): Promise<Progress> {
    return (await this.mutate<{ recordTypingAttempt: { progress: Progress } }>(RECORD_TYPING, { learnerId, lessonSlug, wpm, accuracy, seconds })).recordTypingAttempt.progress;
  }

  async resetProgress(learnerId: string): Promise<void> {
    await this.mutate(RESET, { learnerId });
  }

  /* ---------------------------------------------------------------- Practice */

  async practice(learnerId: string): Promise<PracticeSummary[]> {
    return (await this.query<{ practice: PracticeSummary[] }>(PRACTICE, { learnerId })).practice;
  }

  async flashcards(learnerId: string, courseSlug: string, dueOnly = false): Promise<Flashcard[]> {
    return (await this.query<{ flashcards: Flashcard[] }>(FLASHCARDS, { learnerId, courseSlug, dueOnly })).flashcards;
  }

  async quizQuestions(courseSlug: string, count: number): Promise<ReviewQuestion[]> {
    return (await this.query<{ quizQuestions: ReviewQuestion[] }>(QUIZ_QUESTIONS, { courseSlug, count })).quizQuestions;
  }

  async testQuestions(courseSlug: string, count: number): Promise<ReviewQuestion[]> {
    return (await this.query<{ testQuestions: ReviewQuestion[] }>(TEST_QUESTIONS, { courseSlug, count })).testQuestions;
  }

  async exercises(learnerId: string, courseSlug: string): Promise<Exercise[]> {
    const list = (await this.query<{ exercises: any[] }>(EXERCISES, { learnerId, courseSlug })).exercises;
    return list.map(e => this.parseExercise(e));
  }

  async exercise(learnerId: string, key: string): Promise<Exercise | null> {
    const raw = (await this.query<{ exercise: any }>(EXERCISE, { learnerId, key })).exercise;
    return raw ? this.parseExercise(raw) : null;
  }

  async practiceHistory(learnerId: string, courseSlug?: string, limit = 20): Promise<PracticeAttempt[]> {
    return (await this.query<{ practiceHistory: PracticeAttempt[] }>(PRACTICE_HISTORY, { learnerId, courseSlug, limit })).practiceHistory;
  }

  async reviewCard(learnerId: string, cardId: string, known: boolean): Promise<Flashcard> {
    return (await this.mutate<{ reviewCard: { card: Flashcard } }>(REVIEW_CARD, { learnerId, cardId, known })).reviewCard.card;
  }

  async recordPractice(learnerId: string, courseSlug: string, mode: PracticeMode, correct: number, total: number,
                       seconds = 0, exerciseKey?: string): Promise<{ attempt: PracticeAttempt; summary: PracticeSummary }> {
    return (await this.mutate<{ recordPractice: { attempt: PracticeAttempt; summary: PracticeSummary } }>(
      RECORD_PRACTICE, { learnerId, courseSlug, mode, correct, total, seconds, exerciseKey })).recordPractice;
  }

  private parseExercise(raw: any): Exercise {
    return { ...raw, data: typeof raw.data === 'string' ? JSON.parse(raw.data) : raw.data ?? {} };
  }
}
