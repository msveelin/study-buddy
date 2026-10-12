import { Component, computed, effect, input, output, signal } from '@angular/core';
import { Icon } from '../../core/icon';
import { FormsModule } from '@angular/forms';

export interface Mail { id: string; from: string; address: string; subject: string; body: string; date: string; unread?: boolean; }
export interface EmailData {
  account: string; contacts: { name: string; address: string }[]; files: string[]; inbox: Mail[];
  tasks: { instruction: string; check: any }[];
}
interface Msg extends Mail { folder: 'inbox' | 'spam' | 'bin' | 'sent'; starred: boolean; unread: boolean; attachments?: string[]; to?: string; }
interface Sent { to: string; subject: string; body: string; attachments: string[]; replyTo: string | null; }

@Component({
  selector: 'app-email-sim',
  imports: [FormsModule, Icon],
  template: `
    <div class="sim">
      <div class="card window mail">
        <div class="titlebar"><app-icon name="mail" [size]="16" /> Mail - {{ data().account }} <span class="dots"><span><app-icon name="minus" [size]="12" /></span><span><app-icon name="square" [size]="11" /></span><span><app-icon name="x" [size]="13" /></span></span></div>
        <div class="layout">
          <nav class="folders">
            <button class="primary new" (click)="compose()"><app-icon name="pencil" [size]="16" /> New email</button>
            @for (f of folders; track f.key) {
              <a [class.on]="folder() === f.key && view() !== 'compose'" (click)="openFolder(f.key)">
                <app-icon [name]="f.icon" [size]="16" /> {{ f.name }} @if (count(f.key); as n) { <small>{{ n }}</small> }
              </a>
            }
          </nav>

          <div class="list">
            @for (m of listed(); track m.id) {
              <div class="row" [class.unread]="m.unread" [class.on]="current()?.id === m.id" (click)="open(m)">
                <span class="star" [class.lit]="m.starred" (click)="toggleStar(m, $event)" title="Star"><app-icon name="star" [size]="16" [fill]="m.starred" /></span>
                <div class="who">{{ folder() === 'sent' ? 'To: ' + m.to : m.from }}</div>
                <div class="subj">{{ m.subject }} @if (m.attachments?.length) { <app-icon name="paperclip" [size]="14" /> }</div>
                <div class="date">{{ m.date }}</div>
              </div>
            } @empty {
              <p class="empty">Nothing here.</p>
            }
          </div>

          <div class="reading">
            @if (view() === 'compose') {
              <div class="compose">
                <h3>{{ draft.replyTo ? 'Reply' : 'New message' }}</h3>
                <label>To <input type="text" [(ngModel)]="draft.to" list="contacts" placeholder="name@example.com" autocomplete="off"></label>
                <datalist id="contacts">@for (c of data().contacts; track c.address) { <option [value]="c.address">{{ c.name }}</option> }</datalist>
                <label>Subject <input type="text" [(ngModel)]="draft.subject" placeholder="What is it about?"></label>
                <textarea [(ngModel)]="draft.body" placeholder="Write your message here…" rows="7"></textarea>
                <div class="attach">
                  @for (a of draft.attachments; track a) { <span class="chip"><app-icon name="paperclip" [size]="14" /> {{ a }} <button (click)="removeAttachment(a)" title="Remove">×</button></span> }
                  <div class="picker">
                    <button class="small" (click)="pickOpen.set(!pickOpen())"><app-icon name="paperclip" [size]="16" /> Attach</button>
                    @if (pickOpen()) {
                      <div class="ctx static">
                        <div class="hint">Pick a file from this computer:</div>
                        @for (f of data().files; track f) { <button (click)="attach(f)"><app-icon [name]="fileIcon(f)" [size]="16" /> {{ f }}</button> }
                      </div>
                    }
                  </div>
                </div>
                @if (note()) { <div class="notice warn">{{ note() }}</div> }
                <div class="row actions"><button class="primary" (click)="send()">Send <app-icon name="send" [size]="16" /></button><button (click)="discard()">Discard</button></div>
              </div>
            } @else if (current(); as m) {
              <div class="msg">
                <h3>{{ m.subject }}</h3>
                <div class="meta">
                  <span class="avatar">{{ m.from.charAt(0) }}</span>
                  <div><b>{{ m.from }}</b> <span class="addr">&lt;{{ m.address }}&gt;</span><br><small>{{ folder() === 'sent' ? 'To: ' + m.to : 'To: ' + data().account }} · {{ m.date }}</small></div>
                </div>
                <div class="actions row">
                  @if (folder() !== 'sent') {
                    <button (click)="reply(m)">↩ Reply</button>
                    <button (click)="toggleStar(m, $event)"><app-icon name="star" [size]="16" [fill]="m.starred" /> {{ m.starred ? 'Starred' : 'Star' }}</button>
                    @if (folder() !== 'spam') { <button (click)="spam(m)"><app-icon name="triangle-alert" [size]="16" /> Report spam</button> } @else { <button (click)="notSpam(m)"><app-icon name="check" [size]="16" /> Not spam</button> }
                    @if (folder() !== 'bin') { <button (click)="del(m)"><app-icon name="trash-2" [size]="16" /> Delete</button> }
                  }
                </div>
                <pre class="body">{{ m.body }}</pre>
                @if (m.attachments?.length) { <div class="attach">@for (a of m.attachments; track a) { <span class="chip"><app-icon name="paperclip" [size]="14" /> {{ a }}</span> }</div> }
              </div>
            } @else {
              <div class="empty big">Select an email to read it, or click <b>New email</b>.</div>
            }
          </div>
        </div>
        <div class="hint">Pretend email. Nothing is really sent.</div>
      </div>

      <aside class="card tasks">
        <h3>Tasks</h3>
        <ul class="checks">
          @for (t of data().tasks; track $index; let i = $index) {
            <li [class.ok]="results()[i]"><span class="mark">@if (results()[i]) { <app-icon name="check" [size]="14" /> } @else { {{ i + 1 }} }</span><span>{{ t.instruction }}</span></li>
          }
        </ul>
        @if (allDone()) { <div class="notice success"><app-icon name="party-popper" [size]="18" /> All tasks done!</div> }
        <button class="small" (click)="reset()">Start again</button>
      </aside>
    </div>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 150px 240px 1fr; min-height: 400px; }
    @media (max-width: 1000px) { .layout { grid-template-columns: 130px 1fr; } .reading { grid-column: 1 / -1; border-top: 1px solid #e3e6eb; } }
    .folders { border-right: 1px solid #e3e6eb; padding: 10px 8px; background: #fafbfc; display: flex; flex-direction: column; gap: 2px; }
    .new { margin-bottom: 10px; justify-content: center; padding: 8px 10px; font-size: .9rem; }
    .folders a { padding: 7px 10px; border-radius: 6px; cursor: pointer; font-size: .9rem; display: flex; justify-content: space-between; }
    .folders a:hover { background: #eef1f6; }
    .folders a.on { background: #dbe6f7; font-weight: 700; }
    .folders small { color: #555; }
    .list { border-right: 1px solid #e3e6eb; overflow: auto; max-height: 480px; background: #fff; }
    .row { display: grid; grid-template-columns: 22px 1fr auto; gap: 2px 8px; padding: 10px 10px; border-bottom: 1px solid #f0f0f0; cursor: pointer; font-size: .88rem; align-items: center; }
    .row:hover { background: #f5f7fa; }
    .row.on { background: #dbe6f7; }
    .row.unread .who, .row.unread .subj { font-weight: 800; }
    .row .who { grid-column: 2; }
    .row .date { grid-column: 3; color: #777; font-size: .75rem; }
    .row .subj { grid-column: 2 / 4; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .star { grid-row: span 2; color: #bbb; font-size: 1.1rem; }
    .star.lit { color: #e6a800; }
    .reading { padding: 18px 22px; background: #fff; color: #222; }
    .msg h3 { margin-bottom: 10px; }
    .meta { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--accent); color: #fff; display: grid; place-items: center; font-weight: 800; }
    .addr { color: #777; font-size: .9rem; }
    .actions { margin: 8px 0 14px; }
    .actions button { font-size: .85rem; padding: 6px 12px; }
    .body { white-space: pre-wrap; font-family: inherit; margin: 0; line-height: 1.55; }
    .compose label { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-weight: 700; }
    .compose input { flex: 1; border-radius: 8px; padding: 8px 12px; }
    .compose textarea { width: 100%; font: inherit; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 10px; resize: vertical; }
    .attach { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin: 8px 0; }
    .chip { background: #eef1f6; border-radius: 999px; padding: 3px 10px; font-size: .85rem; display: inline-flex; gap: 6px; align-items: center; }
    .chip button { border: none; background: none; padding: 0 2px; }
    .picker { position: relative; }
    .ctx.static { top: 36px; left: 0; }
    .empty { color: #777; padding: 20px; text-align: center; }
    .empty.big { padding: 80px 20px; }
  `,
})
export class EmailSim {
  data = input.required<EmailData>();
  completed = output<void>();

