import { Component, HostListener, computed, effect, input, output, signal } from '@angular/core';
import { Icon } from '../../core/icon';
import { FormsModule } from '@angular/forms';

export interface FileTask { instruction: string; check: any; }
interface Node { name: string; kind: 'folder' | 'file'; children: Node[]; }
interface BinItem { node: Node; from: string; }

const ROOTS = ['Desktop', 'Documents', 'Downloads', 'Pictures', 'Music', 'Videos'];
const ROOT_ICON: Record<string, string> = { Desktop: 'monitor', Documents: 'file-text', Downloads: 'download', Pictures: 'image', Music: 'music', Videos: 'film' };

function toNodes(obj: Record<string, any>): Node[] {
  return Object.entries(obj).map(([name, v]) =>
    typeof v === 'object' && v !== null ? { name, kind: 'folder', children: toNodes(v) } : { name, kind: 'file', children: [] });
}
function clone(n: Node): Node { return { name: n.name, kind: n.kind, children: n.children.map(clone) }; }

@Component({
  selector: 'app-file-explorer',
  imports: [FormsModule, Icon],
  template: `
    <div class="sim">
      <div class="card window" (click)="ctx.set(null)">
        <div class="titlebar"><app-icon name="folder" [size]="16" /> File Explorer <span class="dots"><span><app-icon name="minus" [size]="12" /></span><span><app-icon name="square" [size]="11" /></span><span><app-icon name="x" [size]="13" /></span></span></div>
        <div class="toolbar">
          <button (click)="back()" [disabled]="hist().length < 2" title="Back">←</button>
          <button (click)="up()" [disabled]="path() === ''" title="Up">↑</button>
          <div class="address">
            <span class="crumb" (click)="go('')"><app-icon name="monitor" [size]="14" /> This PC</span>
            @for (c of crumbs(); track $index) {
              <span class="sep">›</span><span class="crumb" (click)="go(c.path)">{{ c.name }}</span>
            }
          </div>
          <input type="text" [(ngModel)]="searchText" (keydown.enter)="doSearch()" placeholder="Search" class="search" aria-label="Search files">
        </div>
        <div class="toolbar cmds">
          @if (inBin()) {
            <button (click)="restore()" [disabled]="!selectedBin()"><app-icon name="rotate-ccw" [size]="14" /> Restore</button>
            <button (click)="emptyBin()" [disabled]="!bin().length"><app-icon name="trash-2" [size]="14" /> Empty Recycle Bin</button>
          } @else {
            <button (click)="newFolder()" [disabled]="path() === '' || searching()"><app-icon name="plus" [size]="14" /> New folder</button>
            <button (click)="cut()" [disabled]="!selected()"><app-icon name="scissors" [size]="14" /> Cut</button>
            <button (click)="copy()" [disabled]="!selected()"><app-icon name="copy" [size]="14" /> Copy</button>
            <button (click)="paste()" [disabled]="!clipboard() || path() === '' || searching()"><app-icon name="clipboard-paste" [size]="14" /> Paste</button>
            <button (click)="startRename()" [disabled]="!selected()"><app-icon name="pencil" [size]="14" /> Rename</button>
            <button (click)="del()" [disabled]="!selected()"><app-icon name="trash-2" [size]="14" /> Delete</button>
          }
        </div>
        <div class="body">
          <nav class="pane">
            @for (r of roots; track r) {
              <a [class.on]="path() === r && !inBin()" (click)="go(r)" (dragover)="dragOver($event)" (drop)="dropOn($event, r)"><app-icon [name]="rootIcon[r]" [size]="16" /> {{ r }}</a>
            }
            <a [class.on]="inBin()" (click)="goBin()" (dragover)="dragOver($event)" (drop)="dropOnBin($event)"><app-icon name="trash-2" [size]="16" /> Recycle Bin @if (bin().length) { <small>({{ bin().length }})</small> }</a>
          </nav>
          <div class="main" tabindex="0" (keydown)="onKey($event)" (click)="selected.set(null); selectedBin.set(null)" (contextmenu)="bgCtx($event)"
               (dragover)="dragOver($event)" (drop)="dropOn($event, path())">
            @if (inBin()) {
              @if (!bin().length) { <p class="empty">The Recycle Bin is empty.</p> }
              @for (b of bin(); track $index; let i = $index) {
                <div class="item" [class.sel]="selectedBin() === i" (click)="selectedBin.set(i); $event.stopPropagation()" (dblclick)="restore()">
                  <span class="ico"><app-icon [name]="icon(b.node)" [size]="18" /></span><span class="name">{{ b.node.name }}</span><small>from {{ b.from }}</small>
                </div>
              }
            } @else if (searching()) {
              <p class="empty">Results for "{{ searchText }}" @if (!results().length) { : nothing found. Try a shorter word. }</p>
              @for (r of results(); track r.path) {
                <div class="item" [class.sel]="selected() === r.node" (click)="select(r.node, $event)" (dblclick)="openResult(r)">
                  <span class="ico"><app-icon [name]="icon(r.node)" [size]="18" /></span><span class="name">{{ r.node.name }}</span><small>in {{ r.folder || 'This PC' }}</small>
                </div>
              }
            } @else if (path() === '') {
              @for (r of roots; track r) {
                <div class="item" (dblclick)="go(r)"><span class="ico"><app-icon [name]="rootIcon[r]" [size]="16" /></span><span class="name">{{ r }}</span></div>
              }
            } @else {
              @if (!current().children.length) { <p class="empty">This folder is empty.</p> }
              @for (n of current().children; track n) {
                <div class="item" [class.sel]="selected() === n" [class.cutting]="clipboard()?.mode === 'cut' && clipboard()?.node === n"
                     draggable="true" (dragstart)="dragStart($event, n)"
                     (dragover)="n.kind === 'folder' ? dragOver($event) : null" (drop)="n.kind === 'folder' ? dropOn($event, join(path(), n.name)) : null"
                     (click)="select(n, $event)" (dblclick)="open(n)" (contextmenu)="itemCtx($event, n)">
                  <span class="ico"><app-icon [name]="icon(n)" [size]="30" /></span>
                  @if (renaming() === n) {
                    <input class="rename" type="text" [(ngModel)]="renameText" (keydown.enter)="commitRename(); $event.stopPropagation()" (keydown.escape)="renaming.set(null); $event.stopPropagation()" (keydown)="$event.stopPropagation()" (blur)="commitRename()" (click)="$event.stopPropagation()" autofocus>
                  } @else {
                    <span class="name">{{ n.name }}</span>
                  }
                </div>
              }
            }
          </div>
        </div>
        <div class="statusbar">{{ inBin() ? bin().length : searching() ? results().length : path() === '' ? roots.length : current().children.length }} items @if (selected()) { · 1 selected }</div>

        @if (ctx(); as c) {
          <div class="ctx" [style.left.px]="c.x" [style.top.px]="c.y" (click)="$event.stopPropagation()">
            @if (c.node) {
              <button (click)="open(c.node); ctx.set(null)">Open</button><hr>
              <button (click)="cut(); ctx.set(null)">Cut</button>
              <button (click)="copy(); ctx.set(null)">Copy</button><hr>
              <button (click)="startRename(); ctx.set(null)">Rename</button>
              <button (click)="del(); ctx.set(null)">Delete</button>
            } @else {
              <button (click)="newFolder(); ctx.set(null)">New › Folder</button>
              <button (click)="paste(); ctx.set(null)" [disabled]="!clipboard()">Paste</button>
            }
          </div>
        }

        @if (viewer(); as v) {
          <div class="viewer">
            <div class="vwin">
              <div class="titlebar">{{ v.app }} - {{ v.name }} <span class="dots"><span><app-icon name="minus" [size]="12" /></span><span><app-icon name="square" [size]="11" /></span><button class="x" (click)="viewer.set(null)"><app-icon name="x" [size]="13" /></button></span></div>
              <div class="vbody">{{ v.text }}</div>
              <div class="hint">This is what happens when you double-click a file: it opens in the right program. Click the X to close it.</div>
            </div>
          </div>
        }
        @if (dialog(); as d) {
          <div class="viewer">
            <div class="vwin small">
              <div class="titlebar">{{ d.title }}</div>
              <div class="vbody">{{ d.text }}</div>
              <div class="row dlg"><button class="primary" (click)="d.ok(); dialog.set(null)">Yes</button><button (click)="dialog.set(null)">No</button></div>
            </div>
          </div>
        }
      </div>

      <aside class="card tasks">
        <h3>Tasks</h3>
        <ul class="checks">
          @for (t of tasks(); track $index; let i = $index) {
            <li [class.ok]="results$()[i]"><span class="mark">@if (results$()[i]) { <app-icon name="check" [size]="14" /> } @else { {{ i + 1 }} }</span><span>{{ t.instruction }}</span></li>
          }
        </ul>
        @if (allDone()) { <div class="notice success"><app-icon name="party-popper" [size]="18" /> All tasks done!</div> }
        @if (note()) { <div class="notice warn">{{ note() }}</div> }
        <button class="small" (click)="reset()">Start again</button>
      </aside>
    </div>
  `,
  styles: `
    .address { flex: 1; display: flex; align-items: center; gap: 4px; background: #fff; border: 1px solid #d5dbe5; border-radius: 8px; padding: 6px 10px; min-width: 200px; font-size: .9rem; overflow: hidden; white-space: nowrap; }
    .crumb { cursor: pointer; padding: 1px 4px; border-radius: 4px; }
    .crumb:hover { background: #eef1f6; }
    .sep { color: #999; }
    .search { width: 150px; }
    .cmds { border-top: none; }
    .body { display: grid; grid-template-columns: 170px 1fr; min-height: 340px; }
    .pane { border-right: 1px solid #e3e6eb; padding: 8px; display: flex; flex-direction: column; gap: 2px; background: #fafbfc; }
    .pane a { padding: 7px 10px; border-radius: 6px; cursor: pointer; font-size: .92rem; }
    .pane a:hover { background: #eef1f6; }
    .pane a.on { background: #dbe6f7; font-weight: 700; }
    .main { padding: 10px; display: flex; flex-wrap: wrap; align-content: flex-start; gap: 6px; outline: none; background: #fff; }
    .main:focus { box-shadow: inset 0 0 0 2px var(--accent-soft); }
    .item { width: 118px; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 6px; border-radius: 8px; cursor: default; text-align: center; border: 1px solid transparent; }
    .item:hover { background: #f1f4f9; }
    .item.sel { background: #cfe0fb; border-color: #99bbf0; }
    .item.cutting { opacity: .5; }
    .ico { font-size: 2.2rem; line-height: 1; }
    .name { font-size: .85rem; line-height: 1.2; word-break: break-word; }
    .item small { font-size: .7rem; color: #777; }
    .rename { width: 110px; font-size: .85rem; padding: 2px 4px; border: 1px solid #4f8ae8; border-radius: 4px; }
    .empty { width: 100%; color: #777; padding: 20px; text-align: center; }
    .statusbar { font-size: .8rem; padding: 4px 12px; background: #f6f7f9; border-top: 1px solid #e3e6eb; color: #555; }
    .viewer { position: absolute; inset: 0; background: rgba(0,0,0,.35); display: grid; place-items: center; z-index: 40; }
    .vwin { width: min(520px, 92%); background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,.3); }
    .vwin.small { width: min(380px, 92%); }
    .vbody { padding: 20px; white-space: pre-wrap; min-height: 100px; font-family: Consolas, monospace; color: #222; }
    .x { border: none; background: none; font-weight: 800; padding: 0 8px; }
    .x:hover { background: #e81123; color: #fff; border-radius: 4px; }
    .dlg { padding: 0 16px 16px; }
  `,
})
export class FileExplorer {
  fs = input.required<Record<string, any>>();
  binStart = input<{ name: string; from: string }[]>([], { alias: 'bin' });
  tasks = input.required<FileTask[]>();
  completed = output<void>();

