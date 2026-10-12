import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { LearnerService } from '../../core/learner.service';
import { ProgressStore } from '../../core/progress.store';
import { KIND_ICON, KIND_LABEL, Lesson, LessonSummary, Progress } from '../../core/models';
import { Icon } from '../../core/icon';
import { MarkdownPipe } from '../../core/markdown.pipe';
import { ReadAloud } from '../../core/read-aloud';
import { TypingTrainer, TypingResult } from '../../lessons/typing-trainer/typing-trainer';
import { Quiz } from '../../lessons/quiz/quiz';
import { WordEditor } from '../../lessons/word-editor/word-editor';
import { CodePlayground } from '../../lessons/code-playground/code-playground';
import { WebPlayground } from '../../lessons/web-playground/web-playground';
import { MouseTrainer } from '../../lessons/mouse-trainer/mouse-trainer';
import { ShortcutTrainer } from '../../lessons/shortcut-trainer/shortcut-trainer';
import { FileExplorer } from '../../lessons/file-explorer/file-explorer';
import { BrowserSim } from '../../lessons/browser-sim/browser-sim';
import { EmailSim } from '../../lessons/email-sim/email-sim';
import { SettingsSim } from '../../lessons/settings-sim/settings-sim';
import { SheetEditor } from '../../lessons/sheet-editor/sheet-editor';

