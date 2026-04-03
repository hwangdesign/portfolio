'use client';

import { useEffect } from 'react';

export function ThemeInit() {
  useEffect(() => {
    function getSystemTheme() {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    }
    const saved = localStorage.getItem('theme') || getSystemTheme();
    document.documentElement.setAttribute('data-theme', saved);
  }, []);
  return null;
}
