'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { applyProjectPageBackground, clearProjectPageBackgroundStyles } from '@/lib/projectBackground';

function isProjectDetailPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return /^\/(works|labs)\/[^/]+\/?$/.test(pathname);
}

export function ProjectDetailEffects() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isProjectDetailPath(pathname)) {
      clearProjectPageBackgroundStyles();
      return;
    }
    const run = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      applyProjectPageBackground(theme);
    };
    const t = window.setTimeout(run, 300);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const onTheme = () => {
      const t = document.documentElement.getAttribute('data-theme');
      applyProjectPageBackground(t);
    };
    window.addEventListener('portfolio-theme', onTheme);
    return () => window.removeEventListener('portfolio-theme', onTheme);
  }, []);

  return null;
}
