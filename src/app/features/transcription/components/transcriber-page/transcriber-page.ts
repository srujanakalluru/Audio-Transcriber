import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { persistedSignal, hasStoredValue } from '../../../../core/storage';
import { ThemeToggle } from '../../../../shared/theme-toggle/theme-toggle';
import { API_KEY_STORAGE } from '../../transcription.config';
import { TranscriptionService } from '../../transcription.service';
import type { TranscribeOptions } from '../../transcription.types';
import { ApiKeyCard } from '../api-key-card/api-key-card';
import { ErrorCard } from '../error-card/error-card';
import { FileDropCard } from '../file-drop-card/file-drop-card';
import { OptionsCard } from '../options-card/options-card';
import { ProgressCard } from '../progress-card/progress-card';
import { ResultCard } from '../result-card/result-card';
import { SettingsPanel } from '../settings-panel/settings-panel';

@Component({
  selector: 'app-transcriber-page',
  standalone: true,
  imports: [
    ThemeToggle,
    ApiKeyCard,
    SettingsPanel,
    FileDropCard,
    OptionsCard,
    ProgressCard,
    ErrorCard,
    ResultCard,
  ],
  templateUrl: './transcriber-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranscriberPage {
  private readonly tx = inject(TranscriptionService);

  // Persisted API key
  private readonly savedKey = persistedSignal(API_KEY_STORAGE, '');
  readonly apiKey = signal<string>(this.savedKey());
  readonly showKey = signal<boolean>(false);
  readonly hasSaved = signal<boolean>(hasStoredValue(API_KEY_STORAGE));
  readonly keyChanged = computed(() => this.apiKey().trim() !== this.savedKey());

  // Other UI state
  readonly showSettings = signal<boolean>(false);
  readonly selectedFile = signal<File | null>(null);
  readonly options = signal<TranscribeOptions>({
    speakers: false,
    timestamps: false,
    pace: false,
  });
  readonly speakerAName = signal<string>('');
  readonly speakerBName = signal<string>('');

  // Surfaced service signals
  readonly status = this.tx.status;
  readonly statusText = this.tx.statusText;
  readonly progress = this.tx.progress;
  readonly errorMessage = this.tx.errorMessage;
  readonly result = this.tx.result;

  readonly isReady = computed(() => !!this.apiKey().trim() && !!this.selectedFile());
  readonly isProcessing = computed(() => {
    const s = this.status();
    return s === 'decoding' || s === 'transcribing';
  });

  toggleSettings(): void {
    this.showSettings.update(v => !v);
  }

  saveKey(): void {
    this.savedKey.set(this.apiKey());
    this.hasSaved.set(hasStoredValue(API_KEY_STORAGE));
  }

  clearKey(): void {
    this.savedKey.set('');
    this.apiKey.set('');
    this.hasSaved.set(false);
  }

  async startTranscription(): Promise<void> {
    const key = this.apiKey().trim();
    const file = this.selectedFile();
    if (!key || !file || this.isProcessing()) return;
    if (this.keyChanged()) this.saveKey();
    await this.tx.transcribe(key, file, this.options());
  }
}
