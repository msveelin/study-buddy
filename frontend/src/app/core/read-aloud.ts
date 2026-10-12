import { Component, OnDestroy, input, signal } from '@angular/core';
import { marked } from 'marked';
import { Icon } from './icon';

/** A "Read aloud" button that speaks lesson markdown using the browser's built-in voice. */
@Component({
  selector: 'app-read-aloud',
  imports: [Icon],
  template: `
    @if (supported) {
      <button class="small" [class.primary]="speaking()" (click)="toggle()" [attr.aria-pressed]="speaking()" title="Read this lesson aloud">
        @if (speaking()) { <app-icon name="square" [size]="14" [fill]="true" /> Stop reading } @else { <app-icon name="volume-2" [size]="16" /> Read aloud }
      </button>
    }
  `,
})
export class ReadAloud implements OnDestroy {
  text = input('');
  speaking = signal(false);
  supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  toggle() {
    if (this.speaking()) { this.stop(); return; }
    const plain = this.toPlain(this.text());
    if (!plain) return;
    const u = new SpeechSynthesisUtterance(plain);
    u.rate = 0.95;
    u.lang = 'en-GB';
    const voices = speechSynthesis.getVoices();
    const v = voices.find(x => x.lang === 'en-GB') ?? voices.find(x => x.lang.startsWith('en'));
    if (v) u.voice = v;
    u.onend = () => this.speaking.set(false);
    u.onerror = () => this.speaking.set(false);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    this.speaking.set(true);
  }

  stop() {
    if (this.supported) speechSynthesis.cancel();
    this.speaking.set(false);
  }

  private toPlain(md: string): string {
    const html = marked.parse(md, { async: false, gfm: true }) as string;
    const div = document.createElement('div');
    div.innerHTML = html;
    div.querySelectorAll('pre, code').forEach(el => el.replaceWith(' (code) '));
    div.querySelectorAll('th, td').forEach(el => el.append(document.createTextNode('. ')));
    div.querySelectorAll('li, p, h1, h2, h3, tr').forEach(el => el.append(document.createTextNode('\n')));
    return (div.textContent ?? '').replace(/[*_#>|]/g, ' ').replace(/\s+\n/g, '\n').replace(/[ \t]+/g, ' ').trim();
  }

  ngOnDestroy() { this.stop(); }
}
