import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '황선윤 — 포트폴리오',
  description: 'Creative Director · Portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="/assets/styles.css" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <header className="next-site-header">
          <div className="container">
            <nav className="next-nav" aria-label="주요 메뉴">
              <Link href="/">홈</Link>
              <Link href="/projects/">Works</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="next-site-footer">
          <div className="container">
            <p>© hwangdesign — portfolio</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
