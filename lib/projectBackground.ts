/**
 * 프로젝트 상세 페이지 body 배경은 전역과 동일하게 흰색 고정.
 */

function setThemeColorMeta(color: string) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
}

/** 인덱스·비프로젝트 페이지: 이전 프로젝트에서 남은 body 배경·CSS 변수 제거 */
export function clearProjectPageBackgroundStyles() {
  if (typeof document === 'undefined') return;
  document.body.style.removeProperty('--project-bg-color');
  document.body.style.removeProperty('background-color');
  setThemeColorMeta('#ffffff');
}

export function applyProjectPageBackground(_theme: string | null | undefined) {
  if (typeof document === 'undefined') return;
  if (!document.body.classList.contains('project-detail-page')) return;
  document.body.style.removeProperty('--project-bg-color');
  document.body.style.removeProperty('background-color');
  setThemeColorMeta('#ffffff');
}
