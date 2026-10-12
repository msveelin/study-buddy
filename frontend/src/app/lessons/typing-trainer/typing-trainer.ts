import { Component, HostListener, OnDestroy, computed, effect, input, output, signal } from '@angular/core';
import { Icon } from '../../core/icon';
import { DecimalPipe } from '@angular/common';

export interface TypingResult { wpm: number; accuracy: number; seconds: number; }

type Finger = 'lp' | 'lr' | 'lm' | 'li' | 'ri' | 'rm' | 'rr' | 'rp' | 'th';
interface Key { label: string; shifted?: string; finger: Finger; wide?: number; }

const F = (label: string, shifted: string, finger: Finger, wide?: number): Key => ({ label, shifted, finger, wide });
const ROWS: Key[][] = [
  [F('`', '~', 'lp'), F('1', '!', 'lp'), F('2', '@', 'lr'), F('3', '#', 'lm'), F('4', '$', 'li'), F('5', '%', 'li'),
   F('6', '^', 'ri'), F('7', '&', 'ri'), F('8', '*', 'rm'), F('9', '(', 'rr'), F('0', ')', 'rp'), F('-', '_', 'rp'), F('=', '+', 'rp'),
   { label: 'Backspace', finger: 'rp', wide: 2 }],
  [{ label: 'Tab', finger: 'lp', wide: 1.5 }, F('q', 'Q', 'lp'), F('w', 'W', 'lr'), F('e', 'E', 'lm'), F('r', 'R', 'li'), F('t', 'T', 'li'),
   F('y', 'Y', 'ri'), F('u', 'U', 'ri'), F('i', 'I', 'rm'), F('o', 'O', 'rr'), F('p', 'P', 'rp'), F('[', '{', 'rp'), F(']', '}', 'rp'), F('\\', '|', 'rp', 1.5)],
  [{ label: 'Caps', finger: 'lp', wide: 1.8 }, F('a', 'A', 'lp'), F('s', 'S', 'lr'), F('d', 'D', 'lm'), F('f', 'F', 'li'), F('g', 'G', 'li'),
   F('h', 'H', 'ri'), F('j', 'J', 'ri'), F('k', 'K', 'rm'), F('l', 'L', 'rr'), F(';', ':', 'rp'), F("'", '"', 'rp'), { label: 'Enter', finger: 'rp', wide: 2.2 }],
  [{ label: 'Shift', finger: 'lp', wide: 2.4 }, F('z', 'Z', 'lp'), F('x', 'X', 'lr'), F('c', 'C', 'lm'), F('v', 'V', 'li'), F('b', 'B', 'li'),
   F('n', 'N', 'ri'), F('m', 'M', 'ri'), F(',', '<', 'rm'), F('.', '>', 'rr'), F('/', '?', 'rp'), { label: 'Shift', finger: 'rp', wide: 2.6 }],
  [{ label: '', finger: 'th', wide: 8 }],
];

const FINGER_NAME: Record<Finger, string> = {
  lp: 'left pinky', lr: 'left ring', lm: 'left middle', li: 'left index',
  ri: 'right index', rm: 'right middle', rr: 'right ring', rp: 'right pinky', th: 'thumb',
};