  folders = [
    { key: 'inbox', name: 'Inbox', icon: 'inbox' }, { key: 'starred', name: 'Starred', icon: 'star' },
    { key: 'sent', name: 'Sent', icon: 'send' }, { key: 'spam', name: 'Spam', icon: 'triangle-alert' }, { key: 'bin', name: 'Bin', icon: 'trash-2' },
  ];
  msgs = signal<Msg[]>([]);
  folder = signal<string>('inbox');
  current = signal<Msg | null>(null);
  view = signal<'read' | 'compose'>('read');
  draft: { to: string; subject: string; body: string; attachments: string[]; replyTo: string | null } = this.blank();
  pickOpen = signal(false);
  note = signal('');
  results = signal<boolean[]>([]);
  allDone = signal(false);
  private sent: Sent[] = [];
  private opened = new Set<string>();
  private emitted = false;

  listed = computed(() => {
    const f = this.folder();
    return this.msgs().filter(m => f === 'starred' ? m.starred && m.folder !== 'bin' : m.folder === f);
  });

  constructor() { effect(() => { this.data(); queueMicrotask(() => this.reset()); }); }

  reset() {
    this.msgs.set(this.data().inbox.map(m => ({ ...m, folder: 'inbox', starred: false, unread: m.unread ?? true })));
    this.folder.set('inbox'); this.current.set(null); this.view.set('read'); this.draft = this.blank();
    this.sent = []; this.opened.clear(); this.emitted = false; this.note.set('');
    this.check();
  }
  private blank() { return { to: '', subject: '', body: '', attachments: [] as string[], replyTo: null as string | null }; }
  count(key: string) { return key === 'inbox' ? this.msgs().filter(m => m.folder === 'inbox' && m.unread).length : key === 'sent' || key === 'starred' ? 0 : this.msgs().filter(m => m.folder === key).length; }
  fileIcon(f: string) { return /\.(jpg|png)$/i.test(f) ? 'file-image' : /\.docx$/i.test(f) ? 'file-text' : 'file'; }

