import { AfterViewInit, Component, ElementRef, effect, input, output, signal, viewChild } from '@angular/core';
import { Icon } from '../../core/icon';

export interface WordTask { instruction: string; check: any; }

@Component({
  selector: 'app-word-editor',
  imports: [Icon],
  template: `
    <div class="word">
      <div class="editor-wrap card">
        <div class="ribbon">
          <div class="tabs"><span class="active">Home</span><span>Insert</span><span>Layout</span><span>Review</span><span>View</span></div>
          <div class="toolbar">
            <div class="group">
              <button title="Undo (Ctrl+Z)" (mousedown)="cmd($event, 'undo')"><app-icon name="undo-2" [size]="16" /></button>
              <button title="Redo (Ctrl+Y)" (mousedown)="cmd($event, 'redo')"><app-icon name="redo-2" [size]="16" /></button>
            </div>
            <div class="group">
              <select title="Style" (change)="block($event)">
                <option value="p">Normal</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>
              <select title="Font" (change)="cmdValue('fontName', $event)">
                <option>Calibri</option><option>Arial</option><option>Times New Roman</option><option>Georgia</option><option>Courier New</option>
              </select>
              <select title="Size" (change)="cmdValue('fontSize', $event)">
                <option value="2">10</option><option value="3" selected>12</option><option value="4">14</option><option value="5">18</option><option value="6">24</option><option value="7">36</option>
              </select>
            </div>
            <div class="group">
              <button class="b" title="Bold (Ctrl+B)" (mousedown)="cmd($event, 'bold')"><b>B</b></button>
              <button title="Italic (Ctrl+I)" (mousedown)="cmd($event, 'italic')"><i>I</i></button>
              <button title="Underline (Ctrl+U)" (mousedown)="cmd($event, 'underline')"><u>U</u></button>
              <label class="color" title="Font colour">
                <span>A</span>
                <input type="color" value="#c92a2a" (input)="cmdValue('foreColor', $event)">
              </label>
            </div>
            <div class="group">
              <button title="Bullets" (mousedown)="cmd($event, 'insertUnorderedList')"><app-icon name="list" [size]="16" /></button>
              <button title="Numbering" (mousedown)="cmd($event, 'insertOrderedList')"><app-icon name="list-ordered" [size]="16" /></button>
            </div>
            <div class="group">
              <button title="Align left (Ctrl+L)" (mousedown)="cmd($event, 'justifyLeft')"><app-icon name="align-left" [size]="16" /></button>
              <button title="Center (Ctrl+E)" (mousedown)="cmd($event, 'justifyCenter')"><app-icon name="align-center" [size]="16" /></button>
              <button title="Align right (Ctrl+R)" (mousedown)="cmd($event, 'justifyRight')"><app-icon name="align-right" [size]="16" /></button>
            </div>
          </div>
        </div>
        <div class="paper">
          <div #editor class="sheet" contenteditable="true" spellcheck="true" (input)="schedule()" (keyup)="schedule()" (mouseup)="schedule()"></div>
        </div>
        <div class="statusbar muted">Page 1 of 1 · {{ wordCount() }} words</div>
      </div>

      <aside class="card tasks">
        <h3>Tasks</h3>
        <ul class="checks">
          @for (t of tasks(); track $index; let i = $index) {
            <li [class.ok]="results()[i]"><span class="mark">@if (results()[i]) { <app-icon name="check" [size]="14" /> } @else { {{ i + 1 }} }</span><span>{{ t.instruction }}</span></li>
          }
        </ul>
        @if (allDone()) { <div class="notice success"><app-icon name="party-popper" [size]="18" /> All tasks done!</div> }
        <button class="small" (click)="resetDoc()">Reset document</button>
      </aside>
    </div>
  `,
  styles: `
    .word { display: grid; grid-template-columns: 1fr 300px; gap: 18px; align-items: start; }
    @media (max-width: 900px) { .word { grid-template-columns: 1fr; } }
    .editor-wrap { padding: 0; overflow: hidden; }
    .ribbon { background: #f3f3f3; border-bottom: 1px solid #d9d9d9; }
    .tabs { display: flex; gap: 2px; padding: 6px 10px 0; font-size: .85rem; background: #2b579a; color: #dbe5f5; font-family: 'Segoe UI', system-ui, sans-serif; }
    .tabs span { padding: 5px 12px; border-radius: 6px 6px 0 0; }
    .tabs .active { background: #f3f3f3; color: #222; font-weight: 600; }
    .toolbar { display: flex; flex-wrap: wrap; gap: 6px 14px; padding: 8px 10px; }
    .group { display: flex; gap: 4px; align-items: center; padding-right: 14px; border-right: 1px solid #d9d9d9; }
    .group:last-child { border-right: none; }
    .toolbar button { padding: 4px 9px; font-size: .95rem; border-radius: 5px; min-width: 32px; font-family: 'Segoe UI', system-ui, sans-serif; font-weight: 500; }
    .toolbar select { padding: 4px 6px; border-radius: 5px; font-size: .9rem; }
    .color { position: relative; display: inline-grid; place-items: center; width: 34px; height: 32px; border: 1px solid var(--border); border-radius: 5px; background: #fff; cursor: pointer; font-weight: 700; }
    .color span { border-bottom: 4px solid #c92a2a; line-height: 1; }
    .color input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    .paper { background: #e9e9e9; padding: 22px; min-height: 420px; }
    .sheet { background: #fff; color: rgb(0, 0, 0); min-height: 380px; padding: 48px 56px; margin: 0 auto; max-width: 640px;
      box-shadow: 0 2px 10px rgba(0,0,0,.15); font-family: Calibri, "Segoe UI", sans-serif; font-size: 12pt; line-height: 1.5; outline: none; }
    .sheet :is(h1, h2, h3) { margin: .4em 0; }
    .sheet p { margin: 0 0 .6em; }
    .statusbar { font-size: .8rem; padding: 4px 12px; background: #2b579a; color: #dbe5f5; }
    .tasks h3 { margin-bottom: 8px; }
    .tasks button { margin-top: 12px; }
  `,
})
export class WordEditor implements AfterViewInit {
  starterHtml = input('');
  tasks = input.required<WordTask[]>();
  completed = output<void>();

