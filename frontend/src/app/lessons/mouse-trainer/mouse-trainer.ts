import { Component, ElementRef, computed, effect, input, output, signal, viewChild } from '@angular/core';
import { Icon } from '../../core/icon';

export interface MouseTask {
  type: 'hover' | 'click' | 'doubleClick' | 'rightClick' | 'drag' | 'scroll' | 'selectText' | 'menu' | 'window';
  count?: number; menuItem?: string; text?: string; menu?: string; item?: string;
}

interface Target { id: number; x: number; y: number; kind: string; label?: string; }
interface Shape { id: number; name: string; glyph: string; color: string; x: number; y: number; done: boolean; }

const SHAPES = [
  { name: 'circle', glyph: 'circle', color: '#2563eb' }, { name: 'square', glyph: 'square', color: '#dc2626' }, { name: 'star', glyph: 'star', color: '#f59e0b' },
  { name: 'heart', glyph: 'heart', color: '#16a34a' }, { name: 'triangle', glyph: 'triangle', color: '#ea580c' }, { name: 'moon', glyph: 'moon', color: '#7c3aed' },
];
const MENUS: Record<string, string[]> = {
  File: ['New', 'Open', 'Save', 'Print'],
  Edit: ['Undo', 'Cut', 'Copy', 'Paste'],
  View: ['Zoom in', 'Zoom out', 'Full screen'],
};
const CTX_ITEMS = ['Open', 'Copy', 'Rename', 'Delete'];

