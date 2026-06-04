import { signal, WritableSignal } from '@angular/core';

/** Returns a WritableSignal that mirrors a localStorage key. Empty/blank values are removed. */
export function persistedSignal(key: string, fallback = ''): WritableSignal<string> {
  const initial = (typeof window === 'undefined' ? null : localStorage.getItem(key)) ?? fallback;
  const s = signal<string>(initial);
  const originalSet = s.set;
  s.set = (v: string) => {
    originalSet.call(s, v);
    const trimmed = v.trim();
    if (trimmed) {
      localStorage.setItem(key, trimmed);
    } else {
      localStorage.removeItem(key);
    }
  };
  return s;
}

export function hasStoredValue(key: string): boolean {
  return typeof window !== 'undefined' && !!localStorage.getItem(key);
}
