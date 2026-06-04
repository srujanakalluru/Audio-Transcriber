# Audio Transcriber

Browser-based audio transcription powered by Groq's Whisper Large v3 Turbo. Upload an audio or video file and get a transcript with optional speaker labels, timestamps, and per-segment pace.

Live at [srujanakalluru.github.io/Audio-Transcriber](https://srujanakalluru.github.io/Audio-Transcriber/).

## Features

- Drag-and-drop or click-to-browse file upload (any audio or video format the browser can decode)
- Optional speaker labels (A and B) with editable custom names that update live in the output
- Optional elapsed timestamp and duration per segment
- Optional words-per-minute pace classification (slow / normal / fast)
- Copy full transcript to clipboard, honoring active option toggles and custom speaker names
- Dark and light themes

## Prerequisites

- Node.js 18.19 or newer
- A Groq API key from [console.groq.com](https://console.groq.com)

## Running locally

```
npm install
npm start
```

Opens on [http://localhost:4200](http://localhost:4200).

Paste your API key in the API Key card (or the Settings panel). The key is stored in browser localStorage under `audio-transcriber-api-key` and is only sent to Groq's API.

## Building

```
npm run build
```

Output is written to `dist/`.

## Configuration

Tunable values in `src/app/features/transcription/transcription.config.ts`:

| Constant | Default | Meaning |
|---|---|---|
| `API_KEY_STORAGE` | `'audio-transcriber-api-key'` | localStorage key |
| `GROQ_TRANSCRIPTION_URL` | Groq's endpoint URL | API endpoint |
| `GROQ_MODEL` | `whisper-large-v3-turbo` | Model name |
| `SAMPLE_RATE` | `16000` | Mono target sample rate |
| `MAX_SAMPLES_PER_CHUNK` | `SAMPLE_RATE * 60 * 9` | Chunk size (9 minutes) |
| `SPEAKER_FLIP_GAP_SEC` | `0.8` | Silence threshold that flips speaker A and B |
| `PACE_SLOW_MAX` | `90` | WPM upper bound for "slow" |
| `PACE_FAST_MIN` | `160` | WPM lower bound for "fast" |

## Limitations

- Speaker detection uses a silence-gap heuristic, not true diarization. Overlapping speech and rapid turn-taking will be misclassified.
- Rate limits and pricing are governed by your Groq account.