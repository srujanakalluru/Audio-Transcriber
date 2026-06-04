export interface TranscribeOptions {
  // Groq/Whisper has no native diarization; we simulate by alternating speakers on silence gaps.
  speakers: boolean;
  timestamps: boolean;
  pace: boolean;
}

export interface Segment {
  start: number;
  end: number;
  text: string;
  speakerSlot?: 'A' | 'B';
  pace?: { label: 'slow' | 'normal' | 'fast'; wpm: number };
}

export interface TranscriptResult {
  text: string;
  segments: Segment[];
  options: TranscribeOptions;
}

export type SpeakerSlot = 'A' | 'B';
export type TranscriptionStatus = 'idle' | 'decoding' | 'transcribing' | 'done' | 'error';
