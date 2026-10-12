import { Component, computed, effect, input, output, signal } from '@angular/core';
import { Icon } from '../../core/icon';
import { FormsModule } from '@angular/forms';

export interface SettingsTask { instruction: string; check: any; }

const PAGES = [
  { key: 'system', name: 'System', icon: 'monitor', sub: 'Display, sound, notifications' },
  { key: 'devices', name: 'Bluetooth & devices', icon: 'printer', sub: 'Printers, mouse, keyboard' },
  { key: 'network', name: 'Network & internet', icon: 'wifi', sub: 'Wi-Fi, airplane mode' },
  { key: 'personal', name: 'Personalisation', icon: 'palette', sub: 'Background, colours, themes' },
  { key: 'apps', name: 'Apps', icon: 'package', sub: 'Installed apps, defaults' },
  { key: 'time', name: 'Time & language', icon: 'globe', sub: 'Language, region, date' },
  { key: 'update', name: 'Windows Update', icon: 'refresh-cw', sub: 'Updates, restart' },
];
const WALLPAPERS: Record<string, string> = {
  Default: 'linear-gradient(135deg,#1e3a8a,#3b82f6)', Mountains: 'linear-gradient(160deg,#dbeafe,#60a5fa 50%,#1e3a8a)',
  Beach: 'linear-gradient(180deg,#7dd3fc 55%,#fde68a 55%)', Forest: 'linear-gradient(160deg,#064e3b,#16a34a 60%,#86efac)', City: 'linear-gradient(180deg,#4c1d95,#f472b6)',
};
const NETWORKS = [{ ssid: 'Home-WiFi', key: 'sunflower42', bars: 4 }, { ssid: 'Neighbour-5G', key: 'unknown', bars: 2 }, { ssid: 'CoffeeShop_Free', key: '', bars: 1 }];
const APPS = ['Microsoft Word', 'Microsoft Edge', 'Super PC Cleaner Pro', 'Calculator', 'Weather Toolbar', 'Zoom', 'Photos'];
const LANGS = ['English (United Kingdom)', 'Français (France)', 'Español (España)', 'Kiswahili', 'Deutsch (Deutschland)'];
const FOUND_PRINTERS = ['HP OfficeJet (Living room)', 'Canon PIXMA (Office)'];

