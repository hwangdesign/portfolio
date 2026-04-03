'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'works', label: 'Works' },
  { id: 'labs', label: 'Labs' },
  { id: 'art', label: 'Arts' },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === '/' || pathname === '';
  const [open, setOpen] = useState(false);

  const base = isHome ? '' : '/';

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    document.body.classList.toggle('nav-mobile-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  return (
    <nav className="navbar">
      <div className="container">
        {isHome ? (
          <div className="nav-brand" id="navBrandAnimated">
            welcome to
          </div>
        ) : (
          <Link className="nav-brand" id="navBrandAnimated" href="/">
            welcome to
          </Link>
        )}
        <div className="nav-menu-wrapper">
          {SECTIONS.map((s) => (
            <Link key={s.id} href={`${base}#${s.id}`} className="nav-menu-item text-nav-menu">
              {s.label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          className="nav-hamburger"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
          id="navHamburger"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-hamburger-line" />
          <span className="nav-hamburger-line" />
          <span className="nav-hamburger-line" />
        </button>
        <div
          className={`nav-mobile-overlay${open ? ' is-open' : ''}`}
          id="navMobileOverlay"
          aria-hidden={!open}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="nav-mobile-overlay-panel">
            <button type="button" className="nav-mobile-close" aria-label="메뉴 닫기" id="navMobileClose" onClick={close}>
              <span className="nav-mobile-close-line" />
              <span className="nav-mobile-close-line" />
            </button>
            <nav className="nav-mobile-menu" aria-label="모바일 메뉴">
              {SECTIONS.map((s, index) => (
                <Link
                  key={s.id}
                  href={`${base}#${s.id}`}
                  className="nav-mobile-menu-item text-nav-menu"
                  data-index={index}
                  onClick={close}
                >
                  {s.id === 'art' ? (
                    <>
                      Arts<sup>(coming soon)</sup>
                    </>
                  ) : (
                    s.label
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
}
