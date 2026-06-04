import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card progress-wrap">
      <div class="progress-top">
        <div class="progress-pulse"></div>
        <span class="progress-msg">{{ statusText() }}</span>
        <span class="progress-pct">{{ progress() }}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-bar" [style.width.%]="progress()"></div>
      </div>
    </div>
  `,
})
export class ProgressCard {
  readonly statusText = input.required<string>();
  readonly progress = input.required<number>();
}