@Component({
  selector: 'app-typing-trainer',
  imports: [DecimalPipe, Icon],
  template: `
    <div class="card trainer">
      <div class="stats">
        <div><span class="lbl">Speed</span><strong>{{ wpm() | number:'1.0-0' }}</strong> wpm</div>
        <div><span class="lbl">Accuracy</span><strong>{{ accuracy() | number:'1.0-0' }}</strong>%</div>
        <div><span class="lbl">Time</span><strong>{{ elapsed() | number:'1.0-0' }}</strong>s</div>
        <div class="target"><span class="lbl">Target</span>
          @if (targetWpm() > 0) { <strong>{{ targetWpm() }}</strong> wpm · } <strong>{{ targetAccuracy() }}</strong>% accuracy
          @if (best() != null) { <span class="muted"> · your best {{ best() | number:'1.0-0' }} wpm</span> }
        </div>
      </div>

      @if (!finishedFlag()) {
        <div class="text" tabindex="0" (click)="focusHint.set(false)">
          @for (ch of chars(); track $index; let i = $index) {
            <span [class.ok]="states()[i] === 'ok'" [class.bad]="states()[i] === 'bad'" [class.cur]="i === index()"
              [class.space]="ch === ' '">{{ ch === ' ' ? '␣' : ch }}</span>
          }
        </div>
        <p class="hint muted">
          @if (index() === 0) { Just start typing. The timer starts with your first key. }
          @else { Next: <strong>{{ nextLabel() }}</strong> with your <strong>{{ nextFinger() }}</strong>@if (needShift()) { (hold Shift with the other hand) } }
        </p>
      } @else {
        <div class="result" [class.pass]="passed()">
          <h2>@if (passed()) { <app-icon name="party-popper" [size]="26" /> Target reached! } @else { Good effort! }</h2>
          <p>
            You typed at <strong>{{ wpm() | number:'1.0-0' }} wpm</strong> with <strong>{{ accuracy() | number:'1.0-0' }}% accuracy</strong>
            in {{ elapsed() | number:'1.0-0' }} seconds.
          </p>
          @if (!passed()) {
            <p class="muted">Target: {{ targetAccuracy() }}% accuracy@if (targetWpm() > 0) { and {{ targetWpm() }} wpm }. Try again. Slow down and focus on hitting the right key.</p>
          }
          <button class="primary" (click)="reset()">Try again</button>
        </div>
      }

      <div class="keyboard">
        @for (row of rows; track $index) {
          <div class="krow">
            @for (k of row; track $index) {
              <div class="key" [class]="'key f-' + k.finger"
                [class.next]="isNext(k)" [class.learn]="isLearning(k)" [style.flex]="k.wide ?? 1">
                @if (k.shifted && k.shifted !== k.label.toUpperCase()) { <small>{{ k.shifted }}</small> }
                {{ k.label.length === 1 ? k.label.toUpperCase() : k.label }}
              </div>
            }
          </div>
        }
        <div class="legend">
          <span class="f-lp">pinky</span><span class="f-lr">ring</span><span class="f-lm">middle</span><span class="f-li">index</span>
          <span class="f-th">thumb</span>
          <span class="f-ri">index</span><span class="f-rm">middle</span><span class="f-rr">ring</span><span class="f-rp">pinky</span>
        </div>
      </div>
    </div>
  `,
  styles: `
    .trainer { margin-bottom: 20px; }
    .stats { display: flex; gap: 28px; flex-wrap: wrap; margin-bottom: 14px; font-size: .95rem; }
    .stats strong { font-size: 1.3rem; margin-right: 2px; }
    .lbl { display: block; font-size: .75rem; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); }
    .target { margin-left: auto; }
    .text { font-family: var(--mono); font-size: 1.55rem; line-height: 2; padding: 18px 22px; background: var(--surface-2); border: 2px solid var(--border);
      border-radius: 16px; user-select: none; letter-spacing: .02em; word-break: break-word; outline: none; }
    .text:focus { border-color: var(--accent); }
    .text span { border-radius: 4px; padding: 0 1px; }
    .text .ok { color: var(--success); }
    .text .bad { color: #fff; background: var(--danger); }
    .text .cur { background: var(--accent); color: #fff; animation: blink 1s steps(2) infinite; }
    .text .space { color: #c0c6d4; }
    .text .space.ok { color: #a6d9b1; }
    @keyframes blink { 50% { background: var(--accent-soft); color: var(--text); } }
    .hint { margin: 10px 0 0; min-height: 1.5em; }
    .result { text-align: center; padding: 24px; border-radius: 16px; background: var(--warn-soft); }
    .result.pass { background: var(--success-soft); }
    .keyboard { margin-top: 18px; user-select: none; }
    .krow { display: flex; gap: 5px; margin-bottom: 5px; }
    .key { flex: 1; height: 44px; border-radius: 7px; border: 1px solid var(--border); display: grid; place-items: center; font-weight: 600; font-size: .9rem;
      position: relative; background: #fff; color: #3a4154; min-width: 0; }
    .key small { position: absolute; top: 2px; left: 6px; font-size: .65rem; color: var(--muted); }
    .key.learn { box-shadow: inset 0 0 0 2px var(--accent); }
    .key.next { background: var(--accent) !important; color: #fff; transform: translateY(2px); }
    .f-lp, .f-rp { background: #fde2e4; } .f-lr, .f-rr { background: #fff1cf; } .f-lm, .f-rm { background: #dff5e1; }
    .f-li, .f-ri { background: #dbe9ff; } .f-th { background: #f0e6ff; }
    .legend { display: flex; justify-content: center; gap: 8px; margin-top: 10px; font-size: .75rem; }
    .legend span { padding: 2px 10px; border-radius: 999px; border: 1px solid var(--border); }
  `,
})
export class TypingTrainer implements OnDestroy {
  text = input.required<string>();
  keys = input<string[]>([]);
  targetWpm = input(0);
  targetAccuracy = input(90);
  best = input<number | null>(null);
  finished = output<TypingResult>();

