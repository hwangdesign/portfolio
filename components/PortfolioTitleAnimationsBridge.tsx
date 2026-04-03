'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function runPortfolioTitleSetup() {
  const w = window as Window & {
    portfolioSetupAnimatedSectionTitles?: () => void;
    portfolioRebuildBackgroundLines?: () => void;
  };
  if (typeof w.portfolioSetupAnimatedSectionTitles === 'function') {
    w.portfolioSetupAnimatedSectionTitles();
  }
  requestAnimationFrame(() => {
    if (typeof w.portfolioRebuildBackgroundLines === 'function') {
      w.portfolioRebuildBackgroundLines();
    }
    window.dispatchEvent(new Event('resize'));
  });
}

/**
 * portfolio-interactions.js의 섹션 타이틀 IO·스크램블·이모지 박스는 DOMContentLoaded가
 * 하이드레이션보다 빠를 수 있어, 라우트 변경 후·스크립트 지연 로드까지 여러 번 재시도합니다.
 */
export function PortfolioTitleAnimationsBridge() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (!cancelled) runPortfolioTitleSetup();
    };
    run();
    const delays = [0, 80, 200, 450, 900, 1600];
    const ids = delays.map((ms) => window.setTimeout(run, ms));
    return () => {
      cancelled = true;
      ids.forEach((id) => window.clearTimeout(id));
    };
  }, [pathname]);

  return null;
}
