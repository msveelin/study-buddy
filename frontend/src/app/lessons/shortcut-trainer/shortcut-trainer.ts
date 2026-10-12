import { Component, computed, effect, input, output, signal } from '@angular/core';
import { Icon } from '../../core/icon';
import { FormsModule } from '@angular/forms';

export interface Combo { keys: string; name: string; }
export interface EditorTask { instruction: string; check: { type: 'countOccurrences' | 'textIncludes' | 'textEquals'; text: string; n?: number }; }
export interface EditorSpec { text: string; tasks: EditorTask[]; }

interface Parsed { ctrl: boolean; shift: boolean; alt: boolean; key: string; }

function parse(keys: string): Parsed {
  const parts = keys.split('+').map(p => p.trim().toLowerCase());
  const key = parts[parts.length - 1];
  return { ctrl: parts.includes('ctrl'), shift: parts.includes('shift'), alt: parts.includes('alt'), key: key === 'esc' ? 'escape' : key };
}

@Component({
  selector: 'app-shortcut-trainer',
  imports: [FormsModule, Icon],
  template: `
    @if (editor(); as ed) {
      <div class="sim">
        <div class="card window">
          <div class="titlebar"><app-icon name="file-text" [size]="16" /> Notepad - practice.txt <span class="dots"><span><app-icon name="minus" [size]="12" /></span><span><app-icon name="square" [size]="11" /></span><span><app-icon name="x" [size]="13" /></span></span></div>
          <textarea class="pad" [(ngModel)]="text" (ngModelChange)="checkEditor()" spellcheck="false" aria-label="Practice text"></textarea>
          <div class="hint">Select text by dragging across it or double-clicking a word. Then use Ctrl + C, Ctrl + X, Ctrl + V, Ctrl + Z and Ctrl + A.</div>
        </div>
        <aside class="card tasks">
          <h3>Tasks</h3>
          <ul class="checks">
            @for (t of ed.tasks; track $index; let i = $index) {
              <li [class.ok]="results()[i]"><span class="mark">@if (results()[i]) { <app-icon name="check" [size]="14" /> } @else { {{ i + 1 }} }</span><span>{{ t.instruction }}</span></li>
            }
          </ul>
          @if (finished()) { <div class="notice success"><app-icon name="party-popper" [size]="18" /> All tasks done!</div> }
          <button class="small" (click)="resetEditor()">Reset text</button>
        </aside>
      </div>
    } @else {
      <div class="card trainer">
        <div class="focus" tabindex="0" (keydown)="onKey($event)" (focus)="focused.set(true)" (blur)="focused.set(false)" [class.on]="focused()">
          @if (!finished()) {
            <p class="muted small">{{ focused() ? 'Listening for keys…' : 'Click here first, then press the keys.' }}</p>
            <div class="combo" [class.good]="good()">
              @for (k of currentKeys(); track $index; let last = $last) {
                <kbd>{{ k }}</kbd>@if (!last) { <span class="plus">+</span> }
              }
            </div>
            <h2>{{ current()?.name }}</h2>
            <p class="how">{{ howTo() }}</p>
          } @else {
            <div class="combo good"><kbd><app-icon name="check" [size]="16" [stroke]="3" /></kbd></div>
            <h2>All shortcuts done!</h2>
            <p class="how">Your fingers now know the shortcuts that work in every program.</p>
          }
        </div>
        @if (note()) { <div class="notice warn">{{ note() }}</div> }
        @if (finished()) { <div class="notice success"><app-icon name="party-popper" [size]="18" /> Lesson complete.</div> }
        <div class="progress">
          @for (c of combos(); track c.keys; let i = $index) {
            <span class="chip" [class.done]="i < index()" [class.now]="i === index()">{{ c.keys }}</span>
          }
        </div>
        <button class="small" (click)="restart()">Start again</button>
      </div>
    }
  `,
  styles: `
    .pad { width: 100%; min-height: 260px; border: none; padding: 16px; font: 1.1rem/1.6 Consolas, "Courier New", monospace; resize: vertical; outline: none; display: block; color: #000; background: #fff; }
    .trainer { text-align: center; }
    .focus { outline: none; padding: 20px; border: 2px dashed var(--border); border-radius: 16px; cursor: pointer; }
    .focus.on { border-color: var(--accent); background: var(--accent-soft); }
    .combo { display: inline-flex; align-items: center; gap: 10px; margin: 8px 0 14px; }
    .plus { font-size: 1.6rem; font-weight: 900; color: var(--muted); }
    kbd { display: inline-block; min-width: 64px; padding: 14px 20px; font: 800 1.5rem var(--sans); background: #fff; color: var(--text); border: 2px solid #c9c4b8; border-bottom-width: 6px; border-radius: 12px; transition: transform .1s, background .2s; }
    .combo.good kbd { background: var(--success); color: #fff; border-color: #0f7a37; transform: translateY(3px); border-bottom-width: 3px; }
    h2 { margin: 0 0 6px; }
    .how { color: var(--muted); margin: 0; }
    .small { font-size: .85rem; }
    .progress { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin: 16px 0 12px; }
    .chip { font-family: var(--mono); font-size: .8rem; padding: 3px 10px; border-radius: 999px; background: var(--bg-deep); color: var(--muted); }
    .chip.done { background: var(--success-soft); color: var(--success); }
    .chip.now { background: var(--accent); color: #fff; }
  `,
})
export class ShortcutTrainer {
  combos = input<Combo[]>([]);
  editor = input<EditorSpec | null>(null);
  completed = output<void>();