  rows = ROWS;
  focusHint = signal(true);

  chars = computed(() => Array.from(this.text()));
  index = signal(0);
  states = signal<(('ok' | 'bad') | null)[]>([]);
  keystrokes = signal(0);
  errors = signal(0);
  elapsed = signal(0);
  finishedFlag = signal(false);
  finishedResult = signal<TypingResult | null>(null);
  private startedAt: number | null = null;
  private timer: any = null;

  wpm = computed(() => {
    const minutes = this.elapsed() / 60;
    return minutes > 0 ? (this.index() / 5) / minutes : 0;
  });
  accuracy = computed(() => this.keystrokes() ? Math.max(0, (1 - this.errors() / this.keystrokes()) * 100) : 100);
  passed = computed(() => this.accuracy() >= this.targetAccuracy() && this.wpm() >= this.targetWpm());

  nextChar = computed(() => this.chars()[this.index()] ?? '');
  nextKey = computed<Key | null>(() => {
    const c = this.nextChar();
    if (!c) return null;
    if (c === ' ') return ROWS[4][0];
    for (const row of ROWS) for (const k of row) if (k.label === c || k.shifted === c) return k;
    return null;
  });
  needShift = computed(() => {
    const c = this.nextChar(); const k = this.nextKey();
    return !!k && k.shifted === c && k.label !== c;
  });
  nextLabel = computed(() => this.nextChar() === ' ' ? 'Space' : this.nextChar());
  nextFinger = computed(() => this.nextKey() ? FINGER_NAME[this.nextKey()!.finger] : '');

  constructor() {
    effect(() => { this.text(); this.reset(); });
  }

  isNext(k: Key) { return !this.finishedFlag() && this.nextKey() === k; }
  isLearning(k: Key) {
    const keys = this.keys();
    if (keys.includes('shift') && k.label === 'Shift') return true;
    return keys.includes(k.label) || (!!k.shifted && keys.includes(k.shifted));
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (this.finishedFlag()) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (this.index() > 0) {
        this.index.update(i => i - 1);
        this.states.update(s => { const c = [...s]; c[this.index()] = null; return c; });
      }
      return;
    }
    if (e.key.length !== 1) return;
    e.preventDefault();

    if (this.startedAt === null) {
      this.startedAt = performance.now();
      this.timer = setInterval(() => this.elapsed.set((performance.now() - this.startedAt!) / 1000), 200);
    }
    const expected = this.chars()[this.index()];
    const ok = e.key === expected;
    this.keystrokes.update(n => n + 1);
    if (!ok) this.errors.update(n => n + 1);
    this.states.update(s => { const c = [...s]; c[this.index()] = ok ? 'ok' : 'bad'; return c; });
    this.index.update(i => i + 1);

    if (this.index() >= this.chars().length) this.finish();
  }

  private finish() {
    clearInterval(this.timer);
    this.elapsed.set((performance.now() - this.startedAt!) / 1000);
    this.finishedFlag.set(true);
    const r = { wpm: Math.round(this.wpm() * 10) / 10, accuracy: Math.round(this.accuracy() * 10) / 10, seconds: Math.round(this.elapsed()) };
    this.finishedResult.set(r);
    this.finished.emit(r);
  }

  reset() {
    clearInterval(this.timer);
    this.startedAt = null;
    this.index.set(0);
    this.states.set(new Array(this.chars().length).fill(null));
    this.keystrokes.set(0);
    this.errors.set(0);
    this.elapsed.set(0);
    this.finishedFlag.set(false);
    this.finishedResult.set(null);
  }

  ngOnDestroy() { clearInterval(this.timer); }
}