@Component({
  selector: 'app-mouse-trainer',
  imports: [Icon],
  template: `
    <div class="trainer card">
      <div class="top">
        <div class="instr">
          <span class="num">{{ taskIndex() + 1 }} / {{ tasks().length }}</span>
          <strong>{{ instruction() }}</strong>
        </div>
        <span class="badge">{{ hits() }} / {{ goal() }}</span>
      </div>

      <div #arena class="arena" [class.menu-mode]="task()?.type === 'menu'" (contextmenu)="$event.preventDefault()"
           (pointermove)="onMove($event)" (pointerup)="onUp($event)" (click)="arenaClick()">

        @switch (task()?.type) {
          @case ('hover') {
            @if (target(); as t) {
              <div class="tgt circle" [style.left.%]="t.x" [style.top.%]="t.y" (mouseenter)="hoverStart()" (mouseleave)="hoverEnd()" [class.warm]="hovering()">
                <span>{{ hovering() ? '…' : '' }}</span>
              </div>
            }
          }
          @case ('click') {
            @if (target(); as t) {
              <div class="tgt circle" [style.left.%]="t.x" [style.top.%]="t.y" (click)="hit()"></div>
            }
          }
          @case ('doubleClick') {
            @if (target(); as t) {
              <div class="tgt icon" [class.sel]="selected()" [style.left.%]="t.x" [style.top.%]="t.y"
                   (click)="selected.set(true)" (dblclick)="hit()">
                <span class="glyph folder"><app-icon name="folder" [size]="40" [fill]="true" /></span><span class="lbl">Folder {{ hits() + 1 }}</span>
              </div>
            }
          }
          @case ('rightClick') {
            @if (target(); as t) {
              <div class="tgt icon" [class.sel]="selected()" [style.left.%]="t.x" [style.top.%]="t.y"
                   (click)="selected.set(true)" (contextmenu)="openCtx($event)">
                <span class="glyph file"><app-icon name="file-text" [size]="40" /></span><span class="lbl">File {{ hits() + 1 }}</span>
              </div>
            }
            @if (ctx(); as c) {
              <div class="ctx" [style.left.px]="c.x" [style.top.px]="c.y">
                @for (it of ctxItems; track it) { <button (click)="pickCtx(it, $event)">{{ it }}</button> }
              </div>
            }
          }
          @case ('drag') {
            @for (s of shapes(); track s.id) {
              @if (!s.done) {
                <div class="shape" [class.lift]="dragging()?.id === s.id" [style.left.px]="s.x" [style.top.px]="s.y"
                     (pointerdown)="dragStart($event, s)"><app-icon [name]="s.glyph" [size]="40" [fill]="true" [style.color]="s.color" /></div>
              }
            }
            @for (s of shapes(); track s.id; let i = $index) {
              <div class="box" [class.full]="s.done" [style.left.%]="58" [style.top.px]="18 + i * 72" [attr.data-shape]="s.name">
                @if (s.done) { <app-icon [name]="s.glyph" [size]="24" [fill]="true" [style.color]="s.color" /> } <small>{{ s.name }}</small>
              </div>
            }
          }
          @case ('scroll') {
            <div class="scrollbox" (scroll)="onScroll($event)">
              @for (l of scrollLines; track $index) { <p>{{ l }}</p> }
              <button class="primary" (click)="hit()"><app-icon name="target" [size]="18" /> Click me!</button>
              <p>&nbsp;</p>
            </div>
          }
          @case ('selectText') {
            <div class="textbox" (mouseup)="checkSelection()" (keyup)="checkSelection()">
              <p>Here is a sentence. Somewhere in it you will find the words <em>{{ task()?.text }}</em>. Select only those words.</p>
              <p class="big">The children said that the <b class="plain">{{ task()?.text }}</b> was the best thing they had ever seen.</p>
              <p class="muted small">Selected: <code>{{ selectionText() || '(nothing yet)' }}</code></p>
            </div>
          }
          @case ('menu') {
            <div class="fakeapp">
              <div class="menubar">
                @for (m of menuNames; track m) {
                  <span class="mname" [class.open]="openMenu() === m" (click)="toggleMenu(m, $event)">{{ m }}</span>
                }
              </div>
              @if (openMenu(); as m) {
                <div class="dropdown" [style.left.px]="menuLeft()">
                  @for (it of menus[m]; track it) { <button (click)="pickMenu(it, $event)">{{ it }}</button> }
                </div>
              }
              <div class="fakebody"><p>Open the <b>{{ task()?.menu }}</b> menu and choose <b>{{ task()?.item }}</b>.</p></div>
            </div>
          }
          @case ('window') {
            <div class="dropzone" [class.lit]="winStep() === 2">Drag the window here</div>
            <div class="fakewin" [class.max]="winMax()" [style.left.px]="win().x" [style.top.px]="win().y">
              <div class="wtitle" (pointerdown)="winDragStart($event)">
                <span><app-icon name="file-text" [size]="14" /> Notepad</span>
                <span class="wbtns">
                  <button (click)="winMin($event)" title="Minimise"><app-icon name="minus" [size]="12" /></button>
                  <button (click)="winToggleMax($event)" title="Maximise / Restore"><app-icon name="square" [size]="11" /></button>
                  <button class="x" (click)="winClose($event)" title="Close"><app-icon name="x" [size]="13" /></button>
                </span>
              </div>
              <div class="wbody">{{ winHint() }}</div>
            </div>
          }
        }

        @if (flash()) { <div class="flash"><app-icon name="check" [size]="40" [stroke]="3" /></div> }
      </div>

      @if (note()) { <div class="notice warn">{{ note() }}</div> }
      @if (finished()) { <div class="notice success"><app-icon name="party-popper" [size]="18" /> All done! Great mouse work.</div> }
      <div class="row"><button class="small" (click)="restart()">Start again</button></div>
    </div>
  `,
  styles: `
    .top { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
    .instr { display: flex; align-items: center; gap: 10px; font-size: 1.05rem; }
    .num { background: var(--accent-soft); color: var(--accent); font-weight: 900; padding: 2px 10px; border-radius: 999px; font-size: .85rem; }
    .arena { position: relative; height: 380px; border: 2px dashed var(--border); border-radius: 16px; background: var(--surface-2); overflow: hidden; user-select: none; touch-action: none; }
    .tgt { position: absolute; transform: translate(-50%, -50%); cursor: pointer; }
    .circle { width: 64px; height: 64px; border-radius: 50%; background: var(--accent); box-shadow: 0 8px 20px -6px var(--accent); display: grid; place-items: center; color: #fff; font-weight: 900; transition: transform .15s; }
    .circle:hover { transform: translate(-50%, -50%) scale(1.08); }
    .circle.warm { background: var(--success); }
    .icon { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 10px; border-radius: 10px; }
    .icon.sel { background: rgba(37, 99, 235, .15); outline: 1px solid rgba(37, 99, 235, .4); }
    .glyph { line-height: 1; display: grid; place-items: center; } .glyph.folder { color: #f59e0b; } .glyph.file { color: #64748b; }
    .lbl { font-size: .8rem; font-weight: 700; }
    .ctx { position: absolute; z-index: 5; background: #fff; border: 1px solid #ccc; box-shadow: 0 8px 24px rgba(0,0,0,.18); border-radius: 8px; padding: 4px; min-width: 150px; }
    .ctx button { display: block; width: 100%; text-align: left; border: none; border-radius: 6px; background: none; padding: 7px 12px; font-weight: 600; }
    .ctx button:hover { background: #eef1f6; }
    .shape { position: absolute; font-size: 2.6rem; line-height: 1; cursor: grab; padding: 6px; border-radius: 12px; }
    .shape.lift { cursor: grabbing; transform: scale(1.15); filter: drop-shadow(0 10px 10px rgba(0,0,0,.25)); z-index: 4; }
    .box { position: absolute; width: 150px; height: 60px; border: 2px dashed var(--accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 1.6rem; background: #fff; }
    .box small { font-size: .8rem; font-weight: 800; color: var(--accent); text-transform: uppercase; }
    .box.full { border-style: solid; background: var(--success-soft); }
    .scrollbox { position: absolute; inset: 16px; overflow: auto; background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; user-select: text; }
    .scrollbox p { margin: 0 0 14px; }
    .textbox { position: absolute; inset: 16px; background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 18px 22px; user-select: text; cursor: text; }
    .textbox .big { font-size: 1.5rem; line-height: 1.6; }
    .plain { font-weight: inherit; }
    .textbox em { font-style: normal; font-weight: 800; color: var(--accent); }
    .small { font-size: .85rem; }
    .fakeapp { position: absolute; inset: 16px; background: #fff; border: 1px solid #bbb; border-radius: 8px; overflow: visible; }
    .menubar { display: flex; gap: 4px; background: #f3f3f3; border-bottom: 1px solid #ddd; padding: 4px 6px; position: relative; }
    .mname { padding: 4px 12px; border-radius: 4px; cursor: default; }
    .mname:hover, .mname.open { background: #dde3ec; }
    .dropdown { position: absolute; top: 34px; z-index: 5; background: #fff; border: 1px solid #ccc; box-shadow: 0 8px 24px rgba(0,0,0,.18); border-radius: 6px; padding: 4px; min-width: 160px; }
    .dropdown button { display: block; width: 100%; text-align: left; border: none; border-radius: 4px; background: none; padding: 7px 12px; font-weight: 600; }
    .dropdown button:hover { background: #eef1f6; }
    .fakebody { padding: 24px; color: #444; }
    .dropzone { position: absolute; right: 16px; top: 16px; bottom: 16px; width: 42%; border: 3px dashed var(--border); border-radius: 14px; display: grid; place-items: center; color: var(--muted); font-weight: 800; }
    .dropzone.lit { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
    .fakewin { position: absolute; width: 300px; height: 200px; background: #fff; border: 1px solid #999; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,.25); overflow: hidden; }
    .fakewin.max { left: 0 !important; top: 0 !important; width: 100%; height: 100%; border-radius: 0; }
    .wtitle { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: #e9eef5; cursor: move; font-weight: 700; font-size: .9rem; }
    .wbtns button { border: none; background: none; padding: 2px 10px; font-weight: 800; border-radius: 4px; }
    .wbtns button:hover { background: #d5dbe5; }
    .wbtns .x:hover { background: #e81123; color: #fff; }
    .wbody { padding: 14px; color: #444; }
    .flash { position: absolute; inset: 0; display: grid; place-items: center; font-size: 5rem; color: var(--success); background: rgba(255,255,255,.6); animation: pop .5s both; pointer-events: none; }
    @keyframes pop { from { opacity: 0; transform: scale(.6); } 50% { opacity: 1; transform: scale(1.1); } to { opacity: 0; transform: scale(1); } }
    .row { margin-top: 12px; }
  `,
})
export class MouseTrainer {
  tasks = input.required<MouseTask[]>();
  completed = output<void>();
  arena = viewChild.required<ElementRef<HTMLDivElement>>('arena');

