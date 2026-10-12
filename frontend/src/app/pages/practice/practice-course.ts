import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { LearnerService } from '../../core/learner.service';
import { ProgressStore } from '../../core/progress.store';
import { Exercise, KIND_ICON, KIND_LABEL, MODE_ICON, MODE_LABEL, PracticeAttempt, TEST_PASS_SCORE, TEST_SIZE, QUIZ_SIZE } from '../../core/models';
import { Icon, courseIcon } from '../../core/icon';

/** One course's practice page: flashcards, quick quiz, test, exercises and recent attempts. */
@Component({
  selector: 'app-practice-course',
  imports: [RouterLink, DecimalPipe, DatePipe, Icon],
  template: `
    <a routerLink="/practice" class="back">← Practice</a>
    @if (summary(); as p) {
      <div [class]="'accent-' + p.courseSlug">
        <header class="head rise">
          <span class="icon"><app-icon [name]="courseIcon(p.courseSlug)" [size]="30" /></span>
          <div>
            <p class="eyebrow">Practice</p>
            <h1>{{ p.courseTitle }}</h1>
            <div class="chips">
              <span class="badge" [class.warn]="p.cardsDue > 0">{{ p.cardsDue }} cards due</span>
              <span class="badge">{{ p.cardsMastered }} / {{ p.cardsTotal }} mastered</span>
              <span class="badge">{{ p.questionsTotal }} questions in the bank</span>
              @if (p.testPassed) { <span class="badge done"><app-icon name="check" [size]="14" [stroke]="3" /> Test passed</span> }
            </div>
          </div>
        </header>

        <div class="tiles">
          <section class="card tile rise">
            <div class="tile-head"><span class="ico"><app-icon name="layers" [size]="22" /></span><h2>Flashcards</h2></div>
            <p class="muted">Flip a card, then say whether you knew it. Cards you miss come back sooner; cards you know move up through 5 boxes until they are mastered.</p>
            <div class="boxes" title="Cards per box">
              @for (b of boxes(); track $index; let i = $index) {
                <span class="box" [class.full]="b > 0"><b>{{ b }}</b><small>{{ i === 0 ? 'new' : 'box ' + i }}</small></span>
              }
            </div>
            <div class="row">
              <a class="btn primary" [routerLink]="['/practice', p.courseSlug, 'flashcards']">
                {{ p.cardsTotal === 0 ? 'No cards yet' : p.cardsDue > 0 ? 'Review ' + p.cardsDue + ' due' : 'All caught up' }}
              </a>
              <a class="btn" [routerLink]="['/practice', p.courseSlug, 'flashcards']" [queryParams]="{ all: 1 }">All {{ p.cardsTotal }} cards</a>
            </div>
          </section>

          <section class="card tile rise">
            <div class="tile-head"><span class="ico"><app-icon name="zap" [size]="22" /></span><h2>Quick quiz</h2></div>
            <p class="muted">{{ quizSize }} random questions from the bank, one at a time, with the answer explained straight away. Different every time.</p>
            <div class="big">
              @if (p.lastQuizScore != null) { <b>{{ p.lastQuizScore | number:'1.0-0' }}%</b><small>last score · {{ p.quizAttempts }} quiz{{ p.quizAttempts === 1 ? '' : 'zes' }} taken</small> }
              @else { <b>–</b><small>not taken yet</small> }
            </div>
            <a class="btn primary" [routerLink]="['/practice', p.courseSlug, 'quiz']">Start quick quiz</a>
          </section>

          <section class="card tile rise">
            <div class="tile-head"><span class="ico"><app-icon name="trophy" [size]="22" /></span><h2>Test</h2></div>
            <p class="muted">{{ testSize }} questions against the clock, no hints until the end. Score {{ passScore }}% or more to pass the course test.</p>
            <div class="big">
              @if (p.bestTestScore != null) { <b [class.pass]="p.testPassed">{{ p.bestTestScore | number:'1.0-0' }}%</b><small>best score · {{ p.testAttempts }} attempt{{ p.testAttempts === 1 ? '' : 's' }}</small> }
              @else { <b>–</b><small>not taken yet</small> }
            </div>
            <a class="btn primary" [routerLink]="['/practice', p.courseSlug, 'test']">{{ p.testPassed ? 'Take it again' : 'Start the test' }}</a>
          </section>
        </div>

        <section class="card rise" id="exercises">
          <div class="tile-head"><span class="ico"><app-icon name="dumbbell" [size]="22" /></span><h2>Exercises</h2>
            <span class="badge">{{ p.exercisesDone }} / {{ p.exercisesTotal }} done</span></div>
          <p class="muted">Short hands-on tasks that use what the lessons taught, in a new situation.</p>
          <ol class="exercises">
            @for (e of exercises(); track e.key) {
              <li>
                <a [routerLink]="['/practice', p.courseSlug, 'exercises', e.key]" [class.done]="e.done">
                  <span class="state">@if (e.done) { <app-icon name="check" [size]="16" [stroke]="3" /> } @else { <app-icon name="circle" [size]="14" /> }</span>
                  <span class="title">{{ e.title }}</span>
                  <span class="meta">
                    <span class="badge"><app-icon [name]="kindIcon(e.kind)" [size]="14" /> {{ kindLabel(e.kind) }}</span>
                    <span class="muted">{{ e.minutes }} min</span>
                    @if (e.attempts > 0 && !e.done) { <span class="muted">{{ e.attempts }} tr{{ e.attempts === 1 ? 'y' : 'ies' }}</span> }
                  </span>
                </a>
              </li>
            } @empty { <li class="muted">No exercises for this course yet.</li> }
          </ol>
        </section>

        @if (history().length) {
          <section class="card rise">
            <h2>Recent practice</h2>
            <ul class="history">
              @for (a of history(); track a.id) {
                <li>
                  <span class="mi"><app-icon [name]="modeIcon(a.mode)" [size]="16" /></span>
                  <span class="what">
                    <b>{{ modeLabel(a.mode) }}</b>@if (a.exerciseTitle) { : {{ a.exerciseTitle }} }
                  </span>
                  <span class="res" [class.ok]="a.passed">
                    @if (a.mode === 'exercise') { {{ a.passed ? 'completed' : 'not finished' }} }
                    @else if (a.mode === 'flashcards') { {{ a.correct }} / {{ a.total }} known first time }
                    @else { {{ a.score | number:'1.0-0' }}% ({{ a.correct }}/{{ a.total }}){{ a.mode === 'test' ? (a.passed ? ' · passed' : ' · not passed') : '' }} }
                  </span>
                  <span class="muted when">{{ a.createdAt | date:'d MMM, HH:mm' }}</span>
                </li>
              }
            </ul>
          </section>
        }
      </div>
    } @else if (error()) {
      <div class="notice error">{{ error() }}</div>
    } @else {
      <p class="muted">Loading…</p>
    }
  `,
  styles: `
    .back { display: inline-block; margin-bottom: 14px; text-decoration: none; font-weight: 600; }
    .head { display: flex; gap: 18px; align-items: flex-start; margin-bottom: 22px; }
    .head .icon { width: 64px; height: 64px; border-radius: 20px; background: var(--accent-soft); display: grid; place-items: center; color: var(--accent); flex: none; }
    .eyebrow { font-size: .8rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); margin: 0 0 2px; }
    h1 { margin-bottom: 8px; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; }

    .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; margin-bottom: 18px; }
    .tile { display: flex; flex-direction: column; gap: 12px; border-top: 5px solid var(--accent); }
    .tile p { flex: 1; margin: 0; font-size: .95rem; }
    .tile-head { display: flex; align-items: center; gap: 10px; h2 { margin: 0; flex: 1; } }
    .tile-head .ico { width: 40px; height: 40px; border-radius: 12px; background: var(--accent-soft); display: grid; place-items: center; font-size: 1.2rem; }
    .big { display: flex; align-items: baseline; gap: 10px; }
    .big b { font-size: 2rem; color: var(--accent); }
    .big b.pass { color: var(--success); }
    .big small { color: var(--muted); font-weight: 700; }
    .boxes { display: flex; gap: 6px; }
    .box { flex: 1; text-align: center; padding: 6px 2px; border-radius: 10px; background: var(--bg-deep); line-height: 1.1; }
    .box.full { background: var(--accent-soft); color: var(--accent); }
    .box b { display: block; font-size: 1.05rem; }
    .box small { font-size: .65rem; font-weight: 800; text-transform: uppercase; color: var(--muted); }
    .btn { text-decoration: none; }

    #exercises { margin-bottom: 18px; }
    .exercises { list-style: none; padding: 0; margin: 10px 0 0; }
    .exercises li + li { border-top: 1px solid var(--border); }
    .exercises a { display: flex; gap: 14px; align-items: center; padding: 12px 6px; text-decoration: none; color: inherit; border-radius: 10px; }
    .exercises a:hover { background: var(--bg); }
    .state { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; flex: none; background: var(--border); color: var(--muted); }
    a.done .state { background: var(--success); color: #fff; }
    .title { flex: 1; font-weight: 700; }
    .meta { display: flex; gap: 10px; align-items: center; font-size: .9rem; flex-wrap: wrap; justify-content: flex-end; }

    .history { list-style: none; padding: 0; margin: 0; }
    .history li { display: flex; gap: 12px; align-items: center; padding: 9px 0; border-bottom: 1px dashed var(--border); flex-wrap: wrap; }
    .history li:last-child { border-bottom: none; }
    .mi { font-size: 1.2rem; }
    .what { flex: 1; min-width: 160px; }
    .res { font-weight: 700; color: var(--warn); }
    .res.ok { color: var(--success); }
    .when { font-size: .85rem; }
  `,
})
export class PracticeCoursePage implements OnInit {
  private api = inject(ApiService);
  private learner = inject(LearnerService);
  private route = inject(ActivatedRoute);
  store = inject(ProgressStore);

