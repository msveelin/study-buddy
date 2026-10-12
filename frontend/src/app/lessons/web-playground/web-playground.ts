import { AfterViewInit, Component, ElementRef, OnDestroy, effect, input, output, signal, viewChild } from '@angular/core';
import { Icon } from '../../core/icon';
import { FormsModule } from '@angular/forms';

export interface WebCheck { type: string; label: string; [k: string]: any; }

@Component({
  selector: 'app-web-playground',
  imports: [FormsModule, Icon],
  template: `
    <div class="play">
      <div class="editor">
        <div class="bar">
          <div class="tabs">
            <button [class.active]="tab() === 'html'" (click)="tab.set('html')">index.html</button>
            <button [class.active]="tab() === 'css'" (click)="tab.set('css')">style.css</button>
            @if (showJs()) { <button [class.active]="tab() === 'js'" (click)="tab.set('js')">script.js</button> }
          </div>
          <button class="small" (click)="reset()">Reset</button>
        </div>
        @switch (tab()) {
          @case ('html') { <textarea class="code" [(ngModel)]="html" (ngModelChange)="schedule()" (keydown)="onKey($event)" spellcheck="false"></textarea> }
          @case ('css') { <textarea class="code" [(ngModel)]="css" (ngModelChange)="schedule()" (keydown)="onKey($event)" spellcheck="false"></textarea> }
          @case ('js') { <textarea class="code" [(ngModel)]="js" (ngModelChange)="schedule()" (keydown)="onKey($event)" spellcheck="false"></textarea> }
        }
      </div>

      <div class="side">
        <div class="card preview">
          <h3>Preview</h3>
          <iframe #preview title="preview"></iframe>
          <iframe #checker class="hidden" title="checker" (load)="runChecks()"></iframe>
        </div>
        <div class="card">
          <h3>Checks</h3>
          <ul class="checks">
            @for (c of checks(); track $index; let i = $index) {
              <li [class.ok]="results()[i] === true"><span class="mark">@if (results()[i]) { <app-icon name="check" [size]="14" /> } @else { {{ i + 1 }} }</span><span>{{ c.label }}</span></li>
            }
          </ul>
          @if (allPass()) { <div class="notice success"><app-icon name="party-popper" [size]="18" /> All checks pass!</div> }
        </div>
      </div>
    </div>
  `,
  styles: `
    .play { display: grid; grid-template-columns: 1.2fr 1fr; gap: 18px; align-items: start; }
    @media (max-width: 900px) { .play { grid-template-columns: 1fr; } }
    .bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .tabs { display: flex; gap: 4px; }
    .tabs button { font-family: var(--mono); font-size: .85rem; padding: 6px 12px; border-radius: 10px 10px 0 0; border-bottom: none; background: var(--bg-deep); }
    .tabs button.active { background: var(--code-bg); color: #fff; border-color: var(--code-bg); }
    textarea.code { border-top-left-radius: 0; min-height: 340px; }
    .side { display: grid; gap: 14px; }
    .preview iframe { width: 100%; height: 300px; border: 1px solid var(--border); border-radius: 14px; background: #fff; }
    .preview iframe.hidden { position: absolute; width: 360px; height: 640px; opacity: 0; pointer-events: none; left: -9999px; top: 0; }
    h3 { margin-bottom: 8px; }
  `,
})
export class WebPlayground implements OnDestroy, AfterViewInit {
  htmlIn = input('', { alias: 'html' });
  cssIn = input('', { alias: 'css' });
  jsIn = input('', { alias: 'js' });
  checks = input<WebCheck[]>([]);
  completed = output<void>();

  checker = viewChild<ElementRef<HTMLIFrameElement>>('checker');
  preview = viewChild<ElementRef<HTMLIFrameElement>>('preview');

  html = '';
  css = '';
  js = '';
  tab = signal<'html' | 'css' | 'js'>('html');
  showJs = signal(false);
  results = signal<boolean[]>([]);
  allPass = signal(false);
  private emitted = false;
  private timer: any;

  constructor() {
    window.addEventListener('message', this.onMessage);
    effect(() => {
      this.html = this.htmlIn(); this.css = this.cssIn(); this.js = this.jsIn();
      this.showJs.set(!!this.jsIn() || this.checks().some(c => c.type === 'clickThen' || c.type === 'typeClickThen'));
      this.emitted = false; this.allPass.set(false); this.results.set([]);
      this.tab.set('html');
      this.render();
    });
  }

