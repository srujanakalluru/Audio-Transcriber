import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-error-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card error-wrap">
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" class="err-icon">
        <path d="M7.5 2L14 13H1L7.5 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M7.5 6.5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="7.5" cy="11" r="0.7" fill="currentColor"/>
      </svg>
      <span>{{ message() }}</span>
    </div>
  `,
})
export class ErrorCard {
  readonly message = input.required<string>();
}
