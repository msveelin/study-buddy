import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { LearnerService } from '../../core/learner.service';
import { ProgressStore } from '../../core/progress.store';
import { MarkdownPipe } from '../../core/markdown.pipe';
import { Exercise, KIND_ICON, KIND_LABEL } from '../../core/models';
import { Icon } from '../../core/icon';
import { TypingTrainer, TypingResult } from '../../lessons/typing-trainer/typing-trainer';
import { WordEditor } from '../../lessons/word-editor/word-editor';
import { CodePlayground } from '../../lessons/code-playground/code-playground';
import { WebPlayground } from '../../lessons/web-playground/web-playground';

/** A practice exercise: the same playgrounds as the lessons, with a fresh task. */
@Component({
  selector: 'app-exercise',
  imports: [RouterLink, MarkdownPipe, TypingTrainer, WordEditor, CodePlayground, WebPlayground, Icon],
  template: `
    @if (exercise(); as e) {
      <div class="crumbs">
        <a routerLink="/practice">Practice</a> ›
        <a [routerLink]="['/practice', e.courseSlug]">{{ e.courseTitle }}</a> ›
        <span class="muted">Exercise</span>
      </div>

      <div class="title-row">
        <h1><app-icon [name]="icon(e.kind)" [size]="26" /> {{ e.title }}</h1>
        <span class="badge" [class.done]="done()">@if (done()) { <app-icon name="check" [size]="14" [stroke]="3" /> Completed } @else { {{ label(e.kind) }} }</span>
        <span class="muted">{{ e.minutes }} min</span>
      </div>

      @if (e.content) {
        <article class="card prose" [innerHTML]="e.content | markdown"></article>
      }

      @switch (e.kind) {
        @case ('typing') {
          <app-typing-trainer [text]="e.data.text" [keys]="e.data.keys ?? []"
            [targetWpm]="e.data.targetWpm ?? 0" [targetAccuracy]="e.data.targetAccuracy ?? 90"
            (finished)="onTyping($event)" />
        }
        @case ('word') {
          <app-word-editor [starterHtml]="e.data.starterHtml ?? ''" [tasks]="e.data.tasks" (completed)="onDone()" />
        }
        @case ('code') {
          <app-code-playground [starter]="e.data.starter" [tests]="e.data.tests" [solution]="e.data.solution" (completed)="onDone()" />
        }
        @case ('web') {
          <app-web-playground [html]="e.data.html" [css]="e.data.css" [js]="e.data.js ?? ''" [checks]="e.data.checks" (completed)="onDone()" />
        }
      }

      @if (message(); as m) {
        <div class="notice" [class.success]="m.ok" [class.warn]="!m.ok">{{ m.text }}</div>
      }

      <nav class="pager">
        @if (prev(); as p) { <a class="btn" [routerLink]="['/practice', e.courseSlug, 'exercises', p.key]">← {{ p.title }}</a> } @else { <span></span> }
        @if (next(); as n) {
          <a class="btn" [class.primary]="done()" [routerLink]="['/practice', e.courseSlug, 'exercises', n.key]">{{ n.title }} →</a>
        } @else {
          <a class="btn" [class.primary]="done()" [routerLink]="['/practice', e.courseSlug]">Back to practice</a>
        }
      </nav>
    } @else if (error()) {
      <div class="notice error">{{ error() }}</div>
    } @else {
      <p class="muted">Loading…</p>
    }
  `,
  styles: `
    .crumbs { margin-bottom: 10px; font-size: .95rem; a { text-decoration: none; } }
    .title-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 16px; h1 { margin: 0; } }
    article.card { margin-bottom: 20px; }
    .pager { display: flex; justify-content: space-between; gap: 12px; margin-top: 28px; flex-wrap: wrap; }
    .pager .btn { text-decoration: none; }
  `,
})
export class ExercisePage implements OnInit {
  private api = inject(ApiService);
  private learner = inject(LearnerService);
  private route = inject(ActivatedRoute);
  private store = inject(ProgressStore);

  exercise = signal<Exercise | null>(null);
  siblings = signal<Exercise[]>([]);
  done = signal(false);
  error = signal('');
  message = signal<{ ok: boolean; text: string } | null>(null);
  private startedAt = Date.now();

  prev = computed(() => {
    const i = this.siblings().findIndex(s => s.key === this.exercise()?.key);
    return i > 0 ? this.siblings()[i - 1] : null;
  });
  next = computed(() => {
    const i = this.siblings().findIndex(s => s.key === this.exercise()?.key);
    return i >= 0 && i < this.siblings().length - 1 ? this.siblings()[i + 1] : null;
  });

  ngOnInit() {
    this.route.paramMap.subscribe(pm => this.load(pm.get('slug')!, pm.get('key')!));
  }

  private async load(slug: string, key: string) {
    this.exercise.set(null);
    this.message.set(null);
    this.error.set('');
    this.startedAt = Date.now();
    try {
      const id = this.learner.current()!.id;
      const [ex, all] = await Promise.all([this.api.exercise(id, key), this.api.exercises(id, slug)]);
      if (!ex) { this.error.set('Exercise not found.'); return; }
      this.siblings.set(all);
      this.done.set(ex.done);
      this.exercise.set(ex);
    } catch (e: any) {
      this.error.set('Could not load the exercise. ' + (e?.message ?? ''));
    }
  }

  async onDone() {
    if (this.done()) return;
    await this.record(1, 'Exercise complete! Nicely remembered.');
  }

  async onTyping(r: TypingResult) {
    const e = this.exercise()!;
    const ok = r.accuracy >= (e.data.targetAccuracy ?? 90) && r.wpm >= (e.data.targetWpm ?? 0);
    if (this.done() && !ok) return;
    await this.record(ok ? 1 : 0, ok
      ? `Saved! ${Math.round(r.wpm)} wpm at ${Math.round(r.accuracy)}% accuracy. Exercise complete.`
      : `${Math.round(r.wpm)} wpm at ${Math.round(r.accuracy)}% accuracy. Reach the target to complete it.`);
  }

  private async record(correct: number, text: string) {
    const e = this.exercise()!;
    const seconds = Math.round((Date.now() - this.startedAt) / 1000);
    try {
      const res = await this.api.recordPractice(this.learner.current()!.id, e.courseSlug, 'exercise', correct, 1, seconds, e.key);
      if (res.attempt.passed) this.done.set(true);
      this.message.set({ ok: res.attempt.passed, text });
      this.store.refresh();
    } catch (err: any) {
      this.message.set({ ok: false, text: 'Could not save progress: ' + (err?.message ?? '') });
    }
  }

  icon = (k: string) => (KIND_ICON as any)[k] ?? 'book-open';
  label = (k: string) => (KIND_LABEL as any)[k] ?? k;
}
