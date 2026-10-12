import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LearnerService } from './core/learner.service';
import { ProgressStore } from './core/progress.store';
import { Icon, courseIcon } from './core/icon';
import { Tour } from './core/tour';
import { PrefsService } from './core/prefs.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Tour, Icon],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  learner = inject(LearnerService);
  store = inject(ProgressStore);
  prefs = inject(PrefsService); // instantiated early so the big-text class is applied on load
  private router = inject(Router);
  menuOpen = signal(false);
  courseIcon = courseIcon;

  constructor() {
    effect(() => { this.learner.current(); this.store.refresh(); });
  }

  switchLearner() {
    this.learner.set(null);
    this.menuOpen.set(false);
    this.router.navigate(['/']);
  }

  closeMenu() { this.menuOpen.set(false); }
}
