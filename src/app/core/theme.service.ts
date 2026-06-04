import { effect, Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'audio-transcriber-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal<boolean>(this.loadInitial());

  constructor() {
    effect(() => this.apply(this.isDark()));
  }

  toggle(): void {
    this.isDark.update(v => !v);
    localStorage.setItem(STORAGE_KEY, this.isDark() ? 'dark' : 'light');
  }

  private loadInitial(): boolean {
    return localStorage.getItem(STORAGE_KEY) === 'dark';
  }

  private apply(dark: boolean): void {
    const root = document.documentElement;
    if (dark) root.classList.add('dark-theme');
    else root.classList.remove('dark-theme');
  }
}