@Component({
  selector: 'app-settings-sim',
  imports: [FormsModule, Icon],
  template: `
    <div class="sim">
      <div class="card window settings">
        <div class="titlebar"><app-icon name="settings" [size]="16" /> Settings <span class="dots"><span><app-icon name="minus" [size]="12" /></span><span><app-icon name="square" [size]="11" /></span><span><app-icon name="x" [size]="13" /></span></span></div>
        <div class="layout" [class.dark]="theme() === 'dark'">
          <nav class="pane">
            <input type="text" [(ngModel)]="q" (keydown.enter)="jump()" placeholder="Find a setting" aria-label="Find a setting">
            @for (p of pages; track p.key) {
              <a [class.on]="page() === p.key" (click)="page.set(p.key)"><span class="ico"><app-icon [name]="p.icon" [size]="18" /></span><span><b>{{ p.name }}</b><small>{{ p.sub }}</small></span></a>
            }
          </nav>
          <div class="panel">
            @switch (page()) {
              @case ('system') {
                <h2>System › Display</h2>
                <div class="setting"><div><b>Brightness</b><small>Adjust the brightness of the screen</small></div>
                  <div class="slider"><span><app-icon name="sun" [size]="14" /></span><input type="range" min="0" max="100" [ngModel]="brightness()" (ngModelChange)="brightness.set($event); check()"><span><app-icon name="sun" [size]="18" /> {{ brightness() }}%</span></div></div>
                <div class="setting"><div><b>Night light</b><small>Warmer colours to help you sleep</small></div><label class="switch"><input type="checkbox" [ngModel]="nightLight()" (ngModelChange)="nightLight.set($event); check()"><span></span>{{ nightLight() ? 'On' : 'Off' }}</label></div>
                <div class="setting"><div><b>Scale</b><small>Change the size of text, apps and other items</small></div>
                  <select [ngModel]="textScale()" (ngModelChange)="textScale.set(+$event); check()"><option [ngValue]="100">100% (Recommended)</option><option [ngValue]="125">125%</option><option [ngValue]="150">150%</option></select></div>
                <div class="preview" [style.filter]="'brightness(' + (0.4 + brightness() / 160) + ')' + (nightLight() ? ' sepia(.4)' : '')" [style.background]="wallpapers[wallpaper()]">
                  <span [style.font-size.%]="textScale()">Sample text at {{ textScale() }}%</span>
                </div>
              }
              @case ('devices') {
                <h2>Bluetooth & devices › Printers & scanners</h2>
                @for (p of printers(); track p) {
                  <div class="setting"><div><b><app-icon name="printer" [size]="16" /> {{ p }}</b><small>{{ defaultPrinter() === p ? 'Default printer' : 'Ready' }}</small></div>
                    @if (defaultPrinter() !== p) { <button class="small" (click)="defaultPrinter.set(p); check()">Set as default</button> }</div>
                } @empty { <p class="muted">No printers yet.</p> }
                <div class="setting"><div><b>Add a printer or scanner</b></div><button class="small" (click)="scanPrinters()">Add device</button></div>
                @if (scanning()) { <p class="muted"><app-icon name="search" [size]="16" /> Searching for printers…</p> }
                @for (p of found(); track p) {
                  @if (!printers().includes(p)) { <div class="setting found"><div><app-icon name="printer" [size]="16" /> {{ p }}</div><button class="small primary" (click)="addPrinter(p)">Add device</button></div> }
                }
              }
              @case ('network') {
                <h2>Network & internet › Wi-Fi</h2>
                <div class="setting"><div><b>Wi-Fi</b><small>{{ wifi() ? 'Connected to ' + wifi() : wifiOn() ? 'Not connected' : 'Turned off' }}</small></div><label class="switch"><input type="checkbox" [ngModel]="wifiOn()" (ngModelChange)="setWifiOn($event)"><span></span>{{ wifiOn() ? 'On' : 'Off' }}</label></div>
                @if (wifiOn()) {
                  <h3>Available networks</h3>
                  @for (n of networks; track n.ssid) {
                    <div class="net" [class.open]="netOpen() === n.ssid" (click)="netOpen.set(n.ssid)">
                      <div class="row"><span><app-icon name="wifi" [size]="16" /> <b>{{ n.ssid }}</b> @if (n.key) { <app-icon name="lock" [size]="14" /> }</span><span class="muted">{{ wifi() === n.ssid ? 'Connected' : '' }}</span></div>
                      @if (netOpen() === n.ssid && wifi() !== n.ssid) {
                        <div class="netbody" (click)="$event.stopPropagation()">
                          <label><input type="checkbox" [(ngModel)]="autoConnect"> Connect automatically</label>
                          @if (n.key) {
                            <label>Enter the network security key <input type="text" [(ngModel)]="keyText" (keydown.enter)="connect(n)" placeholder="Network key"></label>
                          }
                          <button class="small primary" (click)="connect(n)">Connect</button>
                          @if (netNote()) { <div class="notice warn">{{ netNote() }}</div> }
                        </div>
                      }
                    </div>
                  }
                }
              }
              @case ('personal') {
                <h2>Personalisation › Background</h2>
                <div class="preview" [style.background]="wallpapers[wallpaper()]"><span>{{ wallpaper() }}</span></div>
                <h3>Choose a photo</h3>
                <div class="thumbs">
                  @for (w of wallpaperNames; track w) { <button class="thumb" [class.on]="wallpaper() === w" [style.background]="wallpapers[w]" (click)="wallpaper.set(w); check()" [title]="w"><span>{{ w }}</span></button> }
                </div>
                <h3>Choose your mode</h3>
                <label class="radio"><input type="radio" name="theme" value="light" [ngModel]="theme()" (ngModelChange)="theme.set($event); check()"> <app-icon name="sun" [size]="16" /> Light</label>
                <label class="radio"><input type="radio" name="theme" value="dark" [ngModel]="theme()" (ngModelChange)="theme.set($event); check()"> <app-icon name="moon" [size]="16" /> Dark</label>
              }
              @case ('apps') {
                <h2>Apps › Installed apps</h2>
                <input type="text" [(ngModel)]="appFilter" placeholder="Search apps" aria-label="Search apps" class="filter">
                @for (a of apps(); track a) {
                  @if (!appFilter || a.toLowerCase().includes(appFilter.toLowerCase())) {
                    <div class="setting app"><div><b><app-icon [name]="appIcon(a)" [size]="16" /> {{ a }}</b><small>{{ a.includes('Microsoft') ? 'Microsoft Corporation' : a.includes('Cleaner') || a.includes('Toolbar') ? 'Unknown publisher' : 'Verified publisher' }}</small></div>
                      <div class="more"><button class="small" (click)="menuApp.set(menuApp() === a ? null : a)">⋯</button>
                        @if (menuApp() === a) { <div class="ctx static"><button (click)="askUninstall(a)">Uninstall</button><button (click)="menuApp.set(null)">Modify</button></div> }
                      </div></div>
                  }
                }
              }
              @case ('time') {
                <h2>Time & language</h2>
                <div class="setting"><div><b>Set time automatically</b><small>Keep the clock right using the internet</small></div><label class="switch"><input type="checkbox" [ngModel]="autoTime()" (ngModelChange)="autoTime.set($event); check()"><span></span>{{ autoTime() ? 'On' : 'Off' }}</label></div>
                <h3>Language & region › Preferred languages</h3>
                @for (l of langs(); track l; let first = $first) { <div class="setting"><div><b>{{ l }}</b><small>{{ first ? 'Windows display language · Keyboard' : 'Keyboard' }}</small></div></div> }
                <div class="setting"><div><b>Add a language</b></div><select [(ngModel)]="langPick"><option value="">Choose…</option>@for (l of langOptions; track l) { @if (!langs().includes(l)) { <option [value]="l">{{ l }}</option> } }</select><button class="small primary" [disabled]="!langPick" (click)="addLang()">Add</button></div>
              }
              @case ('update') {
                <h2>Windows Update</h2>
                @switch (updateState()) {
                  @case ('idle') { <div class="setting"><div><b>You're up to date</b><small>Last checked: a while ago</small></div><button class="small primary" (click)="checkUpdates()">Check for updates</button></div> }
                  @case ('checking') { <p><app-icon name="refresh-cw" [size]="16" /> Checking for updates…</p> }
                  @case ('available') { <div class="setting"><div><b>Updates available</b><small>Security update for Windows (KB50001)</small></div><button class="small primary" (click)="install()">Install now</button></div> }
                  @case ('installing') { <p><app-icon name="download" [size]="16" /> Installing… {{ installPct() }}%</p><div class="progress-bar"><span [style.width.%]="installPct()"></span></div> }
                  @case ('restart') { <div class="setting"><div><b>Restart required</b><small>Save your work, then restart to finish installing</small></div><button class="small primary" (click)="restart()">Restart now</button></div> }
                  @case ('restarting') { <div class="restarting">⏻ Restarting… Do not turn off your computer.</div> }
                  @case ('done') { <div class="setting"><div><b><app-icon name="check" [size]="16" [stroke]="3" /> You're up to date</b><small>Last checked: just now</small></div></div> }
                }
              }
            }
          </div>
        </div>
        @if (dialog(); as d) {
          <div class="modal"><div class="box"><h3>{{ d.title }}</h3><p>{{ d.text }}</p><div class="row"><button class="primary" (click)="d.ok(); dialog.set(null)">Uninstall</button><button (click)="dialog.set(null)">Cancel</button></div></div></div>
        }
        <div class="hint">Pretend Settings app. Nothing here changes your real computer.</div>
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
    .layout { display: grid; grid-template-columns: 230px 1fr; min-height: 420px; background: #f3f3f3; color: #222; }
    .layout.dark { background: #202020; color: #eee; }
    .layout.dark .panel { background: #2b2b2b; }
    .layout.dark .setting { background: #333; }
    .layout.dark .pane a.on { background: #444; }
    .pane { padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }
    .pane input { margin-bottom: 8px; border-radius: 8px; padding: 7px 12px; }
    .pane a { display: flex; gap: 10px; align-items: center; padding: 7px 10px; border-radius: 6px; cursor: pointer; }
    .pane a:hover { background: rgba(0,0,0,.06); }
    .pane a.on { background: #fff; }
    .pane .ico { font-size: 1.2rem; }
    .pane b { display: block; font-size: .9rem; }
    .pane small { font-size: .72rem; color: #777; }
    .panel { padding: 18px 22px; background: #fafafa; overflow: auto; max-height: 520px; }
    h2 { font-size: 1.3rem; margin-bottom: 14px; }
    h3 { font-size: 1rem; margin: 16px 0 8px; }
    .setting { display: flex; justify-content: space-between; align-items: center; gap: 12px; background: #fff; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px; flex-wrap: wrap; }
    .setting small { display: block; color: #777; font-size: .8rem; }
    .setting.found { background: #eef5ff; }
    .slider { display: flex; align-items: center; gap: 8px; }
    .slider input { width: 180px; accent-color: #0067c0; }
    .switch { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
    .switch input { display: none; }
    .switch span { width: 44px; height: 22px; border-radius: 999px; background: #999; position: relative; transition: background .2s; }
    .switch span::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: left .2s; }
    .switch input:checked + span { background: #0067c0; }
    .switch input:checked + span::after { left: 25px; }
    .preview { height: 120px; border-radius: 10px; display: grid; place-items: center; color: #fff; font-weight: 800; text-shadow: 0 1px 4px rgba(0,0,0,.5); margin: 8px 0; }
    .thumbs { display: flex; gap: 8px; flex-wrap: wrap; }
    .thumb { width: 110px; height: 66px; border-radius: 8px; border: 3px solid transparent; color: #fff; font-size: .8rem; font-weight: 800; text-shadow: 0 1px 3px rgba(0,0,0,.6); display: grid; place-items: end start; padding: 6px; }
    .thumb.on { border-color: #0067c0; }
    .radio { display: flex; gap: 8px; align-items: center; background: #fff; padding: 10px 14px; border-radius: 8px; margin-bottom: 6px; cursor: pointer; }
    .net { background: #fff; border-radius: 8px; padding: 10px 14px; margin-bottom: 6px; cursor: pointer; }
    .net .row { justify-content: space-between; }
    .netbody { padding-top: 10px; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
    .netbody label { display: flex; gap: 8px; align-items: center; }
    .netbody input[type=text] { border-radius: 6px; padding: 6px 10px; }
    .filter { margin-bottom: 10px; border-radius: 8px; padding: 7px 12px; width: 100%; max-width: 320px; }
    .more { position: relative; }
    .ctx.static { right: 0; top: 34px; }
    .restarting { background: #0067c0; color: #fff; padding: 60px 20px; text-align: center; border-radius: 8px; font-size: 1.1rem; }
    .modal { position: absolute; inset: 0; background: rgba(0,0,0,.4); display: grid; place-items: center; z-index: 50; }
    .box { background: #fff; color: #222; border-radius: 10px; padding: 22px 26px; width: min(380px, 92%); }
  `,
})
export class SettingsSim {
  tasks = input.required<SettingsTask[]>();
  completed = output<void>();

