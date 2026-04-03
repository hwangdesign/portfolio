'use client';

import { useEffect } from 'react';

type Props = {
  jsonPath: string;
  containerId?: string;
  bgImageId?: string;
};

/**
 * 11kitiz-s2 디테일 4: 배경 PNG 위 Lottie (기존 11kitiz-s2.html 인라인 스크립트와 동일)
 */
export function KittiesDetailLottie({
  jsonPath,
  containerId = 'detail-lottie-cat-heart',
  bgImageId = 'detail4-bg-img',
}: Props) {
  useEffect(() => {
    let destroyed = false;
    let anim: { destroy: () => void } | null = null;

    function init() {
      const detailEl = document.getElementById(containerId);
      if (!detailEl || destroyed) return;

      import('lottie-web').then((lottie) => {
        if (destroyed) return;
        detailEl.replaceChildren();
        const container = document.createElement('div');
        container.style.cssText =
          'position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;';
        detailEl.appendChild(container);

        fetch(jsonPath)
          .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
          .then((data) => {
            if (destroyed) return;
            anim = lottie.default.loadAnimation({
              container,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              animationData: data,
            });
          })
          .catch((e) => {
            console.warn('Detail4 Lottie load failed:', e);
          });
      });
    }

    const bgImg = document.getElementById(bgImageId) as HTMLImageElement | null;
    if (bgImg && bgImg.complete) {
      setTimeout(init, 0);
    } else if (bgImg) {
      const onLoad = () => {
        bgImg.removeEventListener('load', onLoad);
        bgImg.removeEventListener('error', onErr);
        setTimeout(init, 0);
      };
      const onErr = () => {
        bgImg.removeEventListener('load', onLoad);
        bgImg.removeEventListener('error', onErr);
        setTimeout(init, 0);
      };
      bgImg.addEventListener('load', onLoad);
      bgImg.addEventListener('error', onErr);
    } else {
      setTimeout(init, 300);
    }

    return () => {
      destroyed = true;
      anim?.destroy();
    };
  }, [jsonPath, containerId, bgImageId]);

  return null;
}