  taskIndex = signal(0);
  hits = signal(0);
  finished = signal(false);
  flash = signal(false);
  note = signal('');
  task = computed(() => this.tasks()[this.taskIndex()] ?? null);
  goal = computed(() => {
    const t = this.task();
    if (!t) return 0;
    if (t.type === 'drag') return 4;
    if (t.type === 'window') return 4;
    return t.count ?? 1;
  });
  instruction = computed(() => {
    const t = this.task();
    if (!t) return 'Done!';
    switch (t.type) {
      case 'hover': return 'Move the pointer onto the circle and hold it there.';
      case 'click': return 'Click the circle.';
      case 'doubleClick': return 'Double-click the folder to open it.';
      case 'rightClick': return `Right-click the file, then choose "${t.menuItem ?? 'Open'}" from the menu.`;
      case 'drag': return 'Drag each shape into the box with its name.';
      case 'scroll': return 'Scroll down inside the box and click the button at the bottom.';
      case 'selectText': return `Select the words "${t.text}" by dragging across them.`;
      case 'menu': return `Open the ${t.menu} menu and choose ${t.item}.`;
      case 'window': return this.winHint();
    }
  });

  // hover/click targets
  target = signal<Target | null>(null);
  selected = signal(false);
  hovering = signal(false);
  private hoverTimer: any;
  ctx = signal<{ x: number; y: number } | null>(null);
  ctxItems = CTX_ITEMS;

