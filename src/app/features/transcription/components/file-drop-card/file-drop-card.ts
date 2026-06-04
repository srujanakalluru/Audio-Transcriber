import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';
import { formatBytes } from '../../../../shared/audio/audio';

@Component({
  selector: 'app-file-drop-card',
  standalone: true,
  templateUrl: './file-drop-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDropCard {
  readonly selectedFile = model.required<File | null>();

  readonly isDragOver = signal<boolean>(false);
  readonly formatBytes = formatBytes;

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver.set(false);
    const f = e.dataTransfer?.files[0];
    if (f) this.selectedFile.set(f);
  }

  onFileSelect(e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) this.selectedFile.set(f);
  }

  remove(): void {
    this.selectedFile.set(null);
  }
}