  slug = signal('');
  exercises = signal<Exercise[]>([]);
  history = signal<PracticeAttempt[]>([]);
  boxes = signal<number[]>([0, 0, 0, 0, 0, 0]);
  error = signal('');

  quizSize = QUIZ_SIZE;
  testSize = TEST_SIZE;
  passScore = TEST_PASS_SCORE;

  summary = computed(() => this.store.practiceFor(this.slug()));

  ngOnInit() {
    this.route.paramMap.subscribe(pm => this.load(pm.get('slug')!));
  }

  private async load(slug: string) {
    this.slug.set(slug);
    this.error.set('');
    const id = this.learner.current()!.id;
    try {
      const [exercises, history, cards] = await Promise.all([
        this.api.exercises(id, slug),
        this.api.practiceHistory(id, slug, 10),
        this.api.flashcards(id, slug),
        this.store.refresh(),
      ]);
      this.exercises.set(exercises);
      this.history.set(history);
      const boxes = [0, 0, 0, 0, 0, 0];
      for (const c of cards) boxes[Math.min(c.box, 5)]++;
      this.boxes.set(boxes);
      if (!this.summary()) this.error.set('Course not found.');
    } catch (e: any) {
      this.error.set('Could not load practice data. ' + (e?.message ?? ''));
    }
  }

  kindIcon = (k: string) => (KIND_ICON as any)[k] ?? 'book-open';
  courseIcon = courseIcon;
  kindLabel = (k: string) => (KIND_LABEL as any)[k] ?? k;
  modeIcon = (m: string) => MODE_ICON[m] ?? 'circle';
  modeLabel = (m: string) => MODE_LABEL[m] ?? m;
}