@Component({
  selector: 'app-lesson',
  imports: [RouterLink, MarkdownPipe, ReadAloud, Icon, TypingTrainer, Quiz, WordEditor, CodePlayground, WebPlayground,
    MouseTrainer, ShortcutTrainer, FileExplorer, BrowserSim, EmailSim, SettingsSim, SheetEditor],
  template: `
    @if (lesson(); as l) {
      <div [class]="'accent-' + l.courseSlug">
        <div class="crumbs rise">
          <a [routerLink]="['/course', l.courseSlug]">← {{ l.courseTitle }}</a>
          <span class="sep">/</span>
          <span class="muted">{{ l.moduleTitle }}</span>
          <span class="pos muted">Lesson {{ position() }} of {{ siblings().length }}</span>
        </div>

        <header class="title-row rise">
          <span class="kind-ico"><app-icon [name]="icon(l.kind)" [size]="30" /></span>
          <div class="t">
            <h1>{{ l.title }}</h1>
            <div class="row">
              <span class="badge" [class.done]="isDone()">@if (isDone()) { <app-icon name="check" [size]="14" [stroke]="3" /> Completed } @else { {{ label(l.kind) }} }</span>
              <span class="muted small">⏱ {{ l.minutes }} min</span>
              @if (l.content) { <app-read-aloud [text]="l.content" /> }
            </div>
          </div>
        </header>

        @if (l.content) {
          <article class="card prose rise" [innerHTML]="l.content | markdown"></article>
        }

        <div class="rise">
          @switch (l.kind) {
            @case ('reading') {
              <div class="actions">
                @if (!isDone()) {
                  <button class="primary big" (click)="markDone()" [disabled]="saving()">I have read this <app-icon name="check" [size]="18" [stroke]="3" /></button>
                } @else if (next(); as n) {
                  <a class="btn primary big" [routerLink]="['/lesson', n.slug]">Next: {{ n.title }} →</a>
                }
              </div>
            }
            @case ('typing') {
              <app-typing-trainer [text]="l.data.text" [keys]="l.data.keys ?? []"
                [targetWpm]="l.data.targetWpm ?? 0" [targetAccuracy]="l.data.targetAccuracy ?? 90"
                [best]="progress()?.bestWpm ?? null"
                (finished)="onTyping($event)" />
            }
            @case ('quiz') {
              <app-quiz [questions]="l.data.questions" [passScore]="l.data.passScore ?? 70" (finished)="onQuiz($event)" />
            }
            @case ('word') {
              <app-word-editor [starterHtml]="l.data.starterHtml ?? ''" [tasks]="l.data.tasks" (completed)="onTaskDone()" />
            }
            @case ('code') {
              <app-code-playground [starter]="l.data.starter" [tests]="l.data.tests" [solution]="l.data.solution" (completed)="onTaskDone()" />
            }
            @case ('web') {
              <app-web-playground [html]="l.data.html" [css]="l.data.css" [js]="l.data.js ?? ''" [checks]="l.data.checks" (completed)="onTaskDone()" />
            }
            @case ('mouse') {
              <app-mouse-trainer [tasks]="l.data.tasks" (completed)="onTaskDone()" />
            }
            @case ('shortcuts') {
              <app-shortcut-trainer [combos]="l.data.combos ?? []" [editor]="l.data.editor ?? null" (completed)="onTaskDone()" />
            }
            @case ('files') {
              <app-file-explorer [fs]="l.data.fs" [bin]="l.data.bin ?? []" [tasks]="l.data.tasks" (completed)="onTaskDone()" />
            }
            @case ('browser') {
              <app-browser-sim [sites]="l.data.sites" [home]="l.data.home ?? 'start.example'" [tasks]="l.data.tasks" (completed)="onTaskDone()" />
            }
            @case ('email') {
              <app-email-sim [data]="l.data" (completed)="onTaskDone()" />
            }
            @case ('settings') {
              <app-settings-sim [tasks]="l.data.tasks" (completed)="onTaskDone()" />
            }
            @case ('sheet') {
              <app-sheet-editor [cells]="l.data.cells ?? {}" [tasks]="l.data.tasks" (completed)="onTaskDone()" />
            }
          }
        </div>

        @if (message(); as m) {
          <div class="notice rise" [class.success]="m.ok" [class.warn]="!m.ok">{{ m.text }}</div>
        }

        <nav class="pager">
          @if (prev(); as p) {
            <a class="pg" [routerLink]="['/lesson', p.slug]"><small>← Previous</small><span>{{ p.title }}</span></a>
          } @else { <span></span> }
          @if (next(); as n) {
            <a class="pg right" [class.hot]="isDone()" [routerLink]="['/lesson', n.slug]"><small>Next →</small><span>{{ n.title }}</span></a>
          } @else {
            <a class="pg right" [routerLink]="['/course', l.courseSlug]"><small>Finished</small><span>Back to course</span></a>
          }
        </nav>
      </div>
    } @else if (error()) {
      <div class="notice error">{{ error() }}</div>
    } @else {
      <p class="muted">Loading…</p>
    }
  `,
  styles: `
    .crumbs { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; font-size: .9rem; font-weight: 700; flex-wrap: wrap; }
    .crumbs a { text-decoration: none; color: var(--accent); }
    .sep { color: var(--border); }
    .pos { margin-left: auto; font-size: .8rem; }
    .title-row { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; }
    .kind-ico { width: 60px; height: 60px; border-radius: 20px; background: var(--accent-soft); display: grid; place-items: center; color: var(--accent); flex: none; }
    .title-row h1 { margin: 0 0 4px; font-size: 1.8rem; }
    .small { font-size: .85rem; font-weight: 700; }
    article.card { margin-bottom: 20px; }
    .actions { margin: 6px 0 20px; }
    .big { font-size: 1.1rem; padding: 14px 26px; }
    .pager { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 30px; }
    .pg { display: flex; flex-direction: column; gap: 2px; padding: 14px 18px; border-radius: 16px; background: var(--surface); border: 1px solid var(--border);
      text-decoration: none; color: inherit; font-weight: 800; transition: transform .15s, box-shadow .15s; }
    .pg small { font-size: .75rem; color: var(--muted); font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
    .pg.right { text-align: right; }
    .pg.hot { background: var(--accent); border-color: var(--accent); color: #fff; }
    .pg.hot small { color: rgba(255,255,255,.8); }
    .pg:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
    @media (max-width: 600px) { .pager { grid-template-columns: 1fr; } .pg.right { text-align: left; } }
  `,
})
export class LessonPage implements OnInit {
  private api = inject(ApiService);
  private learner = inject(LearnerService);
  private store = inject(ProgressStore);
  private route = inject(ActivatedRoute);

