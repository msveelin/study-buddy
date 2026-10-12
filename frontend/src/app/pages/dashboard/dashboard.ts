import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { LearnerService } from '../../core/learner.service';
import { ProgressStore } from '../../core/progress.store';
import { KIND_ICON } from '../../core/models';
import { Icon, courseIcon } from '../../core/icon';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DecimalPipe, Icon],
  template: `
    <header class="head rise">
      <div>
        <p class="eyebrow">{{ greeting }}</p>
        <h1>{{ learner.current()?.name }} <app-icon name="hand" [size]="30" class="wave" /></h1>
      </div>
      @if (store.dash(); as d) {
        <div class="ring" [style.--p]="store.overall()">
          <span><b>{{ store.overall() }}%</b><small>overall</small></span>
        </div>
      }
    </header>

    @if (store.error()) { <div class="notice error">{{ store.error() }}</div> }

    @if (store.dash(); as d) {
      @if (d.nextLesson; as n) {
        <a class="continue rise" [routerLink]="['/lesson', n.slug]" data-tour="tour-continue">
          <div class="glow"></div>
          <div>
            <div class="eyebrow light">{{ d.lessonsCompleted === 0 ? 'Start here' : 'Continue where you left off' }}</div>
            <h2><app-icon [name]="icon(n.kind)" [size]="24" /> {{ n.title }}</h2>
            <div class="sub">{{ n.courseTitle }}</div>
          </div>
          <span class="go">Continue →</span>
        </a>
      } @else if (d.lessonsTotal > 0) {
        <div class="notice success"><app-icon name="party-popper" [size]="18" /> You have completed every lesson. Amazing work!</div>
      }

      <div class="stats rise">
        <div class="stat">
          <span class="ico ok"><app-icon name="circle-check" [size]="22" /></span>
          <div><b>{{ d.lessonsCompleted }}<small>/ {{ d.lessonsTotal }}</small></b><span>lessons done</span></div>
        </div>
        <div class="stat">
          <span class="ico zap"><app-icon name="zap" [size]="22" /></span>
          <div><b>{{ d.bestWpm ? (d.bestWpm | number:'1.0-0') : '–' }}</b><span>best speed (wpm)</span></div>
        </div>
        <div class="stat">
          <span class="ico tgt"><app-icon name="target" [size]="22" /></span>
          <div><b>{{ d.avgAccuracy ? (d.avgAccuracy | number:'1.0-0') + '%' : '–' }}</b><span>typing accuracy</span></div>
        </div>
        <div class="stat">
          <span class="ico key"><app-icon name="keyboard" [size]="22" /></span>
          <div><b>{{ d.typingAttempts }}</b><span>typing attempts</span></div>
        </div>
      </div>

      <a class="jog rise" routerLink="/practice">
        <span class="jog-ico"><app-icon name="layers" [size]="26" /></span>
        <div class="jog-body">
          <div class="eyebrow">Memory jog</div>
          <h3>
            @if (d.cardsDue > 0) { {{ d.cardsDue }} flashcard{{ d.cardsDue === 1 ? '' : 's' }} ready to review }
            @else if (d.practiceSessions > 0) { All flashcards reviewed. Try a quick quiz or an exercise! }
            @else { Flashcards, quizzes, tests and exercises to make it stick }
          </h3>
          <p class="muted">A few minutes of practice each day keeps what you learned fresh.</p>
        </div>
        <span class="go">Practise →</span>
      </a>
    }

    <h2 class="section">Your courses</h2>
    <div class="courses">
      @for (c of store.courses(); track c.slug; let i = $index) {
        <a class="course rise" [class]="'course rise accent-' + c.slug" [routerLink]="['/course', c.slug]">
          <div class="top">
            <span class="icon"><app-icon [name]="courseIcon(c)" [size]="26" /></span>
            <span class="num">Course {{ i + 1 }}</span>
          </div>
          <h3>{{ c.title }}</h3>
          <p class="muted">{{ c.description }}</p>
          <div class="foot">
            <div class="progress-bar"><span [style.width.%]="store.percent(c.slug)"></span></div>
            <span class="pct">{{ store.stat(c.slug)?.completed ?? 0 }} / {{ c.lessonCount }}</span>
          </div>
        </a>
      }
    </div>
  `,
  styles: `
    .head { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 22px; }
    .eyebrow { font-size: .8rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin: 0 0 2px; }
    .eyebrow.light { color: rgba(255,255,255,.75); }
    .ring { --p: 0; width: 96px; height: 96px; border-radius: 50%; display: grid; place-items: center; flex: none;
      background: conic-gradient(var(--primary) calc(var(--p) * 1%), var(--bg-deep) 0); }
    .ring span { width: 76px; height: 76px; border-radius: 50%; background: var(--surface); display: grid; place-items: center; text-align: center; line-height: 1; }
    .ring b { font-size: 1.15rem; display: block; }
    .ring small { font-size: .65rem; color: var(--muted); font-weight: 700; }

    .continue { position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
      padding: 26px 28px; border-radius: var(--radius); color: #fff; text-decoration: none; margin-bottom: 20px;
      background: linear-gradient(120deg, #4f46e5, #7c3aed 60%, #a855f7); box-shadow: var(--shadow-lg); }
    .continue .glow { position: absolute; width: 320px; height: 320px; border-radius: 50%; background: rgba(255,255,255,.14); right: -90px; top: -160px; }
    .continue h2 { margin: 4px 0; color: #fff; font-size: 1.5rem; }
    .continue .sub { opacity: .85; font-weight: 600; }
    .continue .go { background: #fff; color: var(--primary); padding: 10px 20px; border-radius: 999px; font-weight: 800; position: relative; }
    .continue:hover .go { transform: translateX(3px); }

    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px; margin-bottom: 30px; }
    .stat { display: flex; gap: 14px; align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 16px 18px; }
    .stat .ico { width: 44px; height: 44px; border-radius: 14px; background: var(--bg); display: grid; place-items: center; font-size: 1.3rem; flex: none; }
    .stat b { display: block; font-size: 1.5rem; line-height: 1.1; }
    .stat b small { font-size: .9rem; color: var(--muted); margin-left: 4px; }
    .stat span:last-child { color: var(--muted); font-size: .85rem; font-weight: 700; }

    .jog { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; padding: 18px 22px; margin-bottom: 30px; border-radius: var(--radius);
      background: var(--surface); border: 1px solid var(--border); border-left: 5px solid var(--warn); text-decoration: none; color: inherit; box-shadow: var(--shadow);
      transition: transform .18s, box-shadow .18s; }
    .jog:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
    .jog-ico { width: 54px; height: 54px; border-radius: 16px; background: var(--warn-soft); color: var(--warn); display: grid; place-items: center; flex: none; }
    .jog-body { flex: 1; min-width: 220px; }
    .jog h3 { margin: 2px 0 4px; }
    .jog p { margin: 0; font-size: .95rem; }
    .jog .go { background: var(--warn); color: #fff; padding: 10px 20px; border-radius: 999px; font-weight: 800; }
    .section { margin: 0 0 14px; }
    .courses { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 18px; }
    .course { display: flex; flex-direction: column; gap: 8px; padding: 22px; border-radius: var(--radius); background: var(--surface); border: 1px solid var(--border);
      text-decoration: none; color: inherit; box-shadow: var(--shadow); transition: transform .18s, box-shadow .18s; border-top: 5px solid var(--accent); }
    .course:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
    .top { display: flex; justify-content: space-between; align-items: center; }
    .icon { width: 50px; height: 50px; border-radius: 16px; background: var(--accent-soft); color: var(--accent); display: grid; place-items: center; }
    .wave { color: var(--warn); vertical-align: middle; }
    .stat .ico.ok { color: var(--success); } .stat .ico.zap { color: var(--warn); } .stat .ico.tgt { color: var(--danger); } .stat .ico.key { color: var(--primary); }
    .num { font-size: .75rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); }
    .course h3 { margin: 6px 0 0; }
    .course p { font-size: .95rem; flex: 1; }
    .foot { display: flex; align-items: center; gap: 12px; }
    .foot .progress-bar { flex: 1; }
    .pct { font-size: .85rem; font-weight: 800; color: var(--muted); }
  `,
})
export class DashboardPage implements OnInit {
  learner = inject(LearnerService);
  store = inject(ProgressStore);

  greeting = (() => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; })();

  ngOnInit() { this.store.refresh(); }

  icon = (kind: string) => (KIND_ICON as any)[kind] ?? 'book-open';
  courseIcon = courseIcon;
}
