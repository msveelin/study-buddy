import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProgressStore } from '../../core/progress.store';
import { Icon, courseIcon } from '../../core/icon';

/** Overview of flashcards, quizzes, tests and exercises for every course. */
@Component({
  selector: 'app-practice-hub',
  imports: [RouterLink, DecimalPipe, Icon],
  template: `
    <header class="head rise">
      <div>
        <p class="eyebrow">Memory jog</p>
        <h1>Practice</h1>
        <p class="muted lead">Flashcards use spaced repetition: cards you know come back less often, cards you miss come back sooner.
          Quizzes, tests and exercises check that it really stuck.</p>
      </div>
      <div class="due-pill" [class.zero]="totalDue() === 0">
        <b>{{ totalDue() }}</b><small>cards due</small>
      </div>
    </header>

    @if (store.error()) { <div class="notice error">{{ store.error() }}</div> }

    <div class="grid">
      @for (p of store.practice(); track p.courseSlug) {
        <section class="card course rise" [class]="'card course rise accent-' + p.courseSlug">
          <a class="top" [routerLink]="['/practice', p.courseSlug]">
            <span class="icon"><app-icon [name]="courseIcon(p.courseSlug)" [size]="26" /></span>
            <div class="t">
              <h2>{{ p.courseTitle }}</h2>
              <div class="chips">
                @if (p.cardsDue > 0) { <span class="badge warn">{{ p.cardsDue }} due</span> }
                @if (p.cardsTotal > 0) { <span class="badge">{{ p.cardsMastered }}/{{ p.cardsTotal }} mastered</span> }
                @if (p.testPassed) { <span class="badge done"><app-icon name="check" [size]="14" [stroke]="3" /> Test passed</span> }
                @else if (p.bestTestScore != null) { <span class="badge">best test {{ p.bestTestScore | number:'1.0-0' }}%</span> }
                @if (p.exercisesTotal > 0) { <span class="badge">{{ p.exercisesDone }}/{{ p.exercisesTotal }} exercises</span> }
              </div>
            </div>
          </a>
          <div class="actions">
            <a class="act" [routerLink]="['/practice', p.courseSlug, 'flashcards']">
              <span class="ico"><app-icon name="layers" [size]="18" /></span><span><b>Flashcards</b><small>{{ p.cardsTotal === 0 ? 'no cards yet' : p.cardsDue > 0 ? p.cardsDue + ' to review' : 'all caught up' }}</small></span>
            </a>
            <a class="act" [routerLink]="['/practice', p.courseSlug, 'quiz']">
              <span class="ico"><app-icon name="zap" [size]="18" /></span><span><b>Quick quiz</b><small>{{ p.lastQuizScore != null ? 'last ' + (p.lastQuizScore | number:'1.0-0') + '%' : '8 random questions' }}</small></span>
            </a>
            <a class="act" [routerLink]="['/practice', p.courseSlug, 'test']">
              <span class="ico"><app-icon name="trophy" [size]="18" /></span><span><b>Test</b><small>{{ p.testPassed ? 'passed' : 'timed, 80% to pass' }}</small></span>
            </a>
            <a class="act" [routerLink]="['/practice', p.courseSlug]" fragment="exercises">
              <span class="ico"><app-icon name="dumbbell" [size]="18" /></span><span><b>Exercises</b><small>{{ p.exercisesTotal === 0 ? 'none yet' : (p.exercisesTotal - p.exercisesDone) + ' left' }}</small></span>
            </a>
          </div>
        </section>
      } @empty {
        @if (!store.loading()) { <p class="muted">No practice material yet. Run <code>manage.py seed</code> in the backend.</p> }
      }
    </div>
  `,
  styles: `
    .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 24px; }
    .eyebrow { font-size: .8rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin: 0 0 2px; }
    .lead { max-width: 640px; margin: 0; }
    .due-pill { flex: none; width: 96px; height: 96px; border-radius: 50%; display: grid; place-items: center; text-align: center; line-height: 1;
      background: var(--warn-soft); color: var(--warn); }
    .due-pill.zero { background: var(--success-soft); color: var(--success); }
    .due-pill b { font-size: 1.6rem; display: block; }
    .due-pill small { font-size: .65rem; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; }

    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px; }
    .course { display: flex; flex-direction: column; gap: 16px; border-top: 5px solid var(--accent); padding: 20px 22px; }
    .top { display: flex; gap: 14px; align-items: flex-start; text-decoration: none; color: inherit; }
    .icon { width: 50px; height: 50px; border-radius: 16px; background: var(--accent-soft); display: grid; place-items: center; color: var(--accent); flex: none; }
    .t { flex: 1; min-width: 0; }
    .t h2 { margin: 4px 0 6px; font-size: 1.25rem; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; }
    .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .act { display: flex; gap: 10px; align-items: center; padding: 10px 12px; border-radius: 14px; border: 1px solid var(--border); text-decoration: none; color: inherit;
      background: var(--surface-2); transition: background .15s, transform .12s; }
    .act:hover { background: var(--accent-soft); transform: translateY(-1px); }
    .act .ico { font-size: 1.3rem; }
    .act b { display: block; font-size: .95rem; }
    .act small { color: var(--muted); font-weight: 600; font-size: .78rem; }
    @media (max-width: 500px) { .actions { grid-template-columns: 1fr; } .due-pill { display: none; } }
  `,
})
export class PracticeHubPage implements OnInit {
  courseIcon = courseIcon;
  store = inject(ProgressStore);

  totalDue = computed(() => this.store.practice().reduce((n, p) => n + p.cardsDue, 0));

  ngOnInit() { this.store.refresh(); }
}
