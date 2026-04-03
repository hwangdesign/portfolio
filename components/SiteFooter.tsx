'use client';

import { useCallback, useEffect } from 'react';
import { applyProjectPageBackground } from '@/lib/projectBackground';

export function SiteFooter() {
  useEffect(() => {
    function syncLines(theme: string) {
      const lineColor = theme === 'light' ? 'rgba(0, 0, 0, 0.14)' : 'rgba(255, 215, 0, 0.38)';
      document.querySelectorAll('.background-line').forEach((line) => {
        (line as HTMLElement).style.background = lineColor;
        (line as HTMLElement).style.opacity = '1';
      });
      document.querySelectorAll('.background-line-short').forEach((line) => {
        (line as HTMLElement).style.background = lineColor;
      });
    }

    const saved = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    syncLines(saved);
  }, []);

  const toggle = useCallback(() => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const lineColor = next === 'light' ? 'rgba(0, 0, 0, 0.14)' : 'rgba(255, 215, 0, 0.38)';
    document.querySelectorAll('.background-line').forEach((line) => {
      (line as HTMLElement).style.background = lineColor;
      (line as HTMLElement).style.opacity = '1';
    });
    document.querySelectorAll('.background-line-short').forEach((line) => {
      (line as HTMLElement).style.background = lineColor;
    });
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
