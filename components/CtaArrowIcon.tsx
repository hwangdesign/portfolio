/** CTA 버튼용 화살표 — Material Symbols 대신 인라인 SVG로 전역 아이콘 폰트 로드 제거 */
export function CtaArrowIcon() {
  return (
    <svg
      className="icon-svg btn-cta__icon"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="currentColor" d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
    </svg>
  );
}