  pages = PAGES; wallpapers = WALLPAPERS; wallpaperNames = Object.keys(WALLPAPERS); networks = NETWORKS; langOptions = LANGS;
  page = signal('system');
  q = '';
  wallpaper = signal('Default'); theme = signal<'light' | 'dark'>('light');
  brightness = signal(50); textScale = signal(100); nightLight = signal(false);
  wifiOn = signal(true); wifi = signal<string | null>(null); netOpen = signal<string | null>(null); keyText = ''; autoConnect = true; netNote = signal('');
  langs = signal<string[]>(['English (United States)']); langPick = ''; autoTime = signal(false);
  apps = signal<string[]>([...APPS]); appFilter = ''; menuApp = signal<string | null>(null); uninstalled = signal<string[]>([]);
  updateState = signal<'idle' | 'checking' | 'available' | 'installing' | 'restart' | 'restarting' | 'done'>('idle'); installPct = signal(0); private checked = false;
  printers = signal<string[]>([]); defaultPrinter = signal<string | null>(null); found = signal<string[]>([]); scanning = signal(false);
  dialog = signal<{ title: string; text: string; ok: () => void } | null>(null);
  results = signal<boolean[]>([]); allDone = signal(false);
  private emitted = false;

  constructor() { effect(() => { this.tasks(); queueMicrotask(() => this.reset()); }); }