  reset() { this.html = this.htmlIn(); this.css = this.cssIn(); this.js = this.jsIn(); this.render(); }

  onKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const ta = e.target as HTMLTextAreaElement;
    const s = ta.selectionStart, en = ta.selectionEnd;
    const v = ta.value.slice(0, s) + '  ' + ta.value.slice(en);
    ta.value = v;
    ta.selectionStart = ta.selectionEnd = s + 2;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }

  schedule() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.render(), 400);
  }

  ngAfterViewInit() { this.render(); }

  render() {
    // Set srcdoc on the elements directly: an Angular binding would sanitize away <script> tags and ids.
    const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${this.css}</style></head><body>${this.html}<script>${this.js.replace(/<\/script/gi, '<\\/script')}<\/script></body></html>`;
    const p = this.preview()?.nativeElement, c = this.checker()?.nativeElement;
    if (p) p.srcdoc = doc;
    // The checker copy announces itself as soon as its scripts have run, so checks do not wait for slow images.
    if (c) c.srcdoc = doc.replace('</body>', '<script>parent.postMessage({ sbReady: true }, "*")<\/script></body>');
  }

  private onMessage = (ev: MessageEvent) => {
    if (ev.data?.sbReady && ev.source === this.checker()?.nativeElement.contentWindow) this.runChecks();
  };

  runChecks() {
    const frame = this.checker()?.nativeElement;
    const d = frame?.contentDocument;
    const w = frame?.contentWindow;
    if (!d || !w) return;
    const results = this.checks().map(c => { try { return this.check(c, d, w); } catch { return false; } });
    this.results.set(results);
    const all = results.length > 0 && results.every(Boolean);
    this.allPass.set(all);
    if (all && !this.emitted) { this.emitted = true; this.completed.emit(); }
  }

  private check(c: WebCheck, d: Document, w: Window): boolean {
    const all = (sel: string) => Array.from(d.querySelectorAll(sel)) as HTMLElement[];
    const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
    switch (c.type) {
      case 'textIncludes': return all(c['selector']).some(el => norm(el.textContent ?? '').includes(norm(c['text'])));
      case 'count': return all(c['selector']).length >= (c['min'] ?? 1);
      case 'attr': return all(c['selector']).some(el => (el.getAttribute(c['attr']) ?? '').toLowerCase().includes(String(c['includes']).toLowerCase()));
      case 'attrExists': return all(c['selector']).some(el => (el.getAttribute(c['attr']) ?? '').trim() !== '');
      case 'css':
      case 'cssIncludes':
      case 'cssNot':
      case 'cssMatches': {
        const el = d.querySelector(c['selector']) as Element | null;
        if (!el) return false;
        const v = w.getComputedStyle(el).getPropertyValue(c['prop']).trim();
        const want = String(c['value']);
        if (c.type === 'cssIncludes') return v.toLowerCase().includes(want.toLowerCase());
        if (c.type === 'cssNot') return v !== want;
        if (c.type === 'cssMatches') return new RegExp(want).test(v);
        return v === want;
      }
      case 'clickThenClass': {
        const btn = d.querySelector(c['selector']) as HTMLElement | null;
        if (!btn) return false;
        for (let i = 0; i < (c['times'] ?? 1); i++) btn.click();
        const t = d.querySelector(c['target']);
        return !!t && t.classList.contains(c['class']);
      }
      case 'clickThen': {
        const btn = d.querySelector(c['selector']) as HTMLElement | null;
        if (!btn) return false;
        for (let i = 0; i < (c['times'] ?? 1); i++) btn.click();
        const t = d.querySelector(c['target']);
        return norm(t?.textContent ?? '') === norm(c['text']);
      }
      case 'typeClickThen': {
        const inp = d.querySelector(c['input']) as HTMLInputElement | null;
        const btn = d.querySelector(c['selector']) as HTMLElement | null;
        if (!inp || !btn) return false;
        inp.value = c['value'];
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        btn.click();
        const t = d.querySelector(c['target']);
        return norm(t?.textContent ?? '') === norm(c['text']);
      }
      default: return false;
    }
  }

  ngOnDestroy() { clearTimeout(this.timer); window.removeEventListener('message', this.onMessage); }
}
