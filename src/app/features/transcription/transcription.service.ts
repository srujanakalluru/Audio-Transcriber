import { Injectable, signal } from '@angular/core';
import { decodeToMono, encodeWAV } from '../../shared/audio/audio';
import { getPace } from './pace';
import { assignSpeakerSlots } from './speakers';
import {
  GROQ_MODEL,
  GROQ_TRANSCRIPTION_URL,
  MAX_SAMPLES_PER_CHUNK,
  SAMPLE_RATE,
} from './transcription.config';
import type {
  Segment,
  TranscribeOptions,
  TranscriptResult,
  TranscriptionStatus,
} from './transcription.types';

@Injectable({ providedIn: 'root' })
export class TranscriptionService {
  readonly status = signal<TranscriptionStatus>('idle');
  readonly statusText = signal<string>('');
  readonly progress = signal<number>(0);
  readonly errorMessage = signal<string>('');
  readonly result = signal<TranscriptResult | null>(null);

  /** Orchestrates: decode → chunk → call Groq per chunk → enrich segments with speakers + pace. */
  async transcribe(apiKey: string, file: File, options: TranscribeOptions): Promise<void> {
    this.status.set('decoding');
    this.statusText.set('Decoding audio...');
    this.progress.set(10);
    this.errorMessage.set('');
    this.result.set(null);

    try {
      const monoData = await decodeToMono(file, SAMPLE_RATE);
      const totalChunks = Math.ceil(monoData.length / MAX_SAMPLES_PER_CHUNK);

      this.status.set('transcribing');
      this.statusText.set(
        `Split into ${totalChunks} chunk${totalChunks > 1 ? 's' : ''}. Starting transcription...`
      );
      this.progress.set(20);

      const allSegments: Segment[] = [];
      const textParts: string[] = [];

      for (let i = 0; i < totalChunks; i++) {
        const start = i * MAX_SAMPLES_PER_CHUNK;
        const end = Math.min(start + MAX_SAMPLES_PER_CHUNK, monoData.length);
        const chunk = monoData.slice(start, end);
        const chunkOffsetSecs = start / SAMPLE_RATE;
        const progress = 20 + Math.round((i / totalChunks) * 75);

        this.statusText.set(`Transcribing chunk ${i + 1} of ${totalChunks}...`);
        this.progress.set(progress);

        const chunkResult = await this.transcribeChunk(apiKey, chunk, i);
        textParts.push(chunkResult.text);

        for (const seg of chunkResult.segments) {
          allSegments.push({
            ...seg,
            start: seg.start + chunkOffsetSecs,
            end: seg.end + chunkOffsetSecs,
          });
        }
      }

      // Pace is always computed; only rendered when options.pace is true.
      const slots = options.speakers ? assignSpeakerSlots(allSegments) : null;
      const enrichedSegments: Segment[] = allSegments.map((seg, idx) => ({
        ...seg,
        speakerSlot: slots?.[idx],
        pace: getPace(seg),
      }));

      this.progress.set(100);
      this.statusText.set('Done!');
      this.result.set({ text: textParts.join(' '), segments: enrichedSegments, options });
      this.status.set('done');
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : String(err));
      this.status.set('error');
    }
  }

  reset(): void {
    this.status.set('idle');
    this.statusText.set('');
    this.progress.set(0);
    this.errorMessage.set('');
    this.result.set(null);
  }

  private async transcribeChunk(
    apiKey: string,
    samples: Float32Array,
    index: number,
  ): Promise<{ text: string; segments: Segment[] }> {
    const wavBuffer = encodeWAV(samples, SAMPLE_RATE);
    const chunkFile = new File([wavBuffer], `chunk_${index}.wav`, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('file', chunkFile, chunkFile.name);
    formData.append('model', GROQ_MODEL);
    formData.append('response_format', 'verbose_json');

    const res = await fetch(GROQ_TRANSCRIPTION_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    if (!res.ok) {
      let errMsg = `Chunk ${index + 1} failed (HTTP ${res.status})`;
      try {
        const errBody = await res.json();
        errMsg = (errBody as { error?: { message?: string } }).error?.message || JSON.stringify(errBody);
      } catch {
        // body wasn't JSON
      }
      throw new Error(errMsg);
    }

    const data = (await res.json()) as { text?: string; segments?: Segment[] };
    return { text: data.text || '', segments: data.segments || [] };
  }
}