  // drag
  shapes = signal<Shape[]>([]);
  dragging = signal<Shape | null>(null);
  private dragOffset = { x: 0, y: 0 };

  // scroll
  scrollLines = Array.from({ length: 28 }, (_, i) => i % 7 === 6 ? 'Keep going, the button is further down…' : `Line ${i + 1}. Roll the wheel towards you to move down the page.`);

  // select
  selectionText = signal('');

  // menu
  menuNames = Object.keys(MENUS);
  menus = MENUS;
  openMenu = signal<string | null>(null);
  menuLeft = signal(6);

  // window
  win = signal({ x: 20, y: 30 });
  winMax = signal(false);
  winStep = signal(0);
  private winDrag: { dx: number; dy: number } | null = null;

  constructor() {
    effect(() => { this.tasks(); queueMicrotask(() => this.restart()); });
  }

  restart() {
    this.taskIndex.set(0); this.hits.set(0); this.finished.set(false); this.note.set('');
    this.setupTask();
  }

  private setupTask() {
    this.selected.set(false); this.ctx.set(null); this.hovering.set(false); this.openMenu.set(null);
    this.selectionText.set(''); this.dragging.set(null);
    const t = this.task();
    if (!t) return;
    if (['hover', 'click', 'doubleClick', 'rightClick'].includes(t.type)) this.newTarget();
    if (t.type === 'drag') {
      const picks = [...SHAPES].sort(() => Math.random() - .5).slice(0, 4);
      this.shapes.set(picks.map((s, i) => ({ id: i, ...s, x: 24 + (i % 2) * 110, y: 24 + Math.floor(i / 2) * 150 + (i % 2) * 40, done: false })));
    }
    if (t.type === 'window') { this.win.set({ x: 20, y: 30 }); this.winMax.set(false); this.winStep.set(0); }
  }

  private newTarget() {
    this.selected.set(false);
    this.target.set({ id: Math.random(), x: 12 + Math.random() * 76, y: 15 + Math.random() * 70, kind: this.task()!.type });
  }

  hit() {
    this.note.set('');
    this.hits.update(h => h + 1);
    this.flash.set(true); setTimeout(() => this.flash.set(false), 500);
    if (this.hits() >= this.goal()) {
      setTimeout(() => this.nextTask(), 450);
    } else if (['hover', 'click', 'doubleClick', 'rightClick'].includes(this.task()!.type)) {
      this.newTarget();
    }
  }

  private nextTask() {
    if (this.taskIndex() + 1 >= this.tasks().length) { this.finished.set(true); this.completed.emit(); return; }
    this.taskIndex.update(i => i + 1); this.hits.set(0); this.setupTask();
  }

  // ----- hover -----
  hoverStart() { this.hovering.set(true); this.hoverTimer = setTimeout(() => { this.hovering.set(false); this.hit(); }, 500); }
  hoverEnd() { this.hovering.set(false); clearTimeout(this.hoverTimer); }

  // ----- right-click -----
  openCtx(e: MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    const r = this.arena().nativeElement.getBoundingClientRect();
    this.selected.set(true);
    this.ctx.set({ x: Math.min(e.clientX - r.left, r.width - 160), y: Math.min(e.clientY - r.top, r.height - 150) });
  }
  pickCtx(item: string, e: Event) {
    e.stopPropagation();
    this.ctx.set(null);
    const want = this.task()?.menuItem ?? 'Open';
    if (item === want) this.hit();
    else this.note.set(`You chose "${item}". The task asks for "${want}". Right-click the file and try again.`);
  }
  arenaClick() { this.ctx.set(null); if (this.task()?.type === 'menu') this.openMenu.set(null); }