  roots = ROOTS; rootIcon = ROOT_ICON;
  root = signal<Node>({ name: '', kind: 'folder', children: [] });
  path = signal('');
  hist = signal<string[]>(['']);
  inBin = signal(false);
  bin = signal<BinItem[]>([]);
  selected = signal<Node | null>(null);
  selectedBin = signal<number | null>(null);
  clipboard = signal<{ node: Node; from: string; mode: 'cut' | 'copy' } | null>(null);
  renaming = signal<Node | null>(null);
  renameText = '';
  ctx = signal<{ x: number; y: number; node: Node | null } | null>(null);
  viewer = signal<{ app: string; name: string; text: string } | null>(null);
  dialog = signal<{ title: string; text: string; ok: () => void } | null>(null);
  note = signal('');
  searchText = '';
  searching = signal(false);
  results = signal<{ node: Node; path: string; folder: string }[]>([]);
  results$ = signal<boolean[]>([]);
  allDone = signal(false);
  private opened = new Set<string>();
  private visited = new Set<string>();
  private emitted = false;

  current = computed(() => this.find(this.path()) ?? this.root());
  crumbs = computed(() => { const parts = this.path().split('/').filter(Boolean); return parts.map((p, i) => ({ name: p, path: parts.slice(0, i + 1).join('/') })); });

