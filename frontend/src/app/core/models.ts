export type LessonKind = 'reading' | 'typing' | 'quiz' | 'word' | 'code' | 'web'
  | 'mouse' | 'shortcuts' | 'files' | 'browser' | 'email' | 'settings' | 'sheet';

export interface Learner {
  id: string;
  name: string;
}

export interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  kind: LessonKind;
  minutes: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: LessonSummary[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  lessonCount: number;
  modules: Module[];
}

export interface Lesson extends LessonSummary {
  content: string;
  data: any;
  courseSlug: string;
  courseTitle: string;
  moduleTitle: string;
}

export interface Progress {
  lessonSlug: string;
  courseSlug: string;
  status: 'STARTED' | 'COMPLETED' | string;
  score: number | null;
  bestWpm: number | null;
  bestAccuracy: number | null;
  attempts: number;
}

export interface Dashboard {
  lessonsCompleted: number;
  lessonsTotal: number;
  bestWpm: number | null;
  avgAccuracy: number | null;
  typingAttempts: number;
  courses: { courseSlug: string; total: number; completed: number }[];
  cardsDue: number;
  practiceSessions: number;
  nextLesson: { slug: string; title: string; kind: LessonKind; courseTitle: string } | null;
}

export const KIND_LABEL: Record<LessonKind, string> = {
  reading: 'Read',
  typing: 'Typing practice',
  quiz: 'Quiz',
  word: 'Word practice',
  code: 'Code',
  web: 'Build a page',
  mouse: 'Mouse game',
  shortcuts: 'Shortcut practice',
  files: 'File Explorer practice',
  browser: 'Browser practice',
  email: 'Email practice',
  settings: 'Settings practice',
  sheet: 'Spreadsheet practice',
};

export const KIND_ICON: Record<LessonKind, string> = {
  reading: 'book-open',
  typing: 'keyboard',
  quiz: 'circle-help',
  word: 'file-text',
  code: 'code',
  web: 'layout-template',
  mouse: 'mouse-pointer-click',
  shortcuts: 'command',
  files: 'folder-open',
  browser: 'compass',
  email: 'mail',
  settings: 'settings',
  sheet: 'table',
};

/* ---------------------------------------------------------------- Practice */

export type PracticeMode = 'flashcards' | 'quiz' | 'test' | 'exercise';
export type ExerciseKind = 'typing' | 'word' | 'code' | 'web';

export interface Flashcard {
  id: string;
  key: string;
  front: string;
  back: string;
  box: number;
  due: string | null;
  isDue: boolean;
  mastered: boolean;
  seen: boolean;
  reviews: number;
  lapses: number;
}

export interface ReviewQuestion {
  id: string;
  key: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface Exercise {
  id: string;
  key: string;
  title: string;
  kind: ExerciseKind;
  content: string;
  data: any;
  minutes: number;
  courseSlug: string;
  courseTitle: string;
  done: boolean;
  attempts: number;
}

export interface PracticeAttempt {
  id: string;
  mode: PracticeMode | string;
  courseSlug: string;
  exerciseKey: string | null;
  exerciseTitle: string | null;
  correct: number;
  total: number;
  score: number;
  seconds: number;
  passed: boolean;
  createdAt: string;
}

export interface PracticeSummary {
  courseSlug: string;
  courseTitle: string;
  courseIcon: string;
  cardsTotal: number;
  cardsDue: number;
  cardsSeen: number;
  cardsMastered: number;
  questionsTotal: number;
  exercisesTotal: number;
  exercisesDone: number;
  bestTestScore: number | null;
  testPassed: boolean;
  testAttempts: number;
  lastQuizScore: number | null;
  quizAttempts: number;
  lastPracticed: string | null;
}

export const TEST_PASS_SCORE = 80;
export const QUIZ_PASS_SCORE = 70;
export const QUIZ_SIZE = 8;
export const TEST_SIZE = 15;
export const TEST_SECONDS_PER_QUESTION = 45;

export const MODE_LABEL: Record<string, string> = {
  flashcards: 'Flashcards',
  quiz: 'Quick quiz',
  test: 'Test',
  exercise: 'Exercise',
};

export const MODE_ICON: Record<string, string> = {
  flashcards: 'layers',
  quiz: 'zap',
  test: 'trophy',
  exercise: 'dumbbell',
};
