import { PACE_FAST_MIN, PACE_SLOW_MAX } from './transcription.config';
import type { Segment } from './transcription.types';

export function getPace(seg: Segment): { label: 'slow' | 'normal' | 'fast'; wpm: number } {
  const duration = seg.end - seg.start;
  if (duration <= 0) return { label: 'normal', wpm: 0 };
  const words = seg.text.trim().split(/\s+/).length;
  const wpm = (words / duration) * 60;
  if (wpm < PACE_SLOW_MAX) return { label: 'slow', wpm: Math.round(wpm) };
  if (wpm > PACE_FAST_MIN) return { label: 'fast', wpm: Math.round(wpm) };
  return { label: 'normal', wpm: Math.round(wpm) };
}
