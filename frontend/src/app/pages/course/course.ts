import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { LearnerService } from '../../core/learner.service';
import { Course, KIND_ICON, KIND_LABEL, Progress } from '../../core/models';
import { Icon, courseIcon } from '../../core/icon';

@Component({
  selector: 'app-course',
  imports: [RouterLink, DecimalPipe, Icon],
  template: `
    @if (course(); as c) {
      <div [class]="'accent-' + c.slug">
        <header class="hero rise">
          <div class="icon"><app-icon [name]="courseIcon(c)" [size]="42" /></div>
          <div class="body">
            <a routerLink="/dashboard" class="back">← Dashboard</a>
            <h1>{{ c.title }}</h1>
            <p>{{ c.description }}</p>
            <div class="row">
              <div class="progress-bar"><span [style.width.%]="percent()"></span></div>
              <span class="pct">{{ done() }} / {{ c.lessonCount }} lessons · {{ percent() }}%</span>
            </div>
          </div>
          @if (nextSlug(); as n) {
            <a class="btn primary" [routerLink]="['/lesson', n]">{{ done() ? 'Continue' : 'Start' }} →</a>
          }
        </header>

        @for (m of c.modules; track m.id; let mi = $index) {
          <section class="module rise">
            <div class="mhead">
              <span class="part">Part {{ mi + 1 }}</span>
              <h2>{{ m.title }}</h2>
              <span class="muted count">{{ doneIn(m) }} / {{ m.lessons.length }}</span>
            </div>
            <ol class="lessons">
              @for (l of m.lessons; track l.slug) {
                <li>
                  <a [routerLink]="['/lesson', l.slug]" [class]="status(l.slug)" [class.next]="l.slug === nextSlug()">
                    <span class="state">
                      @switch (status(l.slug)) {
                        @case ('completed') { <app-icon name="check" [size]="18" [stroke]="3" /> }
                        @case ('started') { <app-icon name="circle-dot" [size]="18" /> }
                        @default { <app-icon [name]="icon(l.kind)" [size]="18" /> }
                      }
                    </span>
                    <span class="title">
                      {{ l.title }}
                      <span class="meta">
                        <span class="kind">{{ label(l.kind) }}</span> · {{ l.minutes }} min
                        @if (prog(l.slug); as p) {
                          @if (p.bestWpm) { · best {{ p.bestWpm | number:'1.0-0' }} wpm }
                          @if (p.score != null && l.kind === 'quiz') { · {{ p.score | number:'1.0-0' }}% }
                        }
                      </span>
                    </span>
                    @if (l.slug === nextSlug()) { <span class="badge">Up next</span> }
                    <span class="arrow">→</span>
                  </a>
                </li>
              }
            </ol>
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
    .hero { display: flex; gap: 22px; align-items: center; flex-wrap: wrap; padding: 26px 28px; border-radius: var(--radius); margin-bottom: 26px;
      background: var(--accent-soft); border: 1px solid var(--border); }
    .hero .icon { width: 86px; height: 86px; border-radius: 26px; background: var(--surface); display: grid; place-items: center; color: var(--accent); box-shadow: var(--shadow); flex: none; }
    .hero .body { flex: 1; min-width: 240px; }
    .hero h1 { margin: 2px 0 6px; color: var(--accent); }
    .hero p { margin-bottom: 12px; }
    .back { font-weight: 800; font-size: .85rem; text-decoration: none; color: var(--accent); }
    .hero .progress-bar { width: 220px; background: rgba(255,255,255,.7); }
    .pct { font-weight: 800; font-size: .9rem; color: var(--accent); }

    .module { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 22px; margin-bottom: 18px; box-shadow: var(--shadow); }
    .mhead { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
    .mhead h2 { margin: 0; flex: 1; font-size: 1.25rem; }
    .part { font-size: .72rem; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; background: var(--accent); color: #fff; padding: 3px 10px; border-radius: 999px; }
    .count { font-size: .85rem; font-weight: 800; }

    .lessons { list-style: none; padding: 0; margin: 0; }
    .lessons a { display: flex; gap: 14px; align-items: center; padding: 12px 10px; text-decoration: none; color: inherit; border-radius: 14px; transition: background .15s; }
    .lessons a:hover { background: var(--surface-2); }
    .lessons a.next { background: var(--accent-soft); }
    .state { width: 38px; height: 38px; border-radius: 12px; display: grid; place-items: center; font-weight: 900; flex: none; background: var(--bg); color: var(--accent); }
    a.completed .state { background: var(--success); color: #fff; }
    a.started .state { background: var(--warn-soft); color: var(--warn); }
    .title { flex: 1; font-weight: 800; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
    a.completed .title { color: var(--muted); }
    .meta { font-size: .8rem; font-weight: 600; color: var(--muted); }
    .kind { color: var(--accent); font-weight: 800; }
    .arrow { color: var(--muted); opacity: 0; transition: opacity .15s, transform .15s; }
    .lessons a:hover .arrow { opacity: 1; transform: translateX(2px); }
  `,
})
export class CoursePage implements OnInit {
  private api = inject(ApiService);
  private learner = inject(LearnerService);
  private route = inject(ActivatedRoute);

  course = signal<Course | null>(null);
  progress = signal<Map<string, Progress>>(new Map());
  error = signal('');

  ngOnInit() {
    this.route.paramMap.subscribe(pm => this.load(pm.get('slug')!));
  }

  private async load(slug: string) {
    this.course.set(null);
    try {
      const [course, progress] = await Promise.all([
        this.api.course(slug),
        this.api.progress(this.learner.current()!.id),
      ]);
      if (!course) { this.error.set('Course not found.'); return; }
      this.progress.set(new Map(progress.map(p => [p.lessonSlug, p])));
      this.course.set(course);
    } catch (e: any) {
      this.error.set('Could not load the course. ' + (e?.message ?? ''));
    }
  }

  prog = (slug: string) => this.progress().get(slug);
  status = (slug: string) => (this.prog(slug)?.status ?? '').toLowerCase() || 'todo';
  all = () => this.course()?.modules.flatMap(m => m.lessons) ?? [];
  done = () => this.all().filter(l => this.status(l.slug) === 'completed').length;
  doneIn = (m: { lessons: { slug: string }[] }) => m.lessons.filter(l => this.status(l.slug) === 'completed').length;
  nextSlug = () => this.all().find(l => this.status(l.slug) !== 'completed')?.slug ?? null;
  percent = () => {
    const c = this.course();
    return c && c.lessonCount ? Math.round((this.done() / c.lessonCount) * 100) : 0;
  };
  icon = (k: string) => (KIND_ICON as any)[k] ?? 'book-open';
  courseIcon = courseIcon;
  label = (k: string) => (KIND_LABEL as any)[k] ?? k;
}
