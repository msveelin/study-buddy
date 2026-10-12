import { Component, computed, effect, input, output, signal } from '@angular/core';
import { Icon } from '../../core/icon';
import { FormsModule } from '@angular/forms';

export interface SheetTask { instruction: string; check: any; }
interface CellStyle { bold?: boolean; italic?: boolean; fill?: boolean; }

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const ROWS = Array.from({ length: 12 }, (_, i) => i + 1);

/** Tiny formula engine: numbers, + - * / ( ), cell refs, ranges inside SUM/AVERAGE/MIN/MAX/COUNT. */
class Evaluator {
  private cache = new Map<string, number | string>();
  private stack = new Set<string>();
  constructor(private raw: Record<string, string>) {}

  value(cell: string): number | string {
    cell = cell.toUpperCase();
    if (this.cache.has(cell)) return this.cache.get(cell)!;
    const r = (this.raw[cell] ?? '').trim();
    let v: number | string;
    if (r === '') v = '';
    else if (r.startsWith('=')) {
      if (this.stack.has(cell)) return '#REF!';
      this.stack.add(cell);
      try { v = this.expr(r.slice(1)); } catch (e: any) { v = typeof e === 'string' ? e : '#VALUE!'; }
      this.stack.delete(cell);
    } else if (/^-?\d+(\.\d+)?$/.test(r)) v = parseFloat(r);
    else v = r;
    this.cache.set(cell, v);
    return v;
  }

  private pos = 0; private src = '';
  private expr(src: string): number | string {
    this.src = src.replace(/\s+/g, ''); this.pos = 0;
    const v = this.sum();
    if (this.pos < this.src.length) throw '#VALUE!';
    return typeof v === 'number' && !isFinite(v) ? '#DIV/0!' : v;
  }
  private peek() { return this.src[this.pos]; }
  private sum(): number {
    let v = this.term();
    while (this.peek() === '+' || this.peek() === '-') { const op = this.src[this.pos++]; const r = this.term(); v = op === '+' ? v + r : v - r; }
    return v;
  }
  private term(): number {
    let v = this.factor();
    while (this.peek() === '*' || this.peek() === '/') { const op = this.src[this.pos++]; const r = this.factor(); if (op === '/') { if (r === 0) throw '#DIV/0!'; v = v / r; } else v = v * r; }
    return v;
  }
  private factor(): number {
    const c = this.peek();
    if (c === '(') { this.pos++; const v = this.sum(); if (this.peek() !== ')') throw '#VALUE!'; this.pos++; return v; }
    if (c === '-') { this.pos++; return -this.factor(); }
    const num = /^\d+(\.\d+)?/.exec(this.src.slice(this.pos));
    if (num) { this.pos += num[0].length; return parseFloat(num[0]); }
    const fn = /^([A-Za-z]+)\(/.exec(this.src.slice(this.pos));
    if (fn) {
      const name = fn[1].toUpperCase(); this.pos += fn[0].length;
      const args: number[] = [];
      while (this.peek() !== ')') {
        const range = /^([A-Za-z]+\d+):([A-Za-z]+\d+)/.exec(this.src.slice(this.pos));
        if (range) { this.pos += range[0].length; for (const cell of this.cells(range[1], range[2])) { const v = this.value(cell); if (typeof v === 'number') args.push(v); else if (typeof v === 'string' && v.startsWith('#')) throw v; } }
        else args.push(this.sum());
        if (this.peek() === ',' || this.peek() === ';') this.pos++;
        else if (this.peek() !== ')') throw '#VALUE!';
      }
      this.pos++;
      switch (name) {
        case 'SUM': return args.reduce((a, b) => a + b, 0);
        case 'AVERAGE': return args.length ? args.reduce((a, b) => a + b, 0) / args.length : 0;
        case 'MIN': return args.length ? Math.min(...args) : 0;
        case 'MAX': return args.length ? Math.max(...args) : 0;
        case 'COUNT': return args.length;
        default: throw '#NAME?';
      }
    }
    const ref = /^[A-Za-z]+\d+/.exec(this.src.slice(this.pos));
    if (ref) {
      this.pos += ref[0].length;
      const v = this.value(ref[0]);
      if (v === '') return 0;
      if (typeof v === 'string') { if (v.startsWith('#')) throw v; throw '#VALUE!'; }
      return v;
    }
    if (/^[A-Za-z]+/.test(this.src.slice(this.pos))) throw '#NAME?';
    throw '#VALUE!';
  }
  cells(a: string, b: string): string[] {
    const pa = /^([A-Z]+)(\d+)$/.exec(a.toUpperCase())!, pb = /^([A-Z]+)(\d+)$/.exec(b.toUpperCase())!;
    const c1 = COLS.indexOf(pa[1]), c2 = COLS.indexOf(pb[1]), r1 = +pa[2], r2 = +pb[2];
    const out: string[] = [];
    for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) out.push(`${COLS[c]}${r}`);
    return out;
  }
}

