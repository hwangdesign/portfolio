'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type View = 'grid' | 'text';

const PortfolioViewContext = createContext<{
  view: View;
  setView: (v: View) => void;
} | null>(null);

export function PortfolioViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setViewState] = useState<View>('grid');

  useEffect(() => {
    const s = localStorage.getItem('portfolioView') as View | null;
    if (s === 'grid' || s === 'text') {
      setViewState(s);
      applyDom(s);
    }
  }, []);

  const applyDom = useCallback((v: View) => {
    document.querySelectorAll('.portfolio-section .portfolio-grid').forEach((grid) => {
      if (v === 'text') grid.classList.add('text-view');
      else grid.classList.remove('text-view');
    });
    requestAnimationFrame(() => {
      const rebuild = (window as Window & { portfolioRebuildBackgroundLines?: () => void }).portfolioRebuildBackgroundLines;
      if (typeof rebuild === 'function') rebuild();
    });
  }, []);

  const setView = useCallback(
    (v: View) => {
      setViewState(v);
      localStorage.setItem('portfolioView', v);
      applyDom(v);
    },
    [applyDom]
  );

  return <PortfolioViewContext.Provider value={{ view, setView }}>{children}</PortfolioViewContext.Provider>;
}

export function usePortfolioView() {
  const ctx = useContext(PortfolioViewContext);
  if (!ctx) throw new Error('PortfolioViewProvider required');
  return ctx;
}