  constructor() { effect(() => { this.fs(); this.binStart(); this.tasks(); queueMicrotask(() => this.reset()); }); }

  reset() {
    this.root.set({ name: '', kind: 'folder', children: toNodes(this.fs()) });
    this.bin.set(this.binStart().map(b => ({ node: { name: b.name, kind: 'file', children: [] }, from: b.from })));
    this.opened.clear(); this.visited.clear(); this.emitted = false;
    this.clipboard.set(null); this.selected.set(null); this.viewer.set(null); this.note.set('');
    this.searching.set(false); this.searchText = '';
    this.hist.set(['']); this.path.set(''); this.inBin.set(false);
    this.check();
  }

  // ---------- helpers ----------
  join(a: string, b: string) { return a ? `${a}/${b}` : b; }
  find(path: string): Node | null {
    let n: Node = this.root();
    for (const p of path.split('/').filter(Boolean)) { const c = n.children.find(x => x.name === p); if (!c) return null; n = c; }
    return n;
  }
  private parentPath(path: string) { return path.split('/').slice(0, -1).join('/'); }
  icon(n: Node) {
    if (n.kind === 'folder') return 'folder';
    const ext = n.name.split('.').pop()?.toLowerCase();
    return ({ txt: 'file-text', docx: 'file-text', xlsx: 'file-spreadsheet', pdf: 'file-text', jpg: 'file-image', png: 'file-image', mp3: 'music', mp4: 'film', exe: 'settings' } as any)[ext ?? ''] ?? 'file';
  }
  private uniqueName(parent: Node, name: string) {
    if (!parent.children.some(c => c.name === name)) return name;
    const m = /^(.*?)(\.[^.]+)?$/.exec(name)!;
    let i = 2, cand = `${m[1]} - Copy${m[2] ?? ''}`;
    while (parent.children.some(c => c.name === cand)) cand = `${m[1]} - Copy (${i++})${m[2] ?? ''}`;
    return cand;
  }
  private touch() { this.root.update(r => ({ ...r })); this.check(); }

