import { ChangeDetectionStrategy, Component, model, output, input } from '@angular/core';

@Component({
  selector: 'app-api-key-card',
  standalone: true,
  templateUrl: './api-key-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiKeyCard {
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
