import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { LearnerService } from '../../core/learner.service';
import { PrefsService } from '../../core/prefs.service';
import { Course, Learner } from '../../core/models';
import { Icon, courseIcon } from '../../core/icon';

const FALLBACK_COURSES: Pick<Course, 'slug' | 'title'>[] = [
  { slug: 'computer', title: 'Using the Computer' }, { slug: 'mouse', title: 'The Mouse' }, { slug: 'typing', title: 'Keyboard & Touch Typing' },
  { slug: 'files', title: 'Files & Folders' }, { slug: 'internet', title: 'The Internet & Email' }, { slug: 'settings', title: 'Settings' },
  { slug: 'word', title: 'Microsoft Word' }, { slug: 'excel', title: 'Microsoft Excel' }, { slug: 'programming', title: 'Introduction to Programming' },
  { slug: 'webdev', title: 'Web Development' },
];

@Component({
  selector: 'app-welcome',
  imports: [FormsModule, RouterLink, Icon],
  template: `
    <header class="top rise">
      <div class="brand"><span class="logo"><app-icon name="graduation-cap" [size]="22" /></span> Study Buddy</div>
      <nav>
        <a routerLink="/help"><app-icon name="life-buoy" [size]="16" /> Help & Glossary</a>
        <label class="toggle">
          <input type="checkbox" [checked]="prefs.bigText()" (change)="prefs.setBigText($any($event.target).checked)">
          Bigger text
        </label>
      </nav>
    </header>

    <section class="hero">
      <div class="copy rise">
        <span class="pill"><app-icon name="sparkles" [size]="14" /> Free · Works offline · Saves on this computer</span>
        <h1>Learn the computer,<br><em>one small step at a time.</em></h1>
        <p class="lead">
          Ten friendly courses that start with switching the computer on and end with you building your own web page.
          No experience needed. Stop whenever you like and pick up exactly where you left off.
        </p>

        <form (ngSubmit)="create()" class="start">
          <label for="name">New here? Type your name to begin</label>
          <div class="field">
            <app-icon name="user-round" [size]="18" class="in-ico" />
            <input id="name" type="text" [(ngModel)]="name" name="name" placeholder="Your name" autocomplete="off" required aria-label="Your name">
            <button class="primary" type="submit" [disabled]="!name.trim() || busy()">Start learning <app-icon name="arrow-right" [size]="18" /></button>
          </div>
          <small class="muted">No password, no email address. Just your name.</small>
        </form>
        @if (error()) { <div class="notice error">{{ error() }}</div> }

        <div class="returning">
          <span class="muted">Been here before?</span>
          @if (loading()) {
            <span class="muted">Loading…</span>
          } @else if (learners().length === 0) {
            <span class="muted">No learners yet.</span>
          } @else {
            @for (l of learners(); track l.id) {
              <button class="person" (click)="pick(l)">
                <span class="avatar">{{ l.name.charAt(0).toUpperCase() }}</span>{{ l.name }}
              </button>
            }
          }
        </div>
      </div>

      <aside class="roadmap rise">
        <div class="rm-head">
          <app-icon name="route" [size]="18" />
          <span>Your learning path</span>
        </div>
        <ol>
          @for (c of courses(); track c.slug; let i = $index) {
            <li [class]="'accent-' + c.slug">
              <span class="n">{{ i + 1 }}</span>
              <span class="ic"><app-icon [name]="icon(c.slug)" [size]="18" /></span>
              <span class="t">{{ c.title }}</span>
            </li>
          }
        </ol>
        <div class="rm-foot muted"><app-icon name="clock" [size]="14" /> A few minutes a day is enough.</div>
      </aside>
    </section>

    <section class="how">
      <div class="step rise">
        <span class="ic accent-typing"><app-icon name="book-open" [size]="22" /></span>
        <h3>Read a short lesson</h3>
        <p class="muted">Plain words, big text, and a Read aloud button if you prefer to listen.</p>
      </div>
      <div class="step rise">
        <span class="ic accent-programming"><app-icon name="mouse-pointer-click" [size]="22" /></span>
        <h3>Practise for real</h3>
        <p class="muted">Built-in copies of the keyboard, Word, Excel, File Explorer and a web page editor tick off each task as you do it.</p>
      </div>
      <div class="step rise">
        <span class="ic accent-webdev"><app-icon name="save" [size]="22" /></span>
        <h3>Progress saves itself</h3>
        <p class="muted">Close the browser any time. When you come back, press Continue and carry on.</p>
      </div>
    </section>

    <section class="card first rise">
      <div class="first-head">
        <span class="ic"><app-icon name="sprout" [size]="22" /></span>
        <div>
          <h2>First time on a computer?</h2>
          <p class="muted">Here is how to start, step by step. Take it slowly.</p>
        </div>
      </div>
      <ol>
        <li>Move the <b>mouse</b> on the desk. Watch the little arrow move on the screen. That arrow is the <b>pointer</b>.</li>
        <li>Move the pointer onto the white box above that says <b>Your name</b>, and press the <b>left mouse button</b> once. A blinking line appears in the box.</li>
        <li>On the <b>keyboard</b>, press the letters of your name, one at a time.</li>
        <li>Move the pointer onto the blue button that says <b>Start learning</b> and press the left mouse button once.</li>
      </ol>
      <p class="muted">If this is hard, ask someone to do these four steps with you. After that, the lessons teach everything else.</p>
    </section>

    <footer class="foot muted">
      <app-icon name="shield-check" [size]="14" /> Everything stays on this computer. No internet account is needed.
    </footer>
  `,
  styles: `
    :host { display: block; max-width: 1080px; margin: 0 auto; }
    .top { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; margin-bottom: 36px; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 900; font-size: 1.2rem; }
    .logo { width: 38px; height: 38px; border-radius: 12px; background: var(--primary); color: #fff; display: grid; place-items: center; }
    .top nav { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .top nav a { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; text-decoration: none; padding: 8px 14px; border-radius: 999px; }
    .top nav a:hover { background: var(--primary-soft); }
    .toggle { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; padding: 7px 14px; border: 1.5px solid var(--border); border-radius: 999px; background: var(--surface); font-weight: 700; font-size: .95rem; }
    .toggle input { width: 18px; height: 18px; accent-color: var(--primary); }

    .hero { display: grid; grid-template-columns: 1.25fr .85fr; gap: 36px; align-items: start; margin-bottom: 44px; }
    .pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 999px; background: var(--primary-soft); color: var(--primary-ink); font-weight: 800; font-size: .85rem; margin-bottom: 18px; }
    h1 { font-size: 3rem; line-height: 1.08; margin-bottom: 16px; letter-spacing: -.02em; }
    h1 em { font-style: normal; color: var(--primary); }
    .lead { font-size: 1.15rem; max-width: 560px; margin-bottom: 26px; }

    .start label { display: block; font-weight: 800; margin-bottom: 8px; }
    .field { position: relative; display: flex; gap: 8px; align-items: center; background: var(--surface); border: 1.5px solid var(--border); border-radius: 999px; padding: 6px 6px 6px 16px; box-shadow: var(--shadow); max-width: 560px; }
    .field:focus-within { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-soft); }
    .field .in-ico { color: var(--muted); }
    .field input { flex: 1; min-width: 120px; border: none; background: none; padding: 10px 6px; font-size: 1.05rem; }
    .field input:focus { outline: none; }
    .field button { white-space: nowrap; }
    .start small { display: block; margin-top: 8px; }

    .returning { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 26px; }
    .person { padding: 6px 14px 6px 6px; }
    .avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), #8b5cf6); color: #fff; display: grid; place-items: center; font-size: .85rem; }

    .roadmap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-lg); padding: 20px 22px; }
    .rm-head { display: flex; align-items: center; gap: 8px; font-weight: 900; margin-bottom: 10px; color: var(--primary); }
    .roadmap ol { list-style: none; padding: 0; margin: 0; position: relative; }
    .roadmap ol::before { content: ''; position: absolute; left: 13px; top: 14px; bottom: 14px; width: 2px; background: var(--border); }
    .roadmap li { display: flex; align-items: center; gap: 12px; padding: 7px 0; position: relative; }
    .roadmap .n { width: 28px; height: 28px; border-radius: 50%; background: var(--surface); border: 2px solid var(--accent); color: var(--accent); display: grid; place-items: center; font-size: .75rem; font-weight: 900; flex: none; position: relative; }
    .roadmap .ic { width: 34px; height: 34px; border-radius: 10px; background: var(--accent-soft); color: var(--accent); display: grid; place-items: center; flex: none; }
    .roadmap .t { font-weight: 800; font-size: .95rem; }
    .rm-foot { display: flex; align-items: center; gap: 6px; margin-top: 12px; font-size: .85rem; font-weight: 700; }

    .how { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin-bottom: 28px; }
    .step { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 22px; box-shadow: var(--shadow); }
    .step .ic { width: 46px; height: 46px; border-radius: 14px; background: var(--accent-soft); color: var(--accent); display: grid; place-items: center; margin-bottom: 12px; }
    .step h3 { margin-bottom: 6px; }
    .step p { margin: 0; font-size: .95rem; }

    .first { background: var(--success-soft); border-color: #bfe7cb; }
    .first-head { display: flex; gap: 14px; align-items: flex-start; }
    .first-head .ic { width: 46px; height: 46px; border-radius: 14px; background: #fff; color: var(--success); display: grid; place-items: center; flex: none; }
    .first-head h2 { margin-bottom: 2px; }
    .first ol { padding-left: 1.3em; font-size: 1.08rem; }
    .first li { margin-bottom: .5em; }
    .foot { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 30px; font-size: .9rem; font-weight: 700; }

    @media (max-width: 860px) {
      .hero { grid-template-columns: 1fr; }
      h1 { font-size: 2.2rem; }
      .field { flex-wrap: wrap; border-radius: 22px; }
      .field button { width: 100%; justify-content: center; }
    }
  `,
})
export class WelcomePage implements OnInit {
  private api = inject(ApiService);
  private learnerService = inject(LearnerService);
  private router = inject(Router);
  prefs = inject(PrefsService);

  name = '';
  learners = signal<Learner[]>([]);
  courses = signal<Pick<Course, 'slug' | 'title'>[]>(FALLBACK_COURSES);
  loading = signal(true);
  busy = signal(false);
  error = signal('');
  icon = courseIcon;

  async ngOnInit() {
    if (this.learnerService.current()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    try {
      const [learners, courses] = await Promise.all([this.api.learners(), this.api.courses()]);
      this.learners.set(learners);
      if (courses.length) this.courses.set(courses);
    } catch {
      this.error.set('Cannot reach the server. Make sure the backend (Django) and MySQL are running.');
    } finally {
      this.loading.set(false);
    }
  }

  async create() {
    if (!this.name.trim()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      const learner = await this.api.createLearner(this.name.trim());
      this.pick(learner);
    } catch (e: any) {
      this.error.set('Could not create the learner. Is the backend running? ' + (e?.message ?? ''));
    } finally {
      this.busy.set(false);
    }
  }

  pick(learner: Learner) {
    this.learnerService.set(learner);
    this.router.navigate(['/dashboard']);
  }
}