  // ---------- navigation ----------
  go(path: string) {
    this.inBin.set(false); this.searching.set(false); this.selected.set(null); this.renaming.set(null);
    this.path.set(path); this.hist.update(h => [...h, path]); this.visited.add(path); this.check();
  }
  goBin() { this.inBin.set(true); this.searching.set(false); this.selected.set(null); this.selectedBin.set(null); this.visited.add('Recycle Bin'); this.check(); }
  back() { this.hist.update(h => h.slice(0, -1)); this.inBin.set(false); this.searching.set(false); this.path.set(this.hist()[this.hist().length - 1] ?? ''); }
  up() { this.go(this.parentPath(this.path())); }
  select(n: Node, e: Event) { e.stopPropagation(); this.selected.set(n); this.ctx.set(null); }
  open(n: Node) {
    if (n.kind === 'folder') { this.go(this.join(this.path(), n.name)); return; }
    this.openFile(this.join(this.path(), n.name), n);
  }
  openResult(r: { node: Node; path: string; folder: string }) {
    if (r.node.kind === 'folder') this.go(r.path); else this.openFile(r.path, r.node);
  }
  private openFile(path: string, n: Node) {
    const ext = n.name.split('.').pop()?.toLowerCase() ?? '';
    const app = ({ txt: 'Notepad', docx: 'Microsoft Word', xlsx: 'Microsoft Excel', jpg: 'Photos', png: 'Photos', pdf: 'Microsoft Edge', mp3: 'Media Player', exe: 'Windows' } as any)[ext] ?? 'Notepad';
    const text = ext === 'exe' ? 'This is a program installer. Only open these if you trust where they came from.\n\n(Nothing happens in this practice.)'
      : ext === 'jpg' || ext === 'png' ? '[ a lovely picture ]' : `This is the inside of ${n.name}.\n\nWell done, you opened it!`;
    this.viewer.set({ app, name: n.name, text });
    this.opened.add(path); this.check();
  }