  editor = viewChild.required<ElementRef<HTMLDivElement>>('editor');
  results = signal<boolean[]>([]);
  wordCount = signal(0);
  allDone = signal(false);
  private emitted = false;
  private timer: any;

  constructor() {
    effect(() => { this.starterHtml(); this.tasks(); this.emitted = false; this.allDone.set(false); queueMicrotask(() => this.resetDoc()); });
  }

  ngAfterViewInit() { this.resetDoc(); }

  resetDoc() {
    const el = this.editor()?.nativeElement;
    if (!el) return;
    el.innerHTML = this.starterHtml() || '<p><br></p>';
    this.runChecks();
  }

  cmd(e: Event, command: string) {
    e.preventDefault();
    this.editor().nativeElement.focus();
    document.execCommand(command, false);
    this.schedule();
  }

  cmdValue(command: string, e: Event) {
    const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
    this.editor().nativeElement.focus();
    document.execCommand(command, false, value);
    this.schedule();
  }

  block(e: Event) {
    const tag = (e.target as HTMLSelectElement).value;
    this.editor().nativeElement.focus();
    document.execCommand('formatBlock', false, tag);
    this.schedule();
  }

  schedule() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.runChecks(), 150);
  }

  // ---------- checks ----------
  private norm(s: string) { return s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim(); }

  runChecks() {
    const root = this.editor().nativeElement;
    const text = this.norm(root.innerText || '');
    this.wordCount.set(text ? text.split(' ').length : 0);
    const results = this.tasks().map(t => this.check(root, t.check, text));
    this.results.set(results);
    const all = results.length > 0 && results.every(Boolean);
    this.allDone.set(all);
    if (all && !this.emitted) { this.emitted = true; this.completed.emit(); }
  }

  private check(root: HTMLElement, c: any, text: string): boolean {
    const lower = text.toLowerCase();
    switch (c.type) {
      case 'containsText': return lower.includes(this.norm(c.text).toLowerCase());
      case 'containsTextAny': return (c.texts as string[]).some(t => lower.includes(this.norm(t).toLowerCase()));
      case 'notContainsText': return text.length > 0 && !lower.includes(this.norm(c.text).toLowerCase());
      case 'minWords': return this.wordCount() >= c.n;
      case 'list': return root.querySelectorAll(`${c.kind} li`).length >= (c.min ?? 1);
      case 'style': {
        const nodes = this.textNodesCovering(root, c.text);
        return nodes.length > 0 && nodes.every(n => this.has(n.parentElement!, c.prop, root));
      }
      case 'tag': {
        const nodes = this.textNodesCovering(root, c.text);
        return nodes.length > 0 && nodes.every(n => !!n.parentElement?.closest(c.tag));
      }
      case 'anyStyle': {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let n: Node | null;
        while ((n = walker.nextNode())) {
          if (this.norm(n.textContent ?? '') && this.has((n as Text).parentElement!, c.prop, root)) return true;
        }
        return false;
      }
      default: return false;
    }
  }

  /** Text nodes that overlap the first occurrence of `text` (whitespace-insensitive, case-insensitive). */
  private textNodesCovering(root: HTMLElement, text: string): Text[] {
    const nodes: Text[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n: Node | null;
    while ((n = walker.nextNode())) nodes.push(n as Text);
    const full = nodes.map(t => t.data).join('');
    const pattern = this.norm(text).split(' ').map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s\\u00a0]+');
    const m = new RegExp(pattern, 'i').exec(full);
    if (!m) return [];
    const start = m.index, end = start + m[0].length;
    const out: Text[] = [];
    let pos = 0;
    for (const t of nodes) {
      const a = pos, b = pos + t.data.length;
      pos = b;
      if (b <= start || a >= end) continue;
      if (t.data.slice(Math.max(start, a) - a, Math.min(end, b) - a).trim() === '') continue; // whitespace-only overlap
      out.push(t);
    }
    return out;
  }

  private has(el: Element, prop: string, root: HTMLElement): boolean {
    const cs = getComputedStyle(el);
    switch (prop) {
      case 'bold': return cs.fontWeight === 'bold' || parseInt(cs.fontWeight, 10) >= 600;
      case 'italic': return cs.fontStyle === 'italic';
      case 'underline': {
        let cur: Element | null = el;
        while (cur && cur !== root) {
          if (getComputedStyle(cur).textDecorationLine.includes('underline')) return true;
          cur = cur.parentElement;
        }
        return false;
      }
      case 'color': return cs.color !== 'rgb(0, 0, 0)';
      case 'center': return cs.textAlign === 'center';
      case 'right': return cs.textAlign === 'right';
      case 'left': return cs.textAlign === 'left' || cs.textAlign === 'start';
      default: return false;
    }
  }
}
