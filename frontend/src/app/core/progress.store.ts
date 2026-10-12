import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { LearnerService } from './learner.service';
import { Course, Dashboard, PracticeSummary } from './models';

/** Courses + the current learner's dashboard, shared by the sidebar and the pages. */
@Injectable({ providedIn: 'root' })
export class ProgressStore {
  private api = inject(ApiService);
  private learner = inject(LearnerService);

  courses = signal<Course[]>([]);
  dash = signal<Dashboard | null>(null);
  practice = signal<PracticeSummary[]>([]);
  error = signal('');
  loading = signal(false);

  overall = computed(() => {
    const d = this.dash();
    return d && d.lessonsTotal ? Math.round((d.lessonsCompleted / d.lessonsTotal) * 100) : 0;
  });

  cardsDue = computed(() => this.dash()?.cardsDue ?? 0);

  stat(slug: string) { return this.dash()?.courses.find(c => c.courseSlug === slug); }

  practiceFor(slug: string) { return this.practice().find(p => p.courseSlug === slug); }

  percent(slug: string) {
    const s = this.stat(slug);
    return s && s.total ? Math.round((s.completed / s.total) * 100) : 0;
  }

  async refresh() {
    const l = this.learner.current();
    if (!l) { this.dash.set(null); return; }
    this.loading.set(true);
    this.error.set('');
    try {
      const [courses, dash, practice] = await Promise.all([
        this.courses().length ? Promise.resolve(this.courses()) : this.api.courses(),
        this.api.dashboard(l.id),
        this.api.practice(l.id),
      ]);
      this.courses.set(courses);
      this.dash.set(dash);
      this.practice.set(practice);
    } catch (e: any) {
      this.error.set('Could not reach the server. Is the backend running? ' + (e?.message ?? ''));
    } finally {
      this.loading.set(false);
    }
  }
}
