'use client';

import { usePortfolioView } from '@/components/PortfolioViewContext';

export function PortfolioViewControls() {
  const { view, setView } = usePortfolioView();

  return (
    <>
      <button
        type="button"
        className={`view-toggle-btn${view === 'grid' ? ' active' : ''}`}
        data-view="grid"
        title="그리드뷰"
        aria-label="그리드뷰"
        onClick={() => setView('grid')}
      >
        <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z" />
        </svg>
      </button>
      <button
        type="button"
        className={`view-toggle-btn${view === 'text' ? ' active' : ''}`}
        data-view="text"
        title="텍스트뷰"
        aria-label="텍스트뷰"
        onClick={() => setView('text')}
      >
        <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 4v3h5.5v12h3V7H19V4H5z" />
        </svg>
      </button>
    </>
  );
}
