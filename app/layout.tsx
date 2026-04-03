import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { ThemeInit } from '@/components/ThemeInit';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { ProjectDetailEffects } from '@/components/ProjectDetailEffects';
import { PortfolioTitleAnimationsBridge } from '@/components/PortfolioTitleAnimationsBridge';

export const metadata: Metadata = {
  title: '황선윤__포트폴리오',
  description: '황선윤_포트폴리오',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

const staticBase = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const iconHref = staticBase ? `${staticBase}/favicon.svg` : '/favicon.svg';
  const interactionsSrc = staticBase ? `${staticBase}/portfolio-interactions.js` : '/portfolio-interactions.js';

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
        <link rel="icon" href={iconHref} type="image/svg+xml" />
        <meta name="color-scheme" content="light" />
      </head>
      <body>
        <ThemeInit />
        <ProjectDetailEffects />
        <PortfolioTitleAnimationsBridge />
        <SiteNav />
        {children}
        <SiteFooter />
        <Script src={interactionsSrc} strategy="afterInteractive" />
      </body>
    </html>
  );
}
