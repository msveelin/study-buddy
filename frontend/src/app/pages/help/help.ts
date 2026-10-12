import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GLOSSARY, ICONS } from '../../core/glossary';
import { PrefsService } from '../../core/prefs.service';
import { LearnerService } from '../../core/learner.service';
import { ReadAloud } from '../../core/read-aloud';
import { Icon } from '../../core/icon';

const SHORTCUTS = [
  ['Ctrl + C', 'Copy'], ['Ctrl + V', 'Paste'], ['Ctrl + X', 'Cut'], ['Ctrl + Z', 'Undo'], ['Ctrl + Y', 'Redo'],
  ['Ctrl + A', 'Select all'], ['Ctrl + S', 'Save'], ['Ctrl + P', 'Print'], ['Ctrl + F', 'Find on the page'],
  ['Ctrl + B / I / U', 'Bold / Italic / Underline'], ['Esc', 'Cancel, close a menu'], ['Enter', 'Confirm, new line'],
  ['Tab', 'Next box'], ['Alt + Tab', 'Switch windows'], ['Win + E', 'File Explorer'], ['Win + D', 'Show the desktop'],
  ['Win + L', 'Lock the computer'], ['Win + I', 'Settings'], ['F2', 'Rename'], ['Ctrl + Alt + Delete', 'Rescue screen / Task Manager'],
];

