import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { ThemeInit } from '@/components/ThemeInit';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { ProjectDetailEffects } from '@/components/ProjectDetailEffects';
import { DeferredPretendard } from '@/components/DeferredPretendard';

const pretendardHref =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css';

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
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <noscript>
          <link rel="stylesheet" href={pretendardHref} crossOrigin="anonymous" />
        </noscript>
        <link rel="icon" href={iconHref} type="image/svg+xml" />
        <meta name="color-scheme" content="light" />
      </head>
      <body>
        <Script
          id="theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        <DeferredPretendard href={pretendardHref} />
        <ThemeInit />
        <ProjectDetailEffects />
        <SiteNav />
        {children}
        <SiteFooter />
        <Script src={interactionsSrc} strategy="afterInteractive" />
      </body>
    </html>
  );
}
