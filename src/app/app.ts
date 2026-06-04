import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranscriberPage } from './features/transcription/components/transcriber-page/transcriber-page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TranscriberPage],
  template: '<app-transcriber-page />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