@Component({
  selector: 'app-help',
  imports: [FormsModule, RouterLink, ReadAloud, Icon],
  template: `
    <header class="head rise">
      <div>
        <p class="eyebrow">Help</p>
        <h1>Help & Glossary</h1>
        <p class="muted">Every puzzling word explained, what the icons mean, and ways to make this site easier to use.</p>
      </div>
    </header>

    <section class="card rise">
      <h2>Make it easier</h2>
      <div class="tools">
        <label class="tool">
          <input type="checkbox" [checked]="prefs.bigText()" (change)="prefs.setBigText($any($event.target).checked)">
          <span><b>Bigger text</b><small>Makes everything on this site larger.</small></span>
        </label>
        <div class="tool">
          <app-read-aloud [text]="sample" />
          <span><b>Read aloud</b><small>Every reading lesson has this <app-icon name="volume-2" [size]="14" /> button. Try it here.</small></span>
        </div>
        <div class="tool">
          <button class="small" (click)="tour()"><app-icon name="compass" [size]="16" /> Show the tour</button>
          <span><b>Tour of this site</b><small>A one-minute walk through the pages.</small></span>
        </div>
      </div>
    </section>

    <section class="card rise">
      <h2>How to use this site</h2>
      <ol class="howto">
        <li><b>Pick a course</b> from the list on the left, or press <b>Continue</b> on the Dashboard to go to your next lesson.</li>
        <li><b>Read the lesson.</b> Scroll down with the mouse wheel if it is long.</li>
        <li><b>Reading lessons:</b> press the green <b>I have read this</b> button at the bottom.</li>
        <li><b>Practice lessons:</b> do the tasks listed on the right. Each one ticks itself off when it is done.</li>
        <li><b>Quizzes:</b> click an answer for every question, then <b>Check my answers</b>. You can try again as often as you like.</li>
        <li><b>Next</b> at the bottom takes you to the following lesson. Your progress is saved automatically.</li>
      </ol>
      @if (learner.current()) { <a class="btn primary" routerLink="/dashboard">Go to my Dashboard →</a> }
      @else { <a class="btn primary" routerLink="/">Go to the start page →</a> }
    </section>

    <section class="card rise">
      <h2>Glossary</h2>
      <input type="text" [ngModel]="q" (ngModelChange)="search($event)" placeholder="Type a word, for example: icon, link, folder" aria-label="Search the glossary" class="search">
      @for (g of groups(); track g.name) {
        <h3>{{ g.name }}</h3>
        <dl>
          @for (e of g.items; track e.term) {
            <div class="entry"><dt>{{ e.term }}</dt><dd>{{ e.meaning }}</dd></div>
          }
        </dl>
      } @empty {
        <p class="muted">No words match "{{ q }}". Try a shorter word.</p>
      }
    </section>

    <section class="card rise">
      <h2>What the icons and buttons mean</h2>
      <div class="icons">
        @for (i of icons(); track i.name) {
          <div class="iconrow"><span class="glyph">@for (n of i.icon.split(' '); track n) { <app-icon [name]="n" [size]="20" /> }</span><div><b>{{ i.name }}</b><p>{{ i.meaning }}</p></div></div>
        }
      </div>
    </section>

    <section class="card rise">
      <h2>Keyboard shortcuts cheat sheet</h2>
      <p class="muted">Hold the first key, tap the second, let go of both.</p>
      <div class="keys">
        @for (s of shortcuts; track s[0]) {
          <div class="key"><kbd>{{ s[0] }}</kbd><span>{{ s[1] }}</span></div>
        }
      </div>
    </section>
  `,
  styles: `
    .head { margin-bottom: 20px; }
    .eyebrow { font-size: .8rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin: 0 0 2px; }
    section.card { margin-bottom: 20px; }
    .tools { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
    .tool { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1px solid var(--border); border-radius: 14px; background: var(--surface-2); cursor: pointer; }
    .tool input { width: 24px; height: 24px; flex: none; accent-color: var(--primary); }
    .tool span { display: flex; flex-direction: column; }
    .tool small { color: var(--muted); font-weight: 600; }
    .howto { padding-left: 1.3em; font-size: 1.05rem; }
    .howto li { margin-bottom: .5em; }
    .search { width: 100%; max-width: 480px; margin-bottom: 8px; }
    h3 { margin: 18px 0 6px; color: var(--primary); }
    dl { margin: 0; }
    .entry { display: grid; grid-template-columns: 190px 1fr; gap: 12px; padding: 8px 0; border-bottom: 1px dashed var(--border); }
    .entry:last-child { border-bottom: none; }
    dt { font-weight: 800; }
    dd { margin: 0; }
    .icons { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); }
    .iconrow { display: flex; gap: 12px; align-items: flex-start; padding: 10px 12px; border: 1px solid var(--border); border-radius: 14px; }
    .iconrow p { margin: 0; font-size: .95rem; color: var(--muted); }
    .glyph { width: 52px; min-height: 44px; flex: none; display: grid; place-items: center; gap: 4px; grid-auto-flow: column; background: var(--bg); border-radius: 12px; color: var(--primary-ink); padding: 6px 8px; }
    .keys { display: grid; gap: 8px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
    .key { display: flex; align-items: center; gap: 12px; }
    kbd { font-family: var(--mono); font-size: .9rem; background: var(--bg-deep); border: 1px solid var(--border); border-bottom-width: 3px; border-radius: 8px; padding: 4px 10px; white-space: nowrap; }
    @media (max-width: 600px) { .entry { grid-template-columns: 1fr; gap: 2px; } }
  `,
})
export class HelpPage {
  prefs = inject(PrefsService);
  learner = inject(LearnerService);
  private router = inject(Router);

  q = '';
  shortcuts = SHORTCUTS;
  sample = 'Hello! This is the read aloud voice. Every reading lesson has a button like this one.';
  private query = signal('');

  groups = computed(() => {
    const needle = this.query().trim().toLowerCase();
    const items = needle ? GLOSSARY.filter(e => e.term.toLowerCase().includes(needle) || e.meaning.toLowerCase().includes(needle)) : GLOSSARY;
    const out: { name: string; items: typeof GLOSSARY }[] = [];
    for (const e of items) {
      let g = out.find(x => x.name === e.group);
      if (!g) { g = { name: e.group, items: [] }; out.push(g); }
      g.items.push(e);
    }
    return out;
  });
  icons = computed(() => {
    const needle = this.query().trim().toLowerCase();
    return needle ? ICONS.filter(i => i.name.toLowerCase().includes(needle) || i.meaning.toLowerCase().includes(needle)) : ICONS;
  });

  search(v: string) { this.q = v; this.query.set(v); }

  tour() {
    this.prefs.setTourDone(false);
    if (this.learner.current()) this.router.navigate(['/dashboard']).then(() => this.prefs.requestTour());
    else this.prefs.requestTour();
  }
}