  reset() {
    this.page.set('system'); this.wallpaper.set('Default'); this.theme.set('light'); this.brightness.set(50); this.textScale.set(100); this.nightLight.set(false);
    this.wifiOn.set(true); this.wifi.set(null); this.netOpen.set(null); this.keyText = ''; this.netNote.set('');
    this.langs.set(['English (United States)']); this.autoTime.set(false); this.apps.set([...APPS]); this.uninstalled.set([]);
    this.updateState.set('idle'); this.checked = false; this.printers.set([]); this.defaultPrinter.set(null); this.found.set([]);
    this.emitted = false; this.results.set([]); this.check();
  }
  jump() {
    const s = this.q.toLowerCase();
    const map: [string, string][] = [['wall', 'personal'], ['background', 'personal'], ['dark', 'personal'], ['theme', 'personal'], ['bright', 'system'], ['text', 'system'], ['display', 'system'], ['scale', 'system'],
      ['wi', 'network'], ['internet', 'network'], ['network', 'network'], ['print', 'devices'], ['app', 'apps'], ['uninstall', 'apps'], ['lang', 'time'], ['keyboard', 'time'], ['time', 'time'], ['update', 'update']];
    const hit = map.find(([k]) => s.includes(k)); if (hit) this.page.set(hit[1]);
  }
  appIcon(a: string) { return a.includes('Word') ? 'file-text' : a.includes('Edge') ? 'globe' : a.includes('Cleaner') ? 'wrench' : a.includes('Toolbar') ? 'cloud-sun' : a.includes('Calc') ? 'calculator' : a.includes('Zoom') ? 'video' : 'image'; }
  setWifiOn(on: boolean) { this.wifiOn.set(on); if (!on) this.wifi.set(null); this.check(); }
  connect(n: { ssid: string; key: string }) {
    if (n.key && this.keyText.trim() !== n.key) { this.netNote.set(n.key === 'unknown' ? 'That is not your network. Choose the one whose key you have.' : 'That key is not right. Check the sticker on the router and try again.'); return; }
    this.wifi.set(n.ssid); this.netNote.set(''); this.keyText = ''; this.check();
  }
  addLang() { if (this.langPick) { this.langs.update(l => [...l, this.langPick]); this.langPick = ''; this.check(); } }
  askUninstall(a: string) {
    this.menuApp.set(null);
    this.dialog.set({ title: a, text: 'This app and its related info will be uninstalled.', ok: () => { this.apps.update(x => x.filter(y => y !== a)); this.uninstalled.update(u => [...u, a]); this.check(); } });
  }
  checkUpdates() { this.checked = true; this.updateState.set('checking'); setTimeout(() => { this.updateState.set('available'); this.check(); }, 1200); this.check(); }
  install() {
    this.updateState.set('installing'); this.installPct.set(0);
    const tick = () => { this.installPct.update(p => p + 10); if (this.installPct() >= 100) this.updateState.set('restart'); else setTimeout(tick, 160); };
    setTimeout(tick, 160);
  }
  restart() { this.updateState.set('restarting'); setTimeout(() => { this.updateState.set('done'); this.check(); }, 1800); }
  scanPrinters() { this.scanning.set(true); this.found.set([]); setTimeout(() => { this.scanning.set(false); this.found.set(FOUND_PRINTERS); }, 1200); }
  addPrinter(p: string) { this.printers.update(x => [...x, p]); if (!this.defaultPrinter()) this.defaultPrinter.set(p); this.check(); }

