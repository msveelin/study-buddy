import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

/** Renders lesson markdown (authored by us, so it is trusted) to HTML. */
@Pipe({ name: 'markdown' })
export class MarkdownPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';
    let html = marked.parse(value, { async: false, gfm: true, breaks: false }) as string;
    // External links open in a new tab so the learner never loses their place in the lesson.
    html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener"');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
