import { Component, OnDestroy, effect, input, output, signal } from '@angular/core';
import { Icon } from '../../core/icon';
import { FormsModule } from '@angular/forms';

export interface CodeTest { type: 'outputIncludes' | 'outputEquals' | 'outputLines' | 'outputMatches'; value: any; }

const WORKER_SRC = `
self.onmessage = function (e) {
  function fmt(v) {
    if (typeof v === 'string') return v;
    if (v === undefined) return 'undefined';
    if (typeof v === 'function') return '[function]';
    try { return JSON.stringify(v); } catch (err) { return String(v); }
  }
  function post(type, args) { self.postMessage({ type: type, text: Array.prototype.map.call(args, fmt).join(' ') }); }
  var fake = {
    log: function () { post('log', arguments); },
    info: function () { post('log', arguments); },
    warn: function () { post('warn', arguments); },
    error: function () { post('error', arguments); }
  };
  try {
    new Function('console', e.data)(fake);
  } catch (err) {
    self.postMessage({ type: 'error', text: (err && err.name ? err.name + ': ' + err.message : String(err)) });
  }
  self.postMessage({ type: 'done' });
};`;

/** Turns a raw JavaScript error into a sentence a beginner can act on. The original is kept in brackets. */
export function friendly(raw: string): string {
  const msg = raw.replace(/^Uncaught\s+/, '');
  let m: RegExpExecArray | null;
  if ((m = /ReferenceError: (\w+) is not defined/.exec(msg)))
    return `The computer does not know what "${m[1]}" is. Check the spelling (capital letters matter), and make sure you created it with let before using it.  [${msg}]`;
  if ((m = /SyntaxError: Unexpected token '?([^']*)'?/.exec(msg)) || (m = /SyntaxError: Unexpected (end of input|identifier|string|number)/.exec(msg)))
    return `There is a typing mistake somewhere: a bracket, quote mark or comma is missing or extra. Check that every ( has a ), every { has a } and every quote is closed.  [${msg}]`;
  if (/SyntaxError: missing \) after argument list/.test(msg) || /SyntaxError: Invalid or unexpected token/.test(msg))
    return `Something is unfinished: usually a closing bracket ) or a closing quote mark is missing.  [${msg}]`;
  if ((m = /TypeError: (\S+) is not a function/.exec(msg)))
    return `"${m[1]}" is not something you can run with brackets after it. Check the spelling: for example console.log, not console.Log.  [${msg}]`;
  if ((m = /TypeError: Cannot read propert(?:y|ies) of (undefined|null)(?: \(reading '([^']+)'\))?/.exec(msg)))
    return `You tried to use ${m[2] ? `"${m[2]}" of ` : ''}something that is empty (${m[1]}). Make sure the variable was given a value first.  [${msg}]`;
  if ((m = /TypeError: Assignment to constant variable/.exec(msg)))
    return `You tried to change a value that was created with const. Use let instead if it needs to change.  [${msg}]`;
  if ((m = /SyntaxError: Identifier '(\w+)' has already been declared/.exec(msg)))
    return `"${m[1]}" was already created with let earlier. Create each variable only once; after that just use its name.  [${msg}]`;
  if (/RangeError: Maximum call stack/.test(msg))
    return `A function kept calling itself forever. Make sure there is a way for it to stop.  [${msg}]`;
  return msg;
}

@Component({
  selector: 'app-code-playground',
  imports: [FormsModule, Icon],
  template: `
    <div class="play">
      <div class="editor">
        <div class="bar">
          <span class="file">script.js</span>
          <div class="row">
            <button class="small" (click)="reset()">Reset</button>
            <button class="small" (click)="showSolution()" [disabled]="!solution()">Show solution</button>
            <button class="primary small" (click)="run()" [disabled]="running()">▶ Run (Ctrl+Enter)</button>
          </div>
        </div>
        <textarea class="code" [(ngModel)]="code" (keydown)="onKey($event)" spellcheck="false"></textarea>
      </div>

      <div class="side">
        <div class="card out">
          <h3>Output</h3>
          <pre>@for (l of lines(); track $index) {<div [class]="l.type">{{ l.text }}</div>}@if (!lines().length) {<span class="muted">Press Run to see your output here.</span>}</pre>
        </div>
        <div class="card">
          <h3>Checks</h3>
          <ul class="checks">
            @for (t of tests(); track $index; let i = $index) {
              <li [class.ok]="results()[i] === true"><span class="mark">@if (results()[i]) { <app-icon name="check" [size]="14" /> } @else { {{ i + 1 }} }</span><span>{{ label(t) }}</span></li>
            }
          </ul>
          @if (allPass()) { <div class="notice success"><app-icon name="party-popper" [size]="18" /> All checks pass!</div> }
          @else if (ran() && !allPass()) { <div class="notice warn">Not quite yet. Compare your output with the checks and try again.</div> }
        </div>
      </div>
    </div>
  `,
  styles: `
    .play { display: grid; grid-template-columns: 1.3fr 1fr; gap: 18px; align-items: start; }
    @media (max-width: 900px) { .play { grid-template-columns: 1fr; } }
    .bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
    .file { font-family: var(--mono); color: var(--muted); }
    .side { display: grid; gap: 14px; }
    .out pre { background: var(--code-bg); color: #e6edf3; padding: 14px 16px; border-radius: 14px; min-height: 120px; margin: 0; font-family: var(--mono); font-size: .95rem; white-space: pre-wrap; }
    .out .error { color: #ff8787; }
    .out .warn { color: #ffd43b; }
    h3 { margin-bottom: 8px; }
  `,
})
export class CodePlayground implements OnDestroy {
  starter = input('');
  tests = input<CodeTest[]>([]);
  solution = input('');
  completed = output<void>();

  code = '';
  lines = signal<{ type: string; text: string }[]>([]);
  results = signal<boolean[]>([]);
  running = signal(false);
  ran = signal(false);
  allPass = signal(false);
  private emitted = false;
  private worker: Worker | null = null;
  private timeout: any;

  constructor() {
    effect(() => { this.code = this.starter(); this.lines.set([]); this.results.set([]); this.ran.set(false); this.allPass.set(false); this.emitted = false; });
  }

  reset() { this.code = this.starter(); }
  showSolution() { this.code = this.solution(); }

  onKey(e: KeyboardEvent) {
    const ta = e.target as HTMLTextAreaElement;
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = ta.selectionStart, en = ta.selectionEnd;
      this.code = this.code.slice(0, s) + '  ' + this.code.slice(en);
      setTimeout(() => ta.selectionStart = ta.selectionEnd = s + 2);
    } else if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      this.run();
    }
  }

  run() {
    this.stop();
    this.lines.set([]);
    this.running.set(true);
    const blob = new Blob([WORKER_SRC], { type: 'application/javascript' });
    const w = new Worker(URL.createObjectURL(blob));
    this.worker = w;
    w.onmessage = (ev) => {
      const m = ev.data;
      if (m.type === 'done') { this.finish(); return; }
      this.lines.update(l => [...l, { type: m.type, text: m.type === 'error' ? friendly(m.text) : m.text }]);
    };
    w.onerror = (ev) => { this.lines.update(l => [...l, { type: 'error', text: friendly(ev.message) }]); this.finish(); };
    this.timeout = setTimeout(() => {
      this.lines.update(l => [...l, { type: 'error', text: 'Stopped: your program ran for more than 3 seconds. Is there a loop that never ends?' }]);
      this.finish();
    }, 3000);
    w.postMessage(this.code);
  }

  private finish() {
    this.stop();
    this.running.set(false);
    this.ran.set(true);
    const out = this.lines().filter(l => l.type !== 'error').map(l => l.text).join('\n');
    const results = this.tests().map(t => this.evaluate(t, out));
    this.results.set(results);
    const all = results.length > 0 && results.every(Boolean);
    this.allPass.set(all);
    if (all && !this.emitted) { this.emitted = true; this.completed.emit(); }
  }

  private evaluate(t: CodeTest, out: string): boolean {
    const norm = (s: string) => s.replace(/\r\n/g, '\n').trim();
    switch (t.type) {
      case 'outputIncludes': return out.includes(String(t.value));
      case 'outputEquals': return norm(out) === norm(String(t.value));
      case 'outputLines': return norm(out) !== '' && norm(out).split('\n').length === Number(t.value);
      case 'outputMatches': return new RegExp(t.value).test(norm(out));
      default: return false;
    }
  }

  label(t: CodeTest): string {
    switch (t.type) {
      case 'outputIncludes': return `Output includes: ${t.value}`;
      case 'outputEquals': return `Output is exactly: ${String(t.value).replace(/\n/g, ' ⏎ ')}`;
      case 'outputLines': return `Output has ${t.value} lines`;
      case 'outputMatches': return `Output has the right shape`;
    }
  }

  private stop() {
    clearTimeout(this.timeout);
    if (this.worker) { this.worker.terminate(); this.worker = null; }
  }

  ngOnDestroy() { this.stop(); }
}
