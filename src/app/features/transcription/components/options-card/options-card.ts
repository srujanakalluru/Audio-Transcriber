import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import type { TranscribeOptions } from '../../transcription.types';

@Component({
  selector: 'app-options-card',
  standalone: true,
  templateUrl: './options-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsCard {
  readonly options = model.required<TranscribeOptions>();
  readonly speakerAName = model.required<string>();
  readonly speakerBName = model.required<string>();

  toggleOption(key: keyof TranscribeOptions): void {
    this.options.update(o => ({ ...o, [key]: !o[key] }));
  }

  setNameA(v: string): void { this.speakerAName.set(v); }
  setNameB(v: string): void { this.speakerBName.set(v); }
}