  index = signal(0);
  good = signal(false);
  note = signal('');
  focused = signal(false);
  finished = signal(false);
  current = computed(() => this.combos()[this.index()] ?? null);
  currentKeys = computed(() => (this.current()?.keys ?? '').split('+').map(k => k.trim() === 'Escape' ? 'Esc' : k.trim()));
  howTo = computed(() => {
    const keys = this.currentKeys();
    if (keys.length === 1) return `Press the ${keys[0]} key once.`;
    return `Hold ${keys.slice(0, -1).join(' and ')}, tap ${keys[keys.length - 1]}, then let go.`;
  });

  // editor mode
  text = '';
  results = signal<boolean[]>([]);
  private emitted = false;

  constructor() {
    effect(() => { this.combos(); this.editor(); queueMicrotask(() => this.restart()); });
  }

  restart() {
    this.index.set(0); this.good.set(false); this.note.set(''); this.finished.set(false); this.emitted = false;
    this.resetEditor();
  }

  resetEditor() {
    const ed = this.editor();
    this.text = ed?.text ?? '';
    this.results.set((ed?.tasks ?? []).map(() => false));
    this.checkEditor();
  }

  onKey(e: KeyboardEvent) {
    const cur = this.current();
    if (!cur || this.finished()) return;
    const key = e.key.toLowerCase();
    if (['control', 'shift', 'alt', 'meta'].includes(key)) return; // modifier alone: wait for the letter
    const want = parse(cur.keys);
    if (want.ctrl || ['escape', 'f2', 'tab'].includes(key) || key.startsWith('f')) e.preventDefault();
    const match = e.ctrlKey === want.ctrl && e.shiftKey === want.shift && e.altKey === want.alt && key === want.key;
    if (match) {
      this.note.set('');
      this.good.set(true);
      setTimeout(() => {
        this.good.set(false);
        if (this.index() + 1 >= this.combos().length) { this.finished.set(true); if (!this.emitted) { this.emitted = true; this.completed.emit(); } }
        else this.index.update(i => i + 1);
      }, 550);
    } else {
      const pressed = [e.ctrlKey ? 'Ctrl' : '', e.shiftKey ? 'Shift' : '', e.altKey ? 'Alt' : '', e.key === ' ' ? 'Space' : e.key.length === 1 ? e.key.toUpperCase() : e.key].filter(Boolean).join(' + ');
      if (want.ctrl && !e.ctrlKey) this.note.set(`You pressed ${pressed}. Hold the Ctrl key down first, then tap ${want.key.toUpperCase()}.`);
      else this.note.set(`You pressed ${pressed}. The shortcut wanted is ${cur.keys}. Try again.`);
    }
  }

  checkEditor() {
    const ed = this.editor();
    if (!ed) return;
    const norm = (s: string) => s.replace(/\r\n/g, '\n').trim();
    const text = norm(this.text);
    const res = ed.tasks.map(t => {
      switch (t.check.type) {
        case 'countOccurrences': return text.split(t.check.text).length - 1 >= (t.check.n ?? 1);
        case 'textIncludes': return text.includes(t.check.text);
        case 'textEquals': return text === norm(t.check.text);
        default: return false;
      }
    });
    // keep earlier ticks once earned so that later tasks (which change the text) do not undo them
    this.results.update(prev => res.map((r, i) => r || prev[i] === true));
    const all = this.results().length > 0 && this.results().every(Boolean);
    this.finished.set(all);
    if (all && !this.emitted) { this.emitted = true; this.completed.emit(); }
  }
}
