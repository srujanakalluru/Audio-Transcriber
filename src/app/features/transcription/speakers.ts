import { SPEAKER_FLIP_GAP_SEC } from './transcription.config';
import type { Segment, SpeakerSlot } from './transcription.types';

/** Single-pass slot assignment: silence gap > threshold flips between A and B. O(N). */
export function assignSpeakerSlots(segments: Segment[]): SpeakerSlot[] {
  const slots: SpeakerSlot[] = [];
  let current: SpeakerSlot = 'A';
  for (let i = 0; i < segments.length; i++) {
    if (i > 0 && segments[i].start - segments[i - 1].end > SPEAKER_FLIP_GAP_SEC) {
      current = current === 'A' ? 'B' : 'A';
    }
    slots.push(current);
  }
  return slots;
}
