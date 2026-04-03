'use client';

import { useCallback, useEffect } from 'react';
import { applyProjectPageBackground } from '@/lib/projectBackground';

export function SiteFooter() {
  useEffect(() => {
    const rebuild = (window as Window & { portfolioRebuildBackgroundLines?: () => void }).portfolioRebuildBackgroundLines;
    if (typeof rebuild === 'function') {
      requestAnimationFrame(() => rebuild());
    }
  }, []);

  const toggle = useCallback(() => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const scheme = document.querySelector('meta[name="color-scheme"]');
    if (scheme) scheme.setAttribute('content', 'light');
    applyProjectPageBackground(next);
    window.dispatchEvent(new CustomEvent('portfolio-theme', { detail: { theme: next } }));
  }, []);

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <p>© hwangdesign — sweet home</p>
        <button type="button" className="theme-toggle" aria-label="테마 전환" id="themeToggle" onClick={toggle}>
          <span className="theme-icon-dark">🌙</span>
          <span className="theme-icon-light">☀️</span>
        </button>
      </div>
    </footer>
  );
}
