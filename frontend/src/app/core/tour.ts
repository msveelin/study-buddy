import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LearnerService } from './learner.service';
import { PrefsService } from './prefs.service';
import { Icon } from './icon';

interface Step { icon: string; title: string; body: string; highlight?: string; }

const STEPS: Step[] = [
  { icon: 'hand', title: 'Welcome to Study Buddy', body: 'This is a website that teaches you the computer, one small step at a time. This short tour shows you how it works. Press the big Next button to continue.' },
  { icon: 'library', title: 'The courses are on the left', body: 'The list down the left side shows every course, in the order a beginner should take them. The coloured bar under each name fills up as you finish lessons. Click a course name to see its lessons.', highlight: 'tour-courses' },
  { icon: 'play', title: 'The Continue button', body: 'On the Dashboard, the big purple box always takes you to your next lesson. If you ever feel lost, come back to the Dashboard and press Continue.', highlight: 'tour-continue' },
  { icon: 'book-open', title: 'Inside a lesson', body: 'Read the lesson. At the end, press the green button that says "I have read this". Practice lessons have a list of tasks on the right that tick themselves off as you do them.' },
  { icon: 'life-buoy', title: 'Help is always there', body: 'The Help & Glossary link at the bottom of the left side explains every word, shows what the icons mean, can make the text bigger, and can show this tour again.', highlight: 'tour-help' },
  { icon: 'save', title: 'Your progress saves itself', body: 'You can stop at any time and close the browser. When you come back, pick your name and press Continue. Nothing is lost. Enjoy!' },
];

/** A first-run walkthrough shown once per browser, and again on request from the Help page. */
@Component({
  selector: 'app-tour',
  imports: [Icon],
  template: `
    @if (open()) {
      <div class="backdrop" (click)="finish()"></div>
      <div class="tour card" role="dialog" aria-modal="true" aria-labelledby="tour-title" (click)="$event.stopPropagation()">
        <div class="dots">
          @for (s of steps; track $index) { <span [class.on]="$index === index()"></span> }
        </div>
        <div class="icon"><app-icon [name]="step().icon" [size]="52" /></div>
        <h2 id="tour-title">{{ step().title }}</h2>
        <p>{{ step().body }}</p>
        <div class="row">
          <button (click)="finish()">Skip tour</button>
          <span class="spacer"></span>
          @if (index() > 0) { <button (click)="index.set(index() - 1)">← Back</button> }
          @if (index() < steps.length - 1) {
            <button class="primary big" (click)="index.set(index() + 1)">Next →</button>
          } @else {
            <button class="primary big" (click)="finish()">Start learning <app-icon name="check" [size]="18" /></button>
          }
        </div>
        <p class="muted small">Step {{ index() + 1 }} of {{ steps.length }}</p>
      </div>
    }
  `,
  styles: `
    .backdrop { position: fixed; inset: 0; background: rgba(20, 24, 40, .55); z-index: 90; }
    .tour { position: fixed; z-index: 91; inset: 0; margin: auto; height: fit-content; width: min(560px, calc(100vw - 32px));
      text-align: center; padding: 30px 32px 18px; box-shadow: var(--shadow-lg); animation: rise .35s cubic-bezier(.2,.8,.2,1) both; }
    .icon { width: 84px; height: 84px; border-radius: 26px; background: var(--primary-soft); color: var(--primary); display: grid; place-items: center; margin: 0 auto 14px; }
    h2 { font-size: 1.6rem; }
    p { font-size: 1.1rem; }
    .dots { display: flex; justify-content: center; gap: 6px; margin-bottom: 14px; }
    .dots span { width: 10px; height: 10px; border-radius: 50%; background: var(--bg-deep); }
    .dots span.on { background: var(--primary); }
    .row { margin-top: 16px; }
    .spacer { flex: 1; }
    .big { font-size: 1.1rem; padding: 12px 24px; }
    .small { font-size: .85rem; margin: 12px 0 0; }
  `,
})
export class Tour {
  private prefs = inject(PrefsService);
  private learner = inject(LearnerService);
  private router = inject(Router);

  steps = STEPS;
  open = signal(false);
  index = signal(0);
  step = computed(() => this.steps[this.index()]);

  constructor() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd && e.urlAfterRedirects.startsWith('/dashboard')
          && this.learner.current() && !this.prefs.tourDone()) {
        setTimeout(() => this.start(), 600);
      }
    });
    effect(() => { if (this.prefs.tourRequested() > 0) this.start(); });
    effect(() => {
      const id = this.open() ? this.step().highlight : undefined;
      document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
      if (id) document.querySelector(`[data-tour="${id}"]`)?.classList.add('tour-highlight');
    });
  }

  start() { this.index.set(0); this.open.set(true); }
  finish() { this.open.set(false); this.prefs.setTourDone(true); }

  @HostListener('window:keydown.escape') onEsc() { if (this.open()) this.finish(); }
}
