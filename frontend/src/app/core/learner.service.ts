import { Injectable, signal } from '@angular/core';
import { Learner } from './models';

const KEY = 'study-buddy.learner';

@Injectable({ providedIn: 'root' })
export class LearnerService {
  readonly current = signal<Learner | null>(this.load());

  set(learner: Learner | null) {
    this.current.set(learner);
    try {
      if (learner) localStorage.setItem(KEY, JSON.stringify(learner));
      else localStorage.removeItem(KEY);
    } catch { /* storage unavailable: keep in memory only */ }
  }

  private load(): Learner | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