  // ----- drag -----
  dragStart(e: PointerEvent, s: Shape) {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    this.dragging.set(s);
    this.dragOffset = { x: e.clientX - s.x, y: e.clientY - s.y };
  }
  onMove(e: PointerEvent) {
    const d = this.dragging();
    if (d) {
      const x = e.clientX - this.dragOffset.x, y = e.clientY - this.dragOffset.y;
      this.shapes.update(all => all.map(s => s.id === d.id ? { ...s, x, y } : s));
    }
    if (this.winDrag && !this.winMax()) {
      const r = this.arena().nativeElement.getBoundingClientRect();
      this.win.set({ x: Math.max(0, Math.min(e.clientX - r.left - this.winDrag.dx, r.width - 300)), y: Math.max(0, Math.min(e.clientY - r.top - this.winDrag.dy, r.height - 200)) });
    }
  }
  onUp(e: PointerEvent) {
    const d = this.dragging();
    if (d) {
      this.dragging.set(null);
      const boxes = this.arena().nativeElement.querySelectorAll<HTMLElement>('.box');
      let dropped = false;
      boxes.forEach(b => {
        const r = b.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          dropped = true;
          if (b.dataset['shape'] === d.name) {
            this.shapes.update(all => all.map(s => s.id === d.id ? { ...s, done: true } : s));
            this.hit();
          } else {
            this.note.set(`That box is for the ${b.dataset['shape']}. Try the box labelled "${d.name}".`);
          }
        }
      });
      if (!dropped) this.note.set('Keep the button held down until the shape is over its box, then let go.');
    }
    if (this.winDrag) {
      this.winDrag = null;
      if (this.winStep() === 2) {
        const r = this.arena().nativeElement.getBoundingClientRect();
        if (this.win().x + 150 > r.width * 0.58) { this.winStep.set(3); this.hit(); }
      }
    }
  }

  // ----- scroll -----
  onScroll(e: Event) { const el = e.target as HTMLElement; if (el.scrollTop > 40) this.note.set(''); }

  // ----- select text -----
  checkSelection() {
    const sel = (window.getSelection()?.toString() ?? '').replace(/\s+/g, ' ').trim();
    this.selectionText.set(sel);
    const want = (this.task()?.text ?? '').trim().toLowerCase();
    if (sel && sel.toLowerCase() === want) { window.getSelection()?.removeAllRanges(); this.hit(); }
    else if (sel && want.includes(sel.toLowerCase()) && sel.length < want.length) this.note.set('Nearly! You selected part of it. Drag from the start of the first word to the end of the last.');
    else if (sel && sel.length > want.length + 2) this.note.set('You selected too much. Select only those words.');
  }

  // ----- menus -----
  toggleMenu(m: string, e: MouseEvent) {
    e.stopPropagation();
    const el = e.target as HTMLElement;
    this.menuLeft.set(el.offsetLeft);
    this.openMenu.set(this.openMenu() === m ? null : m);
  }
  pickMenu(item: string, e: Event) {
    e.stopPropagation();
    const t = this.task()!;
    this.openMenu.set(null);
    if (item === t.item) this.hit();
    else this.note.set(`You chose ${item}. Open the ${t.menu} menu and choose ${t.item}.`);
  }

  // ----- window -----
  winHint = computed(() => ['Click the square (Maximise) button to maximise the window.', 'Click the square button again to restore its size.', 'Drag the title bar to move the window into the dashed area.', 'Click the X to close the window.', 'Done!'][this.winStep()]);
  winToggleMax(e: Event) {
    e.stopPropagation();
    this.winMax.update(m => !m);
    if (this.winStep() === 0 && this.winMax()) { this.winStep.set(1); this.hit(); }
    else if (this.winStep() === 1 && !this.winMax()) { this.winStep.set(2); this.hit(); }
  }
  winMin(e: Event) { e.stopPropagation(); this.note.set('That is Minimise. It would hide the window on the taskbar. Try the middle (square) button.'); }
  winClose(e: Event) {
    e.stopPropagation();
    if (this.winStep() === 3) { this.winStep.set(4); this.hit(); }
    else this.note.set('Not yet! Follow the steps in order first.');
  }
  winDragStart(e: PointerEvent) {
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;
    e.preventDefault();
    const r = this.arena().nativeElement.getBoundingClientRect();
    this.winDrag = { dx: e.clientX - r.left - this.win().x, dy: e.clientY - r.top - this.win().y };
  }
}
