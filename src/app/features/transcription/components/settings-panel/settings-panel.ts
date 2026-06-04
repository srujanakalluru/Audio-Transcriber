import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  templateUrl: './settings-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPanel {
  readonly apiKey = model.required<string>();
  readonly showKey = model.required<boolean>();
  readonly hasSaved = input.required<boolean>();
  readonly keyChanged = input.required<boolean>();

  readonly save = output<void>();
  readonly clear = output<void>();

  onInput(value: string): void {
    this.apiKey.set(value);
  }

  toggleVisibility(): void {
    this.showKey.update(v => !v);
  }
}
