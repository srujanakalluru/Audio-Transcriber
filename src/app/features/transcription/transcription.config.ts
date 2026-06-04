export const API_KEY_STORAGE = 'audio-transcriber-api-key';

export const GROQ_TRANSCRIPTION_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
export const GROQ_MODEL = 'whisper-large-v3-turbo';

export const SAMPLE_RATE = 16000;
export const MAX_SAMPLES_PER_CHUNK = SAMPLE_RATE * 60 * 9; // 9-min chunks

export const SPEAKER_FLIP_GAP_SEC = 0.8;

export const PACE_SLOW_MAX = 90;
export const PACE_FAST_MIN = 160;
