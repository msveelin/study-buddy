import { Component, computed, input, output, signal } from '@angular/core';
import { Icon } from '../../core/icon';
import { DecimalPipe } from '@angular/common';

export interface Question { q: string; options: string[]; answer: number; explain?: string; }

@Component({
  selector: 'app-quiz',
  template: `
    <div class="card quiz">
      @for (q of questions(); track $index; let qi = $index) {
        <div class="q" [class.right]="submitted() && selected()[qi] === q.answer" [class.wrong]="submitted() && selected()[qi] !== q.answer">
          <h3>{{ qi + 1 }}. {{ q.q }}</h3>
          <div class="options">
            @for (o of q.options; track $index; let oi = $index) {
              <label [class.chosen]="selected()[qi] === oi" [class.correct]="submitted() && oi === q.answer">
                <input type="radio" [name]="'q' + qi" [checked]="selected()[qi] === oi" [disabled]="submitted()" (change)="choose(qi, oi)">
                {{ o }}
              </label>
            }
          </div>
          @if (submitted() && q.explain) {
            <p class="explain">@if (selected()[qi] === q.answer) { <app-icon name="check" [size]="16" [stroke]="3" /> } @else { <app-icon name="x" [size]="16" [stroke]="3" /> } {{ q.explain }}</p>
          }
        </div>
      }

      @if (!submitted()) {
        <button class="primary" (click)="submit()" [disabled]="!allAnswered()">Check my answers</button>
        @if (!allAnswered()) { <span class="muted"> Answer every question first.</span> }
      } @else {
        <div class="score" [class.pass]="score() >= passScore()">
          <strong>{{ score() | number:'1.0-0' }}%</strong> — {{ correctCount() }} of {{ questions().length }} correct.
          {{ score() >= passScore() ? 'Passed!' : 'You need ' + passScore() + '% to pass.' }}
          <button (click)="retry()">Try again</button>
        </div>
      }
    </div>
  `,
  styles: `
    .q { padding: 14px 0; border-bottom: 1px solid var(--border); }
    .q h3 { margin-bottom: 8px; }
    .options { display: grid; gap: 6px; }
    label { display: flex; gap: 10px; align-items: center; padding: 8px 12px; border: 1.5px solid var(--border); border-radius: 12px; cursor: pointer; font-weight: 600; }
    label:hover { background: var(--bg); }
    label.chosen { border-color: var(--accent); background: var(--accent-soft); }
    label.correct { border-color: var(--success); background: var(--success-soft); }
    .q.wrong label.chosen { border-color: var(--danger); background: var(--danger-soft); }
    .explain { margin: 10px 0 0; color: var(--muted); font-size: .95rem; }
    button { margin-top: 16px; }
    .score { margin-top: 16px; padding: 14px 18px; border-radius: 14px; background: var(--warn-soft); display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .score.pass { background: var(--success-soft); }
    .score strong { font-size: 1.4rem; }
    .score button { margin: 0 0 0 auto; }
  `,
  imports: [DecimalPipe, Icon],
})
export class Quiz {
  questions = input.required<Question[]>();
  passScore = input(70);
  finished = output<number>();

  selected = signal<(number | null)[]>([]);
  submitted = signal(false);

  allAnswered = computed(() => this.questions().every((_, i) => this.selected()[i] != null));
  correctCount = computed(() => this.questions().filter((q, i) => this.selected()[i] === q.answer).length);
  score = computed(() => this.questions().length ? (this.correctCount() / this.questions().length) * 100 : 0);

  choose(qi: number, oi: number) {
    this.selected.update(s => { const c = [...s]; c[qi] = oi; return c; });
  }

  submit() {
    this.submitted.set(true);
    this.finished.emit(Math.round(this.score()));
  }

  retry() {
    this.selected.set([]);
    this.submitted.set(false);
  }
}