@Component({
  selector: 'app-sheet-editor',
  imports: [FormsModule, Icon],
  template: `
    <div class="sim">
      <div class="card window sheet">
        <div class="titlebar xl"><app-icon name="table" [size]="16" /> Excel - Book1.xlsx <span class="dots"><span><app-icon name="minus" [size]="12" /></span><span><app-icon name="square" [size]="11" /></span><span><app-icon name="x" [size]="13" /></span></span></div>
        <div class="toolbar">
          <button [class.on]="style(sel()).bold" (click)="toggle('bold')" title="Bold (Ctrl+B)"><b>B</b></button>
          <button [class.on]="style(sel()).italic" (click)="toggle('italic')" title="Italic (Ctrl+I)"><i>I</i></button>
          <button [class.on]="style(sel()).fill" (click)="toggle('fill')" title="Fill colour"><app-icon name="paint-bucket" [size]="16" /> Fill</button>
          <span class="sep"></span>
          <button (click)="autosum()" title="AutoSum">Σ AutoSum</button>
          <button (click)="clearCell()" title="Clear">Clear</button>
          <span class="sep"></span>
          <span class="namebox">{{ sel() }}</span>
          <span class="fx">fx</span>
          <input type="text" class="fbar" [value]="editing() !== null ? editText : rawOf(sel())" (input)="fromBar($any($event.target).value)" (keydown.enter)="commit(); move(1, 0)" (focus)="beginEdit(true)" aria-label="Formula bar">
        </div>
        <div class="gridwrap">
          <table>
            <thead><tr><th class="corner"></th>@for (c of cols; track c) { <th [class.hl]="sel().startsWith(c)">{{ c }}</th> }</tr></thead>
            <tbody>
              @for (r of rows; track r) {
                <tr><th [class.hl]="sel().endsWith('' + r)">{{ r }}</th>
                  @for (c of cols; track c) {
                    <td [class.sel]="sel() === c + r" [class.b]="style(c + r).bold" [class.i]="style(c + r).italic" [class.fill]="style(c + r).fill"
                        [class.num]="isNum(c + r)" [class.err]="isErr(c + r)" (mousedown)="select(c + r, $event)" (dblclick)="beginEdit(true)">
                      @if (sel() === c + r) {
                        <input class="cellin" [class.ghost]="editing() !== c + r" type="text" autocomplete="off" (input)="onCellInput($any($event.target).value)" (keydown)="cellKey($event)" (blur)="commit()" aria-label="Selected cell">
                      }
                      @if (editing() !== c + r) { <span>{{ display(c + r) }}</span> }
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="sheettabs"><span class="on">Sheet1</span><span>+</span></div>
        <div class="hint">Click a cell and type. Enter moves down, Tab moves right, Delete clears. Formulas start with =</div>
      </div>

      <aside class="card tasks">
        <h3>Tasks</h3>
        <ul class="checks">
          @for (t of tasks(); track $index; let i = $index) {
            <li [class.ok]="results()[i]"><span class="mark">@if (results()[i]) { <app-icon name="check" [size]="14" /> } @else { {{ i + 1 }} }</span><span>{{ t.instruction }}</span></li>
          }
        </ul>
        @if (allDone()) { <div class="notice success"><app-icon name="party-popper" [size]="18" /> All tasks done!</div> }
        <button class="small" (click)="reset()">Reset sheet</button>
      </aside>
    </div>
  `,
  styles: `
    .xl { background: #107c41; color: #fff; }
    .xl .dots span { color: #dfe; }
    .toolbar button.on { background: #cfe8d8; border-color: #107c41; }
    .sep { width: 1px; height: 24px; background: #ccc; margin: 0 4px; }
    .namebox { font-family: var(--mono); background: #fff; border: 1px solid #ccc; padding: 4px 10px; border-radius: 4px; min-width: 50px; text-align: center; }
    .fx { color: #666; font-style: italic; }
    .fbar { flex: 1; min-width: 160px; font-family: var(--mono); border-radius: 4px !important; }
    .gridwrap { overflow: auto; outline: none; background: #fff; }
    table { border-collapse: collapse; table-layout: fixed; min-width: 100%; }
    th { background: #f3f3f3; color: #444; font-weight: 600; font-size: .8rem; border: 1px solid #d4d4d4; height: 26px; width: 92px; }
    th.corner { width: 34px; }
    th.hl { background: #cfe8d8; color: #107c41; }
    td { border: 1px solid #e1e1e1; height: 28px; padding: 0 6px; font-size: .92rem; color: #000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: cell; }
    td.sel { outline: 2px solid #107c41; outline-offset: -2px; }
    td.b { font-weight: 800; } td.i { font-style: italic; } td.fill { background: #fff2a8; } td.num { text-align: right; } td.err { color: #c00; font-weight: 700; }
    td { position: relative; }
    .cellin { width: 100%; height: 100%; border: none; outline: none; font: inherit; padding: 0; background: #fff; }
    .cellin.ghost { position: absolute; left: 0; top: 0; width: 1px; height: 1px; opacity: 0; }
    .sheettabs { display: flex; gap: 2px; background: #f3f3f3; padding: 4px 8px 0; border-top: 1px solid #ddd; font-size: .85rem; }
    .sheettabs span { padding: 3px 14px; border: 1px solid #ddd; border-bottom: none; background: #e9e9e9; }
    .sheettabs .on { background: #fff; color: #107c41; font-weight: 700; }
  `,
})
export class SheetEditor {
  cells = input<Record<string, string | number>>({});
  tasks = input.required<SheetTask[]>();
  completed = output<void>();