  check() {
    const res = this.tasks().map(t => {
      const c = t.check;
      switch (c.type) {
        case 'wallpaper': return this.wallpaper() === c.value;
        case 'theme': return this.theme() === c.value;
        case 'brightnessMin': return this.brightness() >= c.value;
        case 'textScale': return this.textScale() === c.value;
        case 'nightLight': return this.nightLight();
        case 'wifiOn': return this.wifiOn();
        case 'wifi': return this.wifi() === c.ssid;
        case 'language': return this.langs().includes(c.value);
        case 'autoTime': return this.autoTime();
        case 'uninstalled': return this.uninstalled().includes(c.app);
        case 'notUninstalled': return !this.uninstalled().includes(c.app);
        case 'checkedUpdates': return this.checked;
        case 'updated': return this.updateState() === 'done';
        case 'printerAdded': return this.printers().includes(c.name);
        case 'printerDefault': return this.defaultPrinter() === c.name;
        default: return false;
      }
    });
    // "theme dark" then "theme light" are sequential: keep earlier ticks once earned
    this.results.update(prev => res.map((r, i) => r || (prev[i] === true && this.tasks()[i].check.type === 'theme')));
    const all = res.length > 0 && this.results().every(Boolean);
    this.allDone.set(all);
    if (all && !this.emitted) { this.emitted = true; this.completed.emit(); }
  }
}