  openFolder(key: string) { this.folder.set(key); this.current.set(null); this.view.set('read'); }
  open(m: Msg) { m.unread = false; this.msgs.update(a => [...a]); this.current.set(m); this.view.set('read'); this.opened.add(m.id); this.check(); }
  toggleStar(m: Msg, e: Event) { e.stopPropagation(); m.starred = !m.starred; this.msgs.update(a => [...a]); this.check(); }
  private move(m: Msg, folder: Msg['folder']) { m.folder = folder; this.msgs.update(a => [...a]); this.current.set(null); this.check(); }
  spam(m: Msg) { this.move(m, 'spam'); }
  notSpam(m: Msg) { this.move(m, 'inbox'); }
  del(m: Msg) { this.move(m, 'bin'); }

  compose() { this.draft = this.blank(); this.view.set('compose'); this.note.set(''); this.pickOpen.set(false); }
  reply(m: Msg) {
    this.draft = { to: m.address, subject: (m.subject.startsWith('Re:') ? '' : 'Re: ') + m.subject, body: `\n\n---- On ${m.date}, ${m.from} wrote:\n${m.body}`, attachments: [], replyTo: m.id };
    this.view.set('compose'); this.note.set(''); this.pickOpen.set(false);
    setTimeout(() => { const ta = document.querySelector('.compose textarea') as HTMLTextAreaElement; ta?.focus(); ta?.setSelectionRange(0, 0); });
  }
  attach(f: string) { if (!this.draft.attachments.includes(f)) this.draft.attachments = [...this.draft.attachments, f]; this.pickOpen.set(false); }
  removeAttachment(f: string) { this.draft.attachments = this.draft.attachments.filter(x => x !== f); }
  discard() { this.view.set('read'); this.draft = this.blank(); }
  send() {
    const to = this.draft.to.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) { this.note.set('The To box needs an email address, like name@example.com (no spaces).'); return; }
    if (!this.draft.subject.trim()) { this.note.set('Add a subject so the reader knows what the email is about.'); return; }
    if (!this.draft.body.trim()) { this.note.set('The message is empty. Write something first.'); return; }
    const ownText = this.draft.body.split('---- On ')[0];
    this.sent.push({ to, subject: this.draft.subject, body: ownText, attachments: [...this.draft.attachments], replyTo: this.draft.replyTo });
    const contact = this.data().contacts.find(c => c.address === to);
    this.msgs.update(a => [{ id: 'sent' + a.length, from: 'Me', address: this.data().account, to: contact ? `${contact.name}` : to, subject: this.draft.subject, body: this.draft.body, date: 'Just now', folder: 'sent', starred: false, unread: false, attachments: [...this.draft.attachments] }, ...a]);
    this.view.set('read'); this.draft = this.blank(); this.note.set('');
    this.folder.set('sent'); this.current.set(this.msgs()[0]);
    this.check();
  }

  check() {
    const res = this.data().tasks.map(t => {
      const c = t.check;
      switch (c.type) {
        case 'sent': return this.sent.some(s =>
          (!c.to || s.to === String(c.to).toLowerCase()) &&
          (!c.replyTo || s.replyTo === c.replyTo) &&
          (!c.subjectIncludes || s.subject.toLowerCase().includes(String(c.subjectIncludes).toLowerCase())) &&
          (!c.bodyIncludes || s.body.toLowerCase().includes(String(c.bodyIncludes).toLowerCase())) &&
          (!c.minWords || s.body.trim().split(/\s+/).filter(Boolean).length >= c.minWords) &&
          (!c.attachment || s.attachments.includes(c.attachment)));
        case 'opened': return this.opened.has(c.id);
        case 'spam': return this.msgs().find(m => m.id === c.id)?.folder === 'spam';
        case 'notSpam': { const m = this.msgs().find(m => m.id === c.id); return !!m && m.folder !== 'spam' && m.folder !== 'bin'; }
        case 'deleted': return this.msgs().find(m => m.id === c.id)?.folder === 'bin';
        case 'starred': return !!this.msgs().find(m => m.id === c.id)?.starred;
        default: return false;
      }
    });
    this.results.set(res);
    const all = res.length > 0 && res.every(Boolean);
    this.allDone.set(all);
    if (all && !this.emitted) { this.emitted = true; this.completed.emit(); }
  }
}