  // ---------- commands ----------
  newFolder() {
    const parent = this.current();
    const node: Node = { name: this.uniqueName(parent, 'New folder'), kind: 'folder', children: [] };
    parent.children.push(node);
    this.selected.set(node); this.touch();
    this.renaming.set(node); this.renameText = node.name;
    this.focusRename();
  }
  private focusRename(tries = 12) { setTimeout(() => { const i = document.querySelector('.rename') as HTMLInputElement | null; if (i) { i.focus(); i.select(); } else if (tries > 0) this.focusRename(tries - 1); }, 16); }
  startRename() { const n = this.selected(); if (!n) return; this.renaming.set(n); this.renameText = n.name; this.focusRename(); }
  commitRename() {
    const n = this.renaming(); if (!n) return;
    const name = this.renameText.trim();
    if (name && name !== n.name) {
      if (this.current().children.some(c => c !== n && c.name === name)) this.note.set('There is already something with that name here.');
      else n.name = name;
    }
    this.renaming.set(null); this.touch();
  }
  cut() { const n = this.selected(); if (n) this.clipboard.set({ node: n, from: this.path(), mode: 'cut' }); }
  copy() { const n = this.selected(); if (n) this.clipboard.set({ node: n, from: this.path(), mode: 'copy' }); }
  paste() {
    const c = this.clipboard(); if (!c) return;
    this.moveOrCopy(c.node, c.from, this.path(), c.mode);
    if (c.mode === 'cut') this.clipboard.set(null);
  }
  private moveOrCopy(node: Node, from: string, to: string, mode: 'cut' | 'copy') {
    if (to === from && mode === 'cut') return;
    const dest = this.find(to); const src = this.find(from);
    if (!dest || !src) return;
    if (node.kind === 'folder' && (to === this.join(from, node.name) || to.startsWith(this.join(from, node.name) + '/'))) { this.note.set('You cannot put a folder inside itself.'); return; }
    if (mode === 'cut') { src.children = src.children.filter(x => x !== node); node.name = this.uniqueName(dest, node.name); dest.children.push(node); }
    else { const copy = clone(node); copy.name = this.uniqueName(dest, copy.name); dest.children.push(copy); }
    this.note.set(''); this.touch();
  }
  del() {
    const n = this.selected(); if (!n) return;
    const parent = this.current();
    parent.children = parent.children.filter(x => x !== n);
    this.bin.update(b => [...b, { node: n, from: this.path() }]);
    this.selected.set(null); this.touch();
  }
  restore() {
    const i = this.selectedBin(); if (i == null) return;
    const item = this.bin()[i];
    const dest = this.find(item.from) ?? this.find('Documents')!;
    item.node.name = this.uniqueName(dest, item.node.name);
    dest.children.push(item.node);
    this.bin.update(b => b.filter((_, j) => j !== i)); this.selectedBin.set(null); this.touch();
  }
  emptyBin() {
    this.dialog.set({ title: 'Delete Multiple Items', text: `Are you sure you want to permanently delete these ${this.bin().length} items?`, ok: () => { this.bin.set([]); this.check(); } });
  }
  doSearch() {
    const q = this.searchText.trim().toLowerCase();
    if (!q) { this.searching.set(false); return; }
    const out: { node: Node; path: string; folder: string }[] = [];
    const walk = (n: Node, p: string) => { for (const c of n.children) { const cp = this.join(p, c.name); if (c.name.toLowerCase().includes(q)) out.push({ node: c, path: cp, folder: p }); if (c.kind === 'folder') walk(c, cp); } };
    walk(this.root(), '');
    this.results.set(out); this.searching.set(true); this.inBin.set(false); this.selected.set(null);
  }
  onKey(e: KeyboardEvent) {
    if (this.renaming()) return;
    if (e.key === 'Delete') { if (this.inBin()) return; this.del(); }
    else if (e.key === 'F2') { e.preventDefault(); this.startRename(); }
    else if (e.ctrlKey && e.key.toLowerCase() === 'c') { this.copy(); }
    else if (e.ctrlKey && e.key.toLowerCase() === 'x') { this.cut(); }
    else if (e.ctrlKey && e.key.toLowerCase() === 'v') { this.paste(); }
    else if (e.key === 'Enter' && this.selected()) { this.open(this.selected()!); }
    else if (e.key === 'Backspace') { this.back(); }
  }

