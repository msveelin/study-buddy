import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { Icon } from '../../core/icon';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

export interface Site { title: string; body: string; keywords?: string[]; }
export interface BrowserTask { instruction: string; check: any; }
interface Tab { id: number; history: string[]; pos: number; }

const START = 'start.example';
const SEARCH = 'search.example';

@Component({
  selector: 'app-browser-sim',
  imports: [FormsModule, Icon],
  template: `
    <div class="sim">
      <div class="card window browser">
        <div class="tabbar">
          @for (t of tabs(); track t.id) {
            <div class="tab" [class.on]="t.id === activeId()" (click)="activate(t.id)">
              <span class="fav"><app-icon [name]="favicon(urlOf(t))" [size]="14" /></span>
              <span class="ttl">{{ titleOf(urlOf(t)) }}</span>
              <button class="close" (click)="closeTab(t.id, $event)" title="Close tab">×</button>
            </div>
          }
          <button class="newtab" (click)="newTab()" title="New tab">+</button>
        </div>
        <div class="toolbar">
          <button (click)="back()" [disabled]="active().pos === 0" title="Back">←</button>
          <button (click)="forward()" [disabled]="active().pos >= active().history.length - 1" title="Forward">→</button>
          <button (click)="refresh()" title="Refresh">↻</button>
          <div class="addr" [class.secure]="isSite(url())">
            <span class="lock">@if (isSite(url())) { <app-icon name="lock" [size]="14" /> } @else { <app-icon name="search" [size]="14" /> }</span>
            <input type="text" [(ngModel)]="addrText" (keydown.enter)="submit()" (focus)="selectAll($event)" aria-label="Address bar" placeholder="Search or type a web address">
          </div>
          <button (click)="toggleBookmark()" [class.star]="isBookmarked()" title="Bookmark this page"><app-icon name="star" [size]="16" [fill]="isBookmarked()" /></button>
          <button title="More">⋯</button>
        </div>
        @if (bookmarks().length) {
          <div class="bmbar">
            @for (b of bookmarks(); track b) { <button (click)="navigate(b)"><app-icon [name]="favicon(b)" [size]="14" /> {{ titleOf(b) }}</button> }
          </div>
        }
        <div class="page" (click)="pageClick($event)">
          @if (url() === START) {
            <div class="start">
              <h1><app-icon name="search" [size]="26" /> Search the web</h1>
              <input type="text" [(ngModel)]="startText" (keydown.enter)="search(startText)" placeholder="Type words and press Enter" aria-label="Search">
              <p class="muted">Or type a web address in the bar at the top, such as <b>city-library.example</b></p>
            </div>
          } @else if (url().startsWith(SEARCH)) {
            <div class="results">
              <p class="q">Results for <b>{{ query() }}</b></p>
              @for (r of searchResults(); track r.url; let first = $first) {
                <div class="result">
                  @if (first && r.url.includes('prize')) { <span class="ad">Ad</span> }
                  <a [attr.href]="r.url">{{ r.title }}</a>
                  <div class="rurl">{{ r.url }}</div>
                  <div class="snip">{{ r.snippet }}</div>
                </div>
              } @empty {
                <p>No results. Try different words.</p>
              }
            </div>
          } @else if (site(); as s) {
            <div class="prose" [innerHTML]="html()"></div>
          } @else {
            <div class="notfound"><h1>Hmm… we can't reach this page</h1><p>Check the address for typing mistakes: <b>{{ url() }}</b></p></div>
          }
        </div>
        <div class="hint">Pretend browser. Only the sites in this lesson exist here; nothing goes to the real internet.</div>
      </div>

      <aside class="card tasks">
        <h3>Tasks</h3>
        <ul class="checks">
          @for (t of tasks(); track $index; let i = $index) {
            <li [class.ok]="results()[i]"><span class="mark">@if (results()[i]) { <app-icon name="check" [size]="14" /> } @else { {{ i + 1 }} }</span><span>{{ t.instruction }}</span></li>
          }
        </ul>
        @if (allDone()) { <div class="notice success"><app-icon name="party-popper" [size]="18" /> All tasks done!</div> }
        <button class="small" (click)="reset()">Start again</button>
      </aside>
    </div>
  `,
  styles: `
    .browser { background: #fff; }
    .tabbar { display: flex; align-items: flex-end; gap: 4px; background: #dfe3ea; padding: 8px 8px 0; }
    .tab { display: flex; align-items: center; gap: 8px; padding: 7px 10px; background: #eef0f4; border-radius: 8px 8px 0 0; font-size: .85rem; max-width: 190px; cursor: default; }
    .tab.on { background: #fff; font-weight: 700; }
    .ttl { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .close { border: none; background: none; padding: 0 4px; font-size: 1rem; line-height: 1; border-radius: 4px; }
    .close:hover { background: #ccd; }
    .newtab { border: none; background: none; font-size: 1.2rem; padding: 2px 10px; }
    .toolbar { background: #fff; border-bottom: 1px solid #e3e6eb; }
    .addr { flex: 1; display: flex; align-items: center; gap: 6px; background: #f1f3f6; border-radius: 999px; padding: 4px 12px; min-width: 200px; }
    .addr input { flex: 1; border: none; background: none; font-size: .95rem; padding: 4px; outline: none; }
    .addr:focus-within { outline: 2px solid var(--accent); background: #fff; }
    .star { color: #e6a800; }
    .bmbar { display: flex; gap: 4px; padding: 4px 10px; border-bottom: 1px solid #e3e6eb; background: #fafbfc; flex-wrap: wrap; }
    .bmbar button { border: none; background: none; font-size: .82rem; padding: 3px 8px; border-radius: 6px; font-weight: 600; }
    .bmbar button:hover { background: #eef1f6; }
    .page { min-height: 340px; max-height: 460px; overflow: auto; padding: 22px 28px; color: #222; }
    .page .prose { max-width: none; font-size: 1rem; }
    .page :is(h1, h2) { color: #222; }
    .page a { color: #1a0dab; text-decoration: underline; cursor: pointer; }
    .start { text-align: center; padding: 50px 0; }
    .start input { width: min(460px, 100%); font-size: 1.05rem; }
    .q { color: #555; }
    .result { margin-bottom: 20px; }
    .result a { font-size: 1.15rem; }
    .rurl { color: #0b7a3b; font-size: .85rem; }
    .snip { color: #444; }
    .ad { display: inline-block; font-size: .7rem; font-weight: 800; border: 1px solid #555; border-radius: 3px; padding: 0 4px; margin-right: 6px; vertical-align: middle; }
    .notfound { text-align: center; padding: 40px 0; color: #444; }
  `,
})
export class BrowserSim {
  sites = input.required<Record<string, Site>>();
  home = input(START);
  tasks = input.required<BrowserTask[]>();
  completed = output<void>();
  private san = inject(DomSanitizer);
  readonly START = START;
  readonly SEARCH = SEARCH;

