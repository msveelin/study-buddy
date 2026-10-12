import { Component, HostListener, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { LearnerService } from '../../core/learner.service';
import { ProgressStore } from '../../core/progress.store';
import { MarkdownPipe } from '../../core/markdown.pipe';
import { Flashcard } from '../../core/models';
import { Icon } from '../../core/icon';

/**
 * A flashcard review session. Cards are shown one at a time; "Not yet" sends the card to the back
 * of the queue (and to Leitner box 1 on the server), "Got it" moves it up a box.
 */
@Component({
  selector: 'app-flashcards',
  imports: [RouterLink, MarkdownPipe, Icon],
  template: `
    <a [routerLink]="['/practice', slug()]" class="back">← {{ courseTitle() }}</a>

    @if (error()) { <div class="notice error">{{ error() }}</div> }
    @else if (loading()) { <p class="muted">Loading cards…</p> }
    @else if (finished()) {
      <section class="card summary rise">
        <div class="big"><app-icon name="party-popper" [size]="56" /></div>
        <h1>Session complete</h1>
        <p class="lead">You knew <b>{{ knownFirstTry() }}</b> of <b>{{ total() }}</b> cards straight away.
          @if (lapsed().length) { <br>{{ lapsed().length }} card{{ lapsed().length === 1 ? '' : 's' }} needed another look and will come back tomorrow. }
          @else if (total() > 0) { <br>Every card moved up a box. Nice! }
        </p>
        <div class="stats">
          <div><b>{{ mastered() }}</b><small>mastered</small></div>
          <div><b>{{ seenCount() }}</b><small>of {{ allCount() }} seen</small></div>
          <div><b>{{ dueLeft() }}</b><small>still due</small></div>
        </div>
        @if (lapsed().length) {
          <details class="lapsed">
            <summary>Cards to look at again</summary>
            <ul>
              @for (c of lapsed(); track c.id) {
                <li><div class="f" [innerHTML]="c.front | markdown"></div><div class="b muted" [innerHTML]="c.back | markdown"></div></li>
              }
            </ul>
          </details>
        }
        <div class="row">
          @if (lapsed().length) { <button class="primary" (click)="restart(lapsed())">Go through the missed ones again</button> }
          <button [class.primary]="!lapsed().length" (click)="restart(allCards())">Review all {{ allCount() }} cards</button>
          <a class="btn" [routerLink]="['/practice', slug(), 'quiz']">Try a quick quiz →</a>
        </div>
      </section>
    }
    @else if (queue().length === 0) {
      <section class="card summary rise">
        <div class="big ok"><app-icon name="circle-check" [size]="56" /></div>
        <h1>All caught up</h1>
        <p class="lead">No cards are due right now. Come back tomorrow, or go through the whole deck anyway.</p>
        <div class="row">
          <button class="primary" (click)="restart(allCards())">Review all {{ allCount() }} cards</button>
          <a class="btn" [routerLink]="['/practice', slug(), 'quiz']">Try a quick quiz →</a>
        </div>
      </section>
    }
    @else {
      <div class="top">
        <div class="progress-bar"><span [style.width.%]="progress()"></span></div>
        <span class="muted count">{{ done() }} / {{ total() }}</span>
        <span class="badge" [class.done]="current()!.mastered">{{ boxLabel(current()!) }}</span>
      </div>

      <div class="scene" (click)="flip()">
        <div class="flashcard" [class.flipped]="flipped()">
          <div class="face front">
            <span class="hint">Question</span>
            <div class="text" [innerHTML]="current()!.front | markdown"></div>
            <span class="tap">Tap or press Space to flip</span>
          </div>
          <div class="face back">
            <span class="hint">Answer</span>
            <div class="text" [innerHTML]="current()!.back | markdown"></div>
          </div>
        </div>
      </div>

      <div class="controls" [class.show]="flipped()">
        @if (flipped()) {
          <button class="no" (click)="answer(false)" [disabled]="saving()"><app-icon name="x" [size]="18" [stroke]="3" /> Not yet <kbd>1</kbd></button>
          <button class="yes" (click)="answer(true)" [disabled]="saving()"><app-icon name="check" [size]="18" [stroke]="3" /> Got it <kbd>2</kbd></button>
        } @else {
          <button class="primary" (click)="flip()">Show answer</button>
        }
      </div>
      <p class="muted tip">Be honest: "Got it" only if you knew it before flipping. Missed cards return at the end of this session.</p>
    }
  `,
  styles: `
    .back { display: inline-block; margin-bottom: 14px; text-decoration: none; font-weight: 600; }
    .top { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
    .top .progress-bar { flex: 1; }
    .count { font-weight: 800; }

    .scene { perspective: 1400px; max-width: 720px; margin: 0 auto; cursor: pointer; }
    .flashcard { position: relative; width: 100%; min-height: 320px; transition: transform .55s cubic-bezier(.2,.8,.2,1); transform-style: preserve-3d; }
    .flashcard.flipped { transform: rotateY(180deg); }
    .face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
      padding: 34px 38px; border-radius: 24px; background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow-lg); text-align: center; }
    .face.back { transform: rotateY(180deg); background: linear-gradient(160deg, var(--accent-soft), var(--surface) 70%); border-color: var(--accent); }
    .hint { position: absolute; top: 16px; left: 22px; font-size: .72rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
    .back .hint { color: var(--accent); }
    .text { font-size: 1.35rem; font-weight: 700; line-height: 1.4; }
    .text ::ng-deep p { margin: 0 0 .4em; }
    .text ::ng-deep p:last-child { margin: 0; }
    .text ::ng-deep code { font-family: var(--mono); background: var(--bg-deep); padding: 2px 8px; border-radius: 8px; font-size: .9em; }
    .back .text { font-size: 1.15rem; font-weight: 600; }
    .tap { position: absolute; bottom: 16px; font-size: .8rem; color: var(--muted); font-weight: 700; }

    .controls { display: flex; justify-content: center; gap: 14px; margin: 26px auto 8px; min-height: 52px; }
    .controls button { font-size: 1.05rem; padding: 12px 26px; }
    .controls .no { border-color: var(--danger); color: var(--danger); background: var(--danger-soft); }
    .controls .yes { border-color: var(--success); color: #fff; background: var(--success); }
    kbd { font: inherit; font-size: .75rem; padding: 1px 7px; border-radius: 6px; background: rgba(0,0,0,.12); margin-left: 4px; }
    .tip { text-align: center; font-size: .9rem; }

    .summary { max-width: 720px; margin: 0 auto; text-align: center; }
    .summary .big { font-size: 3rem; }
    .lead { font-size: 1.1rem; }
    .stats { display: flex; justify-content: center; gap: 28px; margin: 18px 0 22px; }
    .stats div b { display: block; font-size: 1.8rem; color: var(--accent); line-height: 1; }
    .stats small { color: var(--muted); font-weight: 700; }
    .lapsed { text-align: left; margin-bottom: 20px; }
    .lapsed summary { cursor: pointer; font-weight: 800; }
    .lapsed ul { list-style: none; padding: 0; margin: 10px 0 0; }
    .lapsed li { padding: 10px 0; border-top: 1px dashed var(--border); }
    .lapsed .f { font-weight: 700; }
    .lapsed ::ng-deep p { margin: 0; }
    .row { justify-content: center; }
    .btn { text-decoration: none; }
  `,
})
export class FlashcardsPage implements OnInit {
  private api = inject(ApiService);
  private learner = inject(LearnerService);
  private route = inject(ActivatedRoute);
  private store = inject(ProgressStore);

  slug = signal('');
  allCards = signal<Flashcard[]>([]);
  queue = signal<Flashcard[]>([]);
  total = signal(0);
  done = signal(0);
  flipped = signal(false);
  finished = signal(false);
  loading = signal(true);
  saving = signal(false);
  error = signal('');
  knownFirstTry = signal(0);
  lapsed = signal<Flashcard[]>([]);
  private missedIds = new Set<string>();
  private startedAt = Date.now();

  current = computed(() => this.queue()[0] ?? null);
  progress = computed(() => this.total() ? (this.done() / this.total()) * 100 : 0);
  courseTitle = computed(() => this.store.practiceFor(this.slug())?.courseTitle ?? 'Practice');
  allCount = computed(() => this.allCards().length);
  seenCount = computed(() => this.allCards().filter(c => c.seen).length);
  mastered = computed(() => this.allCards().filter(c => c.mastered).length);
  dueLeft = computed(() => this.allCards().filter(c => c.isDue).length);

  ngOnInit() {
    this.route.paramMap.subscribe(pm => this.load(pm.get('slug')!));
  }

  private async load(slug: string) {
    this.slug.set(slug);
    this.loading.set(true);
    try {
      const all = await this.api.flashcards(this.learner.current()!.id, slug);
      this.allCards.set(all);
      const reviewAll = this.route.snapshot.queryParamMap.has('all');
      this.restart(reviewAll ? all : all.filter(c => c.isDue));
      if (!this.store.practice().length) this.store.refresh();
    } catch (e: any) {
      this.error.set('Could not load flashcards. ' + (e?.message ?? ''));
    } finally {
      this.loading.set(false);
    }
  }

  restart(cards: Flashcard[]) {
    this.queue.set([...cards]);
    this.total.set(cards.length);
    this.done.set(0);
    this.knownFirstTry.set(0);
    this.lapsed.set([]);
    this.missedIds.clear();
    this.flipped.set(false);
    this.finished.set(false);
    this.startedAt = Date.now();
  }

  flip() { if (this.current()) this.flipped.set(!this.flipped()); }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (!this.current() || this.finished() || (e.target as HTMLElement)?.tagName === 'INPUT') return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.flip(); }
    else if (this.flipped() && e.key === '1') this.answer(false);
    else if (this.flipped() && e.key === '2') this.answer(true);
  }

  async answer(known: boolean) {
    const card = this.current();
    if (!card || this.saving()) return;
    this.saving.set(true);
    try {
      const updated = await this.api.reviewCard(this.learner.current()!.id, card.id, known);
      this.allCards.update(list => list.map(c => c.id === card.id ? updated : c));
      const rest = this.queue().slice(1);
      if (known) {
        if (!this.missedIds.has(card.id)) this.knownFirstTry.update(n => n + 1);
        this.done.update(n => n + 1);
        this.queue.set(rest);
      } else {
        if (!this.missedIds.has(card.id)) { this.missedIds.add(card.id); this.lapsed.update(l => [...l, card]); }
        this.queue.set([...rest, updated]);
      }
      this.flipped.set(false);
      if (this.queue().length === 0) await this.finish();
    } catch (e: any) {
      this.error.set('Could not save your answer: ' + (e?.message ?? ''));
    } finally {
      this.saving.set(false);
    }
  }

  private async finish() {
    this.finished.set(true);
    const seconds = Math.round((Date.now() - this.startedAt) / 1000);
    try {
      await this.api.recordPractice(this.learner.current()!.id, this.slug(), 'flashcards', this.knownFirstTry(), this.total(), seconds);
    } catch { /* the card reviews are already saved; the session record is a bonus */ }
    this.store.refresh();
  }

  boxLabel(c: Flashcard) {
    if (!c.seen) return 'New card';
    if (c.mastered) return 'Mastered';
    return `Box ${c.box} of 5`;
  }
}
