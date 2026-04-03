'use client';

/**
 * Pretendard는 CDN 서브셋 CSS를 print 미디어로 먼저 받아 파싱을 지연시키고,
 * 로드 후 all로 전환해 초기 렌더를 막지 않습니다. (noscript는 layout head에서 동기 로드)
 */
export function DeferredPretendard({ href }: { href: string }) {
  return (
    <link
      rel="stylesheet"
      href={href}
      crossOrigin="anonymous"
      media="print"
      onLoad={(e) => {
        (e.currentTarget as HTMLLinkElement).media = 'all';
      }}
    />
  );
}