  cols = COLS; rows = ROWS;
  raw = signal<Record<string, string>>({});
  styles = signal<Record<string, CellStyle>>({});
  sel = signal('A1');
  editing = signal<string | null>(null);
  editText = '';
  results = signal<boolean[]>([]);
  allDone = signal(false);
  private emitted = false;
  private ev = computed(() => new Evaluator(this.raw()));

  constructor() { effect(() => { this.cells(); this.tasks(); queueMicrotask(() => this.reset()); }); }

  reset() {
    const r: Record<string, string> = {};
    for (const [k, v] of Object.entries(this.cells())) r[k.toUpperCase()] = String(v);
    this.raw.set(r); this.styles.set({}); this.sel.set('A1'); this.editing.set(null); this.emitted = false; this.check();
  }
  rawOf(c: string) { return this.raw()[c] ?? ''; }
  style(c: string) { return this.styles()[c] ?? {}; }
  value(c: string) { return this.ev().value(c); }
  display(c: string) { const v = this.value(c); return typeof v === 'number' ? (Math.round(v * 1e9) / 1e9).toString() : v; }
  isNum(c: string) { return typeof this.value(c) === 'number'; }
  isErr(c: string) { const v = this.value(c); return typeof v === 'string' && v.startsWith('#'); }

  select(c: string, e: MouseEvent) {
    if (this.editing() === c) return;
    e.preventDefault();
    if (this.editing()) this.commit();
    this.sel.set(c);
    this.editText = '';
    this.focusCell();
  }
  private cellInput() { return document.querySelector('.cellin') as HTMLInputElement | null; }
  /** The cell input is controlled imperatively: its value is always set from code before it gets focus. */
  /** Change detection is coalesced into an animation frame, so the new cell's input may not exist yet: retry briefly. */
  private whenRendered(fn: (i: HTMLInputElement) => void, tries = 12) {
    const i = this.cellInput();
    if (i && i.closest('td.sel')) fn(i);
    else if (tries > 0) setTimeout(() => this.whenRendered(fn, tries - 1), 16);
  }
  private focusCell() { this.whenRendered(i => { i.value = this.editing() === this.sel() ? this.editText : ''; i.focus(); }); }
  beginEdit(keepText: boolean) {
    if (this.editing() === this.sel()) return;
    this.editText = keepText ? this.rawOf(this.sel()) : '';
    this.editing.set(this.sel());
    this.whenRendered(i => { i.value = this.editText; i.focus(); i.setSelectionRange(i.value.length, i.value.length); });
  }
  fromBar(v: string) { if (this.editing() !== this.sel()) this.editing.set(this.sel()); this.editText = v; const i = this.cellInput(); if (i) i.value = v; }
  commit() {
    const c = this.editing(); if (!c) return;
    this.raw.update(r => { const n = { ...r }; if (this.editText.trim() === '') delete n[c]; else n[c] = this.editText; return n; });
    this.editing.set(null); this.editText = ''; this.check();
  }
  move(dr: number, dc: number) {
    const m = /^([A-Z]+)(\d+)$/.exec(this.sel())!;
    const c = Math.max(0, Math.min(COLS.length - 1, COLS.indexOf(m[1]) + dc));
    const r = Math.max(1, Math.min(ROWS.length, +m[2] + dr));
    this.sel.set(`${COLS[c]}${r}`);
    this.editText = '';
    this.focusCell();
  }
  /** Any typed text (even without a keydown, e.g. dictation or automation) starts editing the selected cell. */
  onCellInput(v: string) { this.editText = v; if (v !== '' && this.editing() !== this.sel()) this.editing.set(this.sel()); }
  /** Keys arrive on the always-focused input inside the selected cell. */
  cellKey(e: KeyboardEvent) {
    const editing = this.editing() === this.sel();
    if (e.key === 'Enter') { e.preventDefault(); this.commit(); this.move(1, 0); }
    else if (e.key === 'Tab') { e.preventDefault(); this.commit(); this.move(0, e.shiftKey ? -1 : 1); }
    else if (e.key === 'Escape') { this.editing.set(null); this.editText = ''; this.focusCell(); }
    else if (e.key === 'Enter' || e.key === 'Tab') { /* handled above */ }
    else if (editing) return; // ordinary typing inside the cell
    else if (e.key === 'ArrowDown') { e.preventDefault(); this.move(1, 0); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.move(-1, 0); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); this.move(0, 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); this.move(0, -1); }
    else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); this.clearCell(); }
    else if (e.key === 'F2') { e.preventDefault(); this.beginEdit(true); }
    else if (e.ctrlKey && e.key.toLowerCase() === 'b') { e.preventDefault(); this.toggle('bold'); }
    else if (e.ctrlKey && e.key.toLowerCase() === 'i') { e.preventDefault(); this.toggle('italic'); }
  }
  clearCell() { this.raw.update(r => { const n = { ...r }; delete n[this.sel()]; return n; }); this.check(); }
  toggle(prop: keyof CellStyle) { const c = this.sel(); this.styles.update(s => ({ ...s, [c]: { ...s[c], [prop]: !s[c]?.[prop] } })); this.check(); }
  autosum() {
    const m = /^([A-Z]+)(\d+)$/.exec(this.sel())!;
    let r = +m[2] - 1;
    while (r >= 1 && typeof this.value(`${m[1]}${r}`) === 'number') r--;
    const top = r + 1, bottom = +m[2] - 1;
    if (bottom < top) return;
    this.raw.update(x => ({ ...x, [this.sel()]: `=SUM(${m[1]}${top}:${m[1]}${bottom})` })); this.check();
  }

  check() {
    const res = this.tasks().map(t => {
      const c = t.check; const cell = String(c.cell ?? '').toUpperCase();
      switch (c.type) {
        case 'cellEquals': { const v = this.value(cell); return typeof c.value === 'number' ? typeof v === 'number' && Math.abs(v - c.value) < 1e-6 : String(v).trim().toLowerCase() === String(c.value).trim().toLowerCase(); }
        case 'cellFormula': { const r = this.rawOf(cell).toUpperCase(); return r.startsWith('=') && r.includes(String(c.includes).toUpperCase()); }
        case 'cellBold': return !!this.style(cell).bold;
        case 'cellItalic': return !!this.style(cell).italic;
        case 'cellFill': return !!this.style(cell).fill;
        case 'cellFilled': return this.rawOf(cell).trim() !== '';
        case 'cellNumber': return typeof this.value(cell) === 'number';
        case 'rangeFilled': { const [a, b] = String(c.range).split(':'); return this.ev().cells(a, b).every(x => this.rawOf(x).trim() !== ''); }
        default: return false;
      }
    });
    this.results.update(prev => res.map((r, i) => r || (prev[i] === true && this.tasks()[i].check.type === 'cellEquals' && this.tasks()[i].check.cell === 'B6')));
    const all = res.length > 0 && this.results().every(Boolean);
    this.allDone.set(all);
    if (all && !this.emitted) { this.emitted = true; this.completed.emit(); }
  }
}