  // ---------- context menus ----------
  itemCtx(e: MouseEvent, n: Node) { e.preventDefault(); e.stopPropagation(); this.selected.set(n); this.ctx.set(this.ctxPos(e, n)); }
  bgCtx(e: MouseEvent) { e.preventDefault(); if (this.inBin() || this.searching() || this.path() === '') return; this.selected.set(null); this.ctx.set(this.ctxPos(e, null)); }
  private ctxPos(e: MouseEvent, node: Node | null) {
    const host = (e.currentTarget as HTMLElement).closest('.window') as HTMLElement;
    const r = host.getBoundingClientRect();
    return { x: Math.min(e.clientX - r.left, r.width - 180), y: Math.min(e.clientY - r.top, r.height - 170), node };
  }
  @HostListener('document:keydown.escape') esc() { this.ctx.set(null); this.renaming.set(null); }

  // ---------- drag and drop ----------
  private dragNode: { node: Node; from: string } | null = null;
  dragStart(e: DragEvent, n: Node) { this.dragNode = { node: n, from: this.path() }; e.dataTransfer?.setData('text/plain', n.name); }
  dragOver(e: DragEvent) { if (this.dragNode) e.preventDefault(); }
  dropOn(e: DragEvent, to: string) {
    e.preventDefault(); e.stopPropagation();
    const d = this.dragNode; this.dragNode = null;
    if (!d || to === d.from || to === '') return;
    this.moveOrCopy(d.node, d.from, to, 'cut');
  }
  dropOnBin(e: DragEvent) {
    e.preventDefault(); e.stopPropagation();
    const d = this.dragNode; this.dragNode = null;
    if (!d) return;
    const src = this.find(d.from)!; src.children = src.children.filter(x => x !== d.node);
    this.bin.update(b => [...b, { node: d.node, from: d.from }]); this.touch();
  }

  // ---------- checks ----------
  check() {
    const res = this.tasks().map(t => {
      const c = t.check;
      switch (c.type) {
        case 'exists': { const n = this.find(c.path); return !!n && (!c.kind || n.kind === c.kind); }
        case 'notExists': return !this.find(c.path);
        case 'inBin': return this.bin().some(b => b.node.name === c.name);
        case 'notInBin': return !this.bin().some(b => b.node.name === c.name);
        case 'binEmpty': return this.bin().length === 0;
        case 'opened': return this.opened.has(c.path);
        case 'visited': return this.visited.has(c.path);
        default: return false;
      }
    });
    this.results$.update(prev => res.map((r, i) => r || (prev[i] === true && ['opened', 'visited', 'inBin'].includes(this.tasks()[i].check.type))));
    const all = res.length > 0 && this.results$().every(Boolean);
    this.allDone.set(all);
    if (all && !this.emitted) { this.emitted = true; this.completed.emit(); }
  }
}
