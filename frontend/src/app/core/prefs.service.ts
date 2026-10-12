import { Injectable, effect, signal } from '@angular/core';

const KEY = 'study-buddy.prefs';

interface Prefs { bigText: boolean; tourDone: boolean; }

/** Per-browser preferences for beginners: bigger text and whether the welcome tour was seen. */
@Injectable({ providedIn: 'root' })
export class PrefsService {
  private prefs = signal<Prefs>(this.load());

  readonly bigText = () => this.prefs().bigText;
  readonly tourDone = () => this.prefs().tourDone;

  constructor() {
    effect(() => {
      const p = this.prefs();
      document.documentElement.classList.toggle('big-text', p.bigText);
      try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ }
    });
  }

  setBigText(on: boolean) { this.prefs.update(p => ({ ...p, bigText: on })); }
  toggleBigText() { this.setBigText(!this.bigText()); }
  setTourDone(done: boolean) { this.prefs.update(p => ({ ...p, tourDone: done })); }

  /** Bumped by the Help page to re-open the tour; the Tour component reacts to it. */
  readonly tourRequested = signal(0);
  requestTour() { this.tourRequested.update(n => n + 1); }

  private load(): Prefs {
    try {
      const raw = localStorage.getItem(KEY);
      return { bigText: false, tourDone: false, ...(raw ? JSON.parse(raw) : {}) };
    } catch {
      return { bigText: false, tourDone: false };
    }
  }
}