  tabs = signal<Tab[]>([{ id: 1, history: [START], pos: 0 }]);
  activeId = signal(1);
  bookmarks = signal<string[]>([]);
  addrText = '';
  startText = '';
  results = signal<boolean[]>([]);
  allDone = signal(false);
  private nextId = 2;
  private visited = new Set<string>();
  private searches: string[] = [];
  private closed: string[] = [];
  private backs = 0;
  private refreshes = 0;
  private emitted = false;

  active = computed(() => this.tabs().find(t => t.id === this.activeId()) ?? this.tabs()[0]);
  url = computed(() => this.urlOf(this.active()));
  site = computed(() => this.sites()[this.url()] ?? null);
  html = computed<SafeHtml>(() => this.san.bypassSecurityTrustHtml(marked.parse(this.site()?.body ?? '', { async: false, gfm: true }) as string));
  query = computed(() => decodeURIComponent(this.url().split('?q=')[1] ?? ''));
  searchResults = computed(() => {
    const words = this.query().toLowerCase().split(/\s+/).filter(w => w.length > 1);
    const scored = Object.entries(this.sites()).map(([url, s]) => {
      const hay = `${s.title} ${(s.keywords ?? []).join(' ')} ${s.body}`.toLowerCase();
      const score = words.reduce((n, w) => n + (hay.includes(w) ? 1 : 0) + ((s.keywords ?? []).some(k => k.includes(w)) ? 2 : 0), 0);
      return { url, title: s.title, snippet: s.body.replace(/[#*|\[\]()>-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140) + '…', score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);
    return scored.slice(0, 6);
  });

  constructor() { effect(() => { this.sites(); this.tasks(); this.home(); queueMicrotask(() => this.reset()); }); }

  reset() {
    this.tabs.set([{ id: 1, history: [this.home()], pos: 0 }]); this.activeId.set(1); this.nextId = 2;
    this.bookmarks.set([]); this.visited.clear(); this.searches = []; this.closed = []; this.backs = 0; this.refreshes = 0; this.emitted = false;
    this.syncAddr(); this.check();
  }

  urlOf(t: Tab) { return t.history[t.pos]; }
  isSite(u: string) { return !!this.sites()[u]; }
  titleOf(u: string) { return u === START ? 'New tab' : u.startsWith(SEARCH) ? `${decodeURIComponent(u.split('?q=')[1] ?? '')} - Search` : this.sites()[u]?.title ?? u; }
  favicon(u: string) { return u === START ? 'home' : u.startsWith(SEARCH) ? 'search' : u.includes('library') ? 'book-marked' : u.includes('weather') ? 'cloud-sun' : u.includes('recipe') ? 'utensils' : u.includes('bus') ? 'bus' : u.includes('prize') ? 'triangle-alert' : 'globe'; }
  private syncAddr() { const u = this.url(); this.addrText = u === START ? '' : u.startsWith(SEARCH) ? this.query() : u; }
  selectAll(e: FocusEvent) { (e.target as HTMLInputElement).select(); }

  private setTab(fn: (t: Tab) => Tab) { this.tabs.update(all => all.map(t => t.id === this.activeId() ? fn(t) : t)); }
  navigate(raw: string) {
    let u = raw.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '');
    if (!u) return;
    this.setTab(t => ({ ...t, history: [...t.history.slice(0, t.pos + 1), u], pos: t.pos + 1 }));
    this.visited.add(u); this.syncAddr(); this.check();
  }
  search(q: string) {
    q = q.trim(); if (!q) return;
    this.searches.push(q.toLowerCase());
    this.navigate(`${SEARCH}?q=${encodeURIComponent(q)}`);
    this.startText = '';
  }
  submit() {
    const v = this.addrText.trim();
    if (/^[\w.-]+\.[a-z]{2,}(\/[\w./-]*)?$/i.test(v)) this.navigate(v); else this.search(v);
  }
  back() { this.setTab(t => ({ ...t, pos: Math.max(0, t.pos - 1) })); this.backs++; this.syncAddr(); this.check(); }
  forward() { this.setTab(t => ({ ...t, pos: Math.min(t.history.length - 1, t.pos + 1) })); this.syncAddr(); this.check(); }
  refresh() { this.refreshes++; this.check(); }
  newTab() { const id = this.nextId++; this.tabs.update(all => [...all, { id, history: [START], pos: 0 }]); this.activeId.set(id); this.syncAddr(); this.check(); setTimeout(() => (document.querySelector('.addr input') as HTMLInputElement)?.focus()); }
  activate(id: number) { this.activeId.set(id); this.syncAddr(); }
  closeTab(id: number, e: Event) {
    e.stopPropagation();
    const t = this.tabs().find(x => x.id === id); if (t) this.closed.push(this.urlOf(t));
    if (this.tabs().length === 1) { this.tabs.set([{ id: this.nextId++, history: [START], pos: 0 }]); this.activeId.set(this.tabs()[0].id); }
    else { this.tabs.update(all => all.filter(x => x.id !== id)); if (this.activeId() === id) this.activeId.set(this.tabs()[this.tabs().length - 1].id); }
    this.syncAddr(); this.check();
  }
  isBookmarked() { return this.bookmarks().includes(this.url()); }
  toggleBookmark() { const u = this.url(); if (u === START) return; this.bookmarks.update(b => b.includes(u) ? b.filter(x => x !== u) : [...b, u]); this.check(); }
  pageClick(e: MouseEvent) {
    const a = (e.target as HTMLElement).closest('a'); if (!a) return;
    e.preventDefault();
    const href = a.getAttribute('href'); if (href) this.navigate(href);
  }

  check() {
    const res = this.tasks().map(t => {
      const c = t.check;
      switch (c.type) {
        case 'visited': return this.visited.has(c.url);
        case 'onPage': return this.url() === c.url;
        case 'tabsAtLeast': return this.tabs().length >= c.n;
        case 'searched': return this.searches.some(s => s.includes(String(c.includes).toLowerCase()));
        case 'bookmarked': return this.bookmarks().includes(c.url);
        case 'wentBack': return this.backs > 0;
        case 'closedTab': return c.url ? this.closed.includes(c.url) : this.closed.length > 0;
        case 'refreshed': return this.refreshes > 0;
        default: return false;
      }
    });
    this.results.update(prev => res.map((r, i) => r || prev[i] === true));
    const all = res.length > 0 && this.results().every(Boolean);
    this.allDone.set(all);
    if (all && !this.emitted) { this.emitted = true; this.completed.emit(); }
  }
}
