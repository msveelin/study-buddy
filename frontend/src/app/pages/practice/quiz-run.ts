import { Component, HostListener, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { LearnerService } from '../../core/learner.service';
import { ProgressStore } from '../../core/progress.store';
import { QUIZ_PASS_SCORE, QUIZ_SIZE, ReviewQuestion, TEST_PASS_SCORE, TEST_SECONDS_PER_QUESTION, TEST_SIZE } from '../../core/models';
import { Icon } from '../../core/icon';

interface RunQuestion extends ReviewQuestion {
  /** Options in shuffled order, each remembering its original index. */
  shuffled: { text: string; idx: number }[];
}

/**
 * Runs a quick quiz (instant feedback, one question at a time) or a timed test
 * (no feedback until the end). The mode comes from the route's data.
 */
@Component({
  selector: 'app-quiz-run',
  imports: [RouterLink, DecimalPipe, Icon],
  template: `
    <a [routerLink]="['/practice', slug()]" class="back">← {{ courseTitle() }}</a>

    @if (error()) { <div class="notice error">{{ error() }}</div> }
    @else if (loading()) { <p class="muted">Picking questions…</p> }
    @else if (!started()) {
      <section class="card intro rise">
        <div class="big">@if (isTest) { <app-icon name="trophy" [size]="56" /> } @else { <app-icon name="zap" [size]="56" /> }</div>
        <h1>{{ isTest ? 'Course test' : 'Quick quiz' }}</h1>
        @if (isTest) {
          <p class="lead">{{ questions().length }} questions, {{ minutes() }} minutes. You will not see the answers until you submit.
            Score <b>{{ passScore }}%</b> or more to pass. You can retake it any time.</p>
        } @else {
          <p class="lead">{{ questions().length }} random questions. You get the answer and an explanation after each one. Pass mark is {{ passScore }}%, but the point is to remember.</p>
        }
        <button class="primary" (click)="start()">{{ isTest ? 'Start the clock' : 'Start' }}</button>
      </section>
    }
    @else if (submitted()) {
      <section class="card result rise" [class.pass]="passed()">
        <div class="big">@if (passed()) { <app-icon name="party-popper" [size]="56" /> } @else { <app-icon name="dumbbell" [size]="56" /> }</div>
        <h1>{{ score() | number:'1.0-0' }}%</h1>
        <p class="lead">{{ correctCount() }} of {{ questions().length }} correct.
          {{ passed() ? (isTest ? 'Test passed and saved!' : 'Well remembered!') : 'Not quite ' + passScore + '%. Read the explanations below, then try again.' }}
          @if (timedOut()) { <br><b>Time ran out</b>, so unanswered questions count as wrong. }
        </p>
        <div class="row">
          <button class="primary" (click)="reload()">{{ isTest ? 'Retake the test' : 'Another quiz' }}</button>
          <a class="btn" [routerLink]="['/practice', slug(), 'flashcards']">Review flashcards</a>
          <a class="btn" [routerLink]="['/practice', slug()]">Back to practice</a>
        </div>
      </section>

      <h2 class="section">Your answers</h2>
      @for (q of questions(); track q.id; let qi = $index) {
        <div class="card q rise" [class.right]="isRight(qi)" [class.wrong]="!isRight(qi)">
          <h3>{{ qi + 1 }}. {{ q.question }}</h3>
          <div class="options">
            @for (o of q.shuffled; track o.idx) {
              <div class="opt" [class.chosen]="selected()[qi] === o.idx" [class.correct]="o.idx === q.answer">
                <span class="mark">@if (o.idx === q.answer) { <app-icon name="check" [size]="14" [stroke]="3" /> } @else if (selected()[qi] === o.idx) { <app-icon name="x" [size]="14" [stroke]="3" /> }</span> {{ o.text }}
              </div>
            }
          </div>
          @if (selected()[qi] == null) { <p class="explain">Not answered.</p> }
          @if (q.explain) { <p class="explain">{{ q.explain }}</p> }
        </div>
      }
    }
    @else {
      <div class="top">
        <div class="progress-bar"><span [style.width.%]="((index() + 1) / questions().length) * 100"></span></div>
        <span class="muted count">{{ index() + 1 }} / {{ questions().length }}</span>
        @if (isTest) { <span class="timer" [class.low]="secondsLeft() < 60">⏱ {{ clock() }}</span> }
      </div>

      @if (current(); as q) {
        <section class="card q rise" [class.right]="feedback() && isRight(index())" [class.wrong]="feedback() && !isRight(index())">
          <h2>{{ q.question }}</h2>
          <div class="options">
            @for (o of q.shuffled; track o.idx; let oi = $index) {
              <label [class.chosen]="selected()[index()] === o.idx" [class.correct]="feedback() && o.idx === q.answer">
                <input type="radio" name="opt" [checked]="selected()[index()] === o.idx" [disabled]="feedback()" (change)="choose(o.idx)">
                <kbd>{{ oi + 1 }}</kbd> {{ o.text }}
              </label>
            }
          </div>
          @if (feedback()) {
            <p class="explain">@if (isRight(index())) { <app-icon name="check" [size]="16" [stroke]="3" /> Correct! } @else { <app-icon name="x" [size]="16" [stroke]="3" /> Not quite. } {{ q.explain }}</p>
          }
          <div class="nav">
            @if (isTest) {
              <button (click)="go(-1)" [disabled]="index() === 0">← Previous</button>
              @if (index() < questions().length - 1) {
                <button class="primary" (click)="go(1)">Next →</button>
              } @else {
                <button class="primary" (click)="submit(false)" [disabled]="!allAnswered()">Submit test</button>
              }
              @if (!allAnswered() && index() === questions().length - 1) { <span class="muted">Answer every question first ({{ answeredCount() }} / {{ questions().length }}).</span> }
            } @else {
              @if (!feedback()) {
                <button class="primary" (click)="check()" [disabled]="selected()[index()] == null">Check</button>
              } @else if (index() < questions().length - 1) {
                <button class="primary" (click)="go(1)">Next →</button>
              } @else {
                <button class="primary" (click)="submit(false)">See my score</button>
              }
            }
          </div>
        </section>
      }
    }
  `,
  styles: `
    .back { display: inline-block; margin-bottom: 14px; text-decoration: none; font-weight: 600; }
    .top { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
    .top .progress-bar { flex: 1; }
    .count { font-weight: 800; }
    .timer { font-weight: 800; font-variant-numeric: tabular-nums; padding: 4px 12px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); }
    .timer.low { background: var(--danger-soft); color: var(--danger); }

    .intro, .result { max-width: 720px; margin: 0 auto; text-align: center; }
    .big { font-size: 3rem; }
    .lead { font-size: 1.1rem; }
    .result h1 { font-size: 3rem; color: var(--warn); }
    .result.pass h1 { color: var(--success); }
    .row { justify-content: center; }
    .btn { text-decoration: none; }
    .section { margin: 26px 0 12px; }

    .q { margin-bottom: 14px; }
    .q h2 { font-size: 1.3rem; }
    .q h3 { margin-bottom: 8px; }
    .options { display: grid; gap: 8px; }
    label, .opt { display: flex; gap: 10px; align-items: center; padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 12px; cursor: pointer; }
    .opt { cursor: default; }
    label:hover { background: var(--bg); }
    label input { accent-color: var(--accent); }
    kbd { font: inherit; font-size: .75rem; font-weight: 800; padding: 1px 7px; border-radius: 6px; background: var(--bg-deep); color: var(--muted); }
    .chosen { border-color: var(--accent); background: var(--accent-soft); }
    .correct { border-color: var(--success); background: var(--success-soft); }
    .wrong .chosen:not(.correct) { border-color: var(--danger); background: var(--danger-soft); }
    .mark { width: 20px; font-weight: 900; }
    .right .mark { color: var(--success); }
    .explain { margin: 12px 0 0; color: var(--muted); font-size: .95rem; }
    .nav { display: flex; gap: 10px; align-items: center; margin-top: 18px; flex-wrap: wrap; }
  `,
})
export class QuizRunPage implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private learner = inject(LearnerService);
  private route = inject(ActivatedRoute);
  private store = inject(ProgressStore);

  isTest = false;
  passScore = QUIZ_PASS_SCORE;

  slug = signal('');
  questions = signal<RunQuestion[]>([]);
  selected = signal<(number | null)[]>([]);
  index = signal(0);
  feedback = signal(false);
  started = signal(false);
  submitted = signal(false);
  timedOut = signal(false);
  loading = signal(true);
  error = signal('');
  secondsLeft = signal(0);
  private timer: any = null;
  private startedAt = 0;

  current = computed(() => this.questions()[this.index()] ?? null);
  courseTitle = computed(() => this.store.practiceFor(this.slug())?.courseTitle ?? 'Practice');
  correctCount = computed(() => this.questions().filter((q, i) => this.selected()[i] === q.answer).length);
  score = computed(() => this.questions().length ? (this.correctCount() / this.questions().length) * 100 : 0);
  passed = computed(() => this.score() >= this.passScore);
  answeredCount = computed(() => this.selected().filter(s => s != null).length);
  allAnswered = computed(() => this.answeredCount() === this.questions().length);
  minutes = computed(() => Math.ceil((this.questions().length * TEST_SECONDS_PER_QUESTION) / 60));
  clock = computed(() => {
    const s = Math.max(0, this.secondsLeft());
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  });

  ngOnInit() {
    this.isTest = this.route.snapshot.data['mode'] === 'test';
    this.passScore = this.isTest ? TEST_PASS_SCORE : QUIZ_PASS_SCORE;
    this.route.paramMap.subscribe(pm => { this.slug.set(pm.get('slug')!); this.reload(); });
  }

  ngOnDestroy() { this.stopTimer(); }

  /** Keyboard: 1-9 picks an option, Enter checks / moves on / submits. */
  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (!this.started() || this.submitted() || !this.current()) return;
    const n = Number(e.key);
    if (n >= 1 && n <= this.current()!.shuffled.length) {
      this.choose(this.current()!.shuffled[n - 1].idx);
      e.preventDefault();
      return;
    }
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const last = this.index() === this.questions().length - 1;
    if (this.isTest) {
      if (!last) this.go(1);
      else if (this.allAnswered()) this.submit(false);
    } else if (!this.feedback()) {
      this.check();
    } else if (!last) {
      this.go(1);
    } else {
      this.submit(false);
    }
  }

  async reload() {
    this.stopTimer();
    this.loading.set(true);
    this.error.set('');
    this.started.set(false);
    this.submitted.set(false);
    this.timedOut.set(false);
    this.feedback.set(false);
    this.index.set(0);
    try {
      const raw = this.isTest
        ? await this.api.testQuestions(this.slug(), TEST_SIZE)
        : await this.api.quizQuestions(this.slug(), QUIZ_SIZE);
      if (!raw.length) { this.error.set('There are no questions for this course yet.'); return; }
      this.questions.set(raw.map(q => ({ ...q, shuffled: shuffle(q.options.map((text, idx) => ({ text, idx }))) })));
      this.selected.set(new Array(raw.length).fill(null));
      if (!this.store.practice().length) this.store.refresh();
    } catch (e: any) {
      this.error.set('Could not load questions. ' + (e?.message ?? ''));
    } finally {
      this.loading.set(false);
    }
  }

  start() {
    this.started.set(true);
    this.startedAt = Date.now();
    if (this.isTest) {
      this.secondsLeft.set(this.questions().length * TEST_SECONDS_PER_QUESTION);
      this.timer = setInterval(() => {
        this.secondsLeft.update(s => s - 1);
        if (this.secondsLeft() <= 0) this.submit(true);
      }, 1000);
    }
  }

  choose(idx: number) {
    if (this.feedback()) return;
    this.selected.update(s => { const c = [...s]; c[this.index()] = idx; return c; });
  }

  check() { if (this.selected()[this.index()] != null) this.feedback.set(true); }

  go(delta: number) {
    this.index.update(i => Math.min(Math.max(i + delta, 0), this.questions().length - 1));
    this.feedback.set(false);
  }

  isRight(i: number) { return this.selected()[i] === this.questions()[i]?.answer; }

  async submit(timedOut: boolean) {
    if (this.submitted()) return;
    this.stopTimer();
    this.timedOut.set(timedOut);
    this.submitted.set(true);
    const seconds = Math.round((Date.now() - this.startedAt) / 1000);
    try {
      await this.api.recordPractice(this.learner.current()!.id, this.slug(), this.isTest ? 'test' : 'quiz',
        this.correctCount(), this.questions().length, seconds);
      this.store.refresh();
    } catch (e: any) {
      this.error.set('Your score could not be saved: ' + (e?.message ?? ''));
    }
  }

  private stopTimer() { if (this.timer) { clearInterval(this.timer); this.timer = null; } }
}

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