  lesson = signal<Lesson | null>(null);
  progress = signal<Progress | null>(null);
  siblings = signal<LessonSummary[]>([]);
  error = signal('');
  saving = signal(false);
  message = signal<{ ok: boolean; text: string } | null>(null);

  isDone = computed(() => (this.progress()?.status ?? '').toLowerCase() === 'completed');
  position = computed(() => this.siblings().findIndex(s => s.slug === this.lesson()?.slug) + 1);
  prev = computed(() => {
    const i = this.siblings().findIndex(s => s.slug === this.lesson()?.slug);
    return i > 0 ? this.siblings()[i - 1] : null;
  });
  next = computed(() => {
    const i = this.siblings().findIndex(s => s.slug === this.lesson()?.slug);
    return i >= 0 && i < this.siblings().length - 1 ? this.siblings()[i + 1] : null;
  });

  ngOnInit() {
    this.route.paramMap.subscribe(pm => this.load(pm.get('slug')!));
  }

  private async load(slug: string) {
    this.lesson.set(null);
    this.message.set(null);
    this.error.set('');
    try {
      const lesson = await this.api.lesson(slug);
      if (!lesson) { this.error.set('Lesson not found.'); return; }
      const [course, progress] = await Promise.all([
        this.api.course(lesson.courseSlug),
        this.api.progress(this.learner.current()!.id),
      ]);
      this.siblings.set(course?.modules.flatMap(m => m.lessons) ?? []);
      this.progress.set(progress.find(p => p.lessonSlug === slug) ?? null);
      this.lesson.set(lesson);
    } catch (e: any) {
      this.error.set('Could not load the lesson. ' + (e?.message ?? ''));
    }
  }

  private learnerId() { return this.learner.current()!.id; }
  private slug() { return this.lesson()!.slug; }

  async markDone() {
    await this.save('completed', undefined, 'Nice! Lesson marked as completed.');
  }

  async onTaskDone() {
    if (this.isDone()) return;
    await this.save('completed', 100, 'All tasks complete! Your progress has been saved.');
  }

  async onQuiz(score: number) {
    const pass = score >= (this.lesson()!.data.passScore ?? 70);
    await this.save(pass ? 'completed' : 'started', score,
      pass ? `You scored ${Math.round(score)}%. Quiz passed and saved!` : `You scored ${Math.round(score)}%. Review the answers and try again.`);
  }

  async onTyping(r: TypingResult) {
    this.saving.set(true);
    try {
      const p = await this.api.recordTyping(this.learnerId(), this.slug(), r.wpm, r.accuracy, r.seconds);
      this.progress.set(p);
      const done = (p.status ?? '').toLowerCase() === 'completed';
      this.message.set({
        ok: done,
        text: done
          ? `Saved! ${Math.round(r.wpm)} wpm at ${Math.round(r.accuracy)}% accuracy. Lesson completed.`
          : `Saved. ${Math.round(r.wpm)} wpm at ${Math.round(r.accuracy)}% accuracy. Reach the target to complete the lesson.`,
      });
      this.store.refresh();
    } catch (e: any) {
      this.message.set({ ok: false, text: 'Could not save your attempt: ' + (e?.message ?? '') });
    } finally {
      this.saving.set(false);
    }
  }

  private async save(status: 'started' | 'completed', score: number | undefined, text: string) {
    this.saving.set(true);
    try {
      const p = await this.api.saveProgress(this.learnerId(), this.slug(), status, score);
      this.progress.set(p);
      this.message.set({ ok: status === 'completed', text });
      this.store.refresh();
    } catch (e: any) {
      this.message.set({ ok: false, text: 'Could not save progress: ' + (e?.message ?? '') });
    } finally {
      this.saving.set(false);
    }
  }

  icon = (k: string) => (KIND_ICON as any)[k] ?? 'book-open';
  label = (k: string) => (KIND_LABEL as any)[k] ?? k;
}
