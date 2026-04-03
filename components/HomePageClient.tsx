'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PortfolioViewProvider } from '@/components/PortfolioViewContext';
import { PortfolioViewControls } from '@/components/PortfolioViewControls';
import type { HomeSiteConfig } from '@/lib/site';
import type { WorkEntry } from '@/lib/works';
import type { LabEntry } from '@/lib/labs';
import type { WorkFrontmatter, LabFrontmatter } from '@/lib/types';

function workThumb(m: WorkFrontmatter) {
  return m.thumbnail || `/images/works/${m.slug}/thumbnail.png`;
}

function labThumb(m: LabFrontmatter) {
  return m.thumbnail || `/images/labs/${m.slug}/thumbnail.png`;
}

/** /portfolio/ 등 서브패스 배포 시 사이트 내부 링크만 basePath 접두 */
function resolveSiteHref(href: string) {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  if (!href || !base) return href;
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) return href;
  return href.startsWith('/') ? `${base}${href}` : `${base}/${href}`;
}

type Props = {
  home: HomeSiteConfig;
  works: WorkEntry[];
  labs: LabEntry[];
};

export function HomePageClient({ home, works, labs }: Props) {
  /**
   * 플로팅: Works 상단이 스크린 최상단(고정 네비 하단)에 닿은 뒤부터,
   * Works+Labs 묶음(#portfolio-works-labs-zone)이 화면에 남아 있는 동안만 유지.
   */
  const [portfolioZoneInView, setPortfolioZoneInView] = useState(false);

  useEffect(() => {
    const works = document.getElementById('works');
    const zone = document.getElementById('portfolio-works-labs-zone');
    if (!works || !zone) return;

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const nav = document.querySelector('.navbar');
      const navH = nav instanceof HTMLElement ? nav.offsetHeight : 80;
      const edge = 12;
      const worksTop = works.getBoundingClientRect().top;
      const zoneBottom = zone.getBoundingClientRect().bottom;
      const worksHitTop = worksTop <= navH + edge;
      const stillInZone = zoneBottom > navH + edge;
      setPortfolioZoneInView(worksHitTop && stillInZone);
    };

    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (portfolioZoneInView) {
      document.body.classList.add('portfolio-floating-active');
    } else {
      document.body.classList.remove('portfolio-floating-active');
    }
    return () => {
      document.body.classList.remove('portfolio-floating-active');
    };
  }, [portfolioZoneInView]);

  useEffect(() => {
    const nav = document.querySelector('.navbar');
    const setNav = () => {
      const h = nav instanceof HTMLElement ? nav.offsetHeight : 80;
      document.documentElement.style.setProperty('--nav-height', `${h}px`);
    };
    setNav();
    window.addEventListener('resize', setNav);
    return () => window.removeEventListener('resize', setNav);
  }, []);

  return (
    <>
      <header className="hero" />
      <main className="main-content">
        <div className="divider" />
        <section id="about" className="section">
          <div className="container">
            <div className="hero-content">
              <h1 className="section-title animated-section-title" id="animatedTitle" data-title={home.heroTitle}>
                {home.heroTitle}
              </h1>
              <div className="hero-info-description">
                <p>
                  <span className="prefix-char">+</span> 이름 : {home.name}
                </p>
                <p>
                  <span className="prefix-char">+</span> 이메일 :{' '}
                  <a href={`mailto:${home.email}`}>{home.email}</a>
                </p>
              </div>
              <div className="hero__actions">
                {home.links.map((l) => (
                  <a
                    key={l.href + l.label}
                    href={resolveSiteHref(l.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-btn"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <PortfolioViewProvider>
          <div className="divider" />
          <div id="portfolio-works-labs-zone" className="portfolio-works-labs-zone">
            <section id="works" className="section portfolio-section">
              <div className="container">
                <div className="portfolio-header">
                  <h2 className="section-title animated-section-title" data-title="Works">
                    Works
                  </h2>
                  <div
                    className={`portfolio-view-toggle${portfolioZoneInView ? ' floating' : ''}`}
                  >
                    <PortfolioViewControls />
                  </div>
                </div>
                <div className="portfolio-grid" id="portfolioGrid">
                  {works.map((w, i) => (
                    <Link
                      key={w.slug}
                      href={`/works/${w.slug}/`}
                      className="portfolio-item"
                      data-date={w.meta.date}
                    >
                      <div className="portfolio-thumbnail">
                        <Image
                          src={workThumb(w.meta)}
                          alt={w.meta.title}
                          fill
                          sizes="(max-width: 768px) 100vw, min(600px, 100vw)"
                          className="portfolio-thumb-img"
                          unoptimized
                          priority={i === 0}
                        />
                      </div>
                      <div className="portfolio-info">
                        <div className="portfolio-title-wrapper">
                          {w.meta.titleHtml ? (
                            <h3
                              className="portfolio-title section-title animated-section-title"
                              data-title={w.meta.title}
                              dangerouslySetInnerHTML={{ __html: w.meta.titleHtml }}
                            />
                          ) : (
                            <h3
                              className="portfolio-title section-title animated-section-title"
                              data-title={w.meta.title}
                            >
                              {w.meta.title}
                            </h3>
                          )}
                          <span className="portfolio-date">({w.meta.date})</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            <div className="divider" />
            <section id="labs" className="section portfolio-section">
              <div className="container">
                <div className="portfolio-header">
                  <h2 className="section-title animated-section-title" data-title="Labs">
                    Labs
                  </h2>
                  <div className="portfolio-view-toggle">
                    <PortfolioViewControls />
                  </div>
                </div>
                <div className="portfolio-grid" id="labsGrid">
                  {labs.map((lab) => (
                    <Link
                      key={lab.slug}
                      href={`/labs/${lab.slug}/`}
                      className="portfolio-item"
                      data-date={lab.meta.date}
                    >
                      <div className="portfolio-thumbnail">
                        <Image
                          src={labThumb(lab.meta)}
                          alt={lab.meta.title}
                          fill
                          sizes="(max-width: 768px) 100vw, min(600px, 100vw)"
                          className="portfolio-thumb-img"
                          unoptimized
                        />
                      </div>
                      <div className="portfolio-info">
                        <div className="portfolio-title-wrapper">
                          {lab.meta.titleHtml ? (
                            <h3
                              className="portfolio-title section-title animated-section-title"
                              data-title={lab.meta.title}
                              dangerouslySetInnerHTML={{ __html: lab.meta.titleHtml }}
                            />
                          ) : (
                            <h3
                              className="portfolio-title section-title animated-section-title"
                              data-title={lab.meta.title}
                            >
                              {lab.meta.title}
                            </h3>
                          )}
                          <span className="portfolio-date">({lab.meta.date})</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </PortfolioViewProvider>

        <div className="divider" />
        <section id="art" className="section portfolio-section">
          <div className="container">
            <div className="portfolio-header">
              <h2 className="section-title animated-section-title" data-title="Arts">
                Arts
              </h2>
            </div>
            <p className="hero-info-description">
              <span className="prefix-char">+</span> 갤러리는 준비 중이에요.{' '}
              <Link href="/art/">아카이브 페이지</Link>에서 곧 만나요.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
