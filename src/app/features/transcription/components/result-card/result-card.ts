import { DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { secsToElapsed } from '../../time';
import type { SpeakerSlot, TranscriptResult } from '../../transcription.types';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [DecimalPipe, NgClass],
  templateUrl: './result-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultCard {
  readonly result = input.required<TranscriptResult>();
  readonly speakerAName = input.required<string>();
  readonly speakerBName = input.required<string>();

  readonly copyLabel = signal<string>('Copy');

  readonly secsToElapsed = secsToElapsed;

  /** Live display name from slot, using current name inputs. */
  speakerDisplayName = (slot: SpeakerSlot | undefined): string => {
    if (!slot) return '';
    return slot === 'A'
      ? (this.speakerAName().trim() || 'Speaker A')
      : (this.speakerBName().trim() || 'Speaker B');
  };

  /** Live transcript text: rebuilds whenever result or names change. */
  readonly fullTranscriptText = computed<string>(() => {
    const r = this.result();
    if (r.segments.length === 0) return r.text;
    const a = this.speakerAName().trim() || 'Speaker A';
    const b = this.speakerBName().trim() || 'Speaker B';
    return r.segments
      .map(seg => {
        const parts: string[] = [];
        if (r.options.timestamps) {
          parts.push(`[${secsToElapsed(seg.start)}]`);
        }
        if (r.options.pace && seg.pace) {
          parts.push(`[${seg.pace.wpm} wpm]`);
        }
        if (r.options.speakers && seg.speakerSlot) {
          parts.push(`${seg.speakerSlot === 'A' ? a : b}:`);
        }
        parts.push(seg.text.trim());
        return parts.join(' ');
      })
      .join('\n\n');
  });

  async copyTranscript(): Promise<void> {
    await navigator.clipboard.writeText(this.fullTranscriptText());
    this.copyLabel.set('Copied');
    setTimeout(() => this.copyLabel.set('Copy'), 2000);
  }

  trackByStart = (_: number, seg: { start: number }) => seg.start;
}
