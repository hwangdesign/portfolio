/**
 * 이전글/다음글 네비게이션 설정
 *
 * 수정 방법
 * - 텍스트·링크 변경: 아래에서 해당 페이지 키(예: 'works/ooah.html')를 찾아 prev/next만 수정
 * - title에 HTML 가능 (예: Mart<sup>Plus</sup>)
 * - 링크 없음(첫글/끝글): prev 또는 next를 null로 지정
 *
 * 새 페이지 추가
 * - 1) PROJECT_NAV_CONFIG에 새 키 추가 (예: 'works/새페이지.html')
 * - 2) 이전/다음이 되는 페이지의 config에서 href를 새 페이지로 수정
 * - 3) 해당 HTML에 <div id="project-nav-root"></div>와 assets/project-nav-config.js 스크립트 포함
 */
window.PROJECT_NAV_CONFIG = {
  /* ========== Works ========== */
  'works/new-project.html': {
    prev: null,
    next: { href: 'martplus.html', title: 'Mart<sup>Plus</sup>' }
  },
  'works/martplus.html': {
    prev: { href: 'new-project.html', title: '신규 프로젝트' },
    next: { href: '11kitiz-s2.html', title: '11Kitties<sup>Season 2</sup>' }
  },
  'works/11kitiz-s2.html': {
    prev: { href: 'martplus.html', title: 'Mart<sup>Plus</sup>' },
    next: { href: 'ootd.html', title: '#ootd' }
  },
  'works/ootd.html': {
    prev: { href: '11kitiz-s2.html', title: '11Kitties<sup>Season 2</sup>' },
    next: { href: 'design-system.html', title: 'Design System' }
  },
  'works/design-system.html': {
    prev: { href: 'ootd.html', title: '#ootd' },
    next: { href: 'ooah.html', title: 'OOAh' }
  },
  'works/ooah.html': {
    prev: { href: 'design-system.html', title: 'Design System' },
    next: { href: '11street-dx.html', title: '11STREET Design eXperience' }
  },
  'works/11street-dx.html': {
    prev: { href: 'ooah.html', title: 'OOAh' },
    next: { href: 'amazon-global-store.html', title: 'Amazon Global Store' }
  },
  'works/amazon-global-store.html': {
    prev: { href: '11street-dx.html', title: '11STREET Design eXperience' },
    next: { href: 'wedding.html', title: 'Wedding' }
  },
  'works/wedding.html': {
    prev: { href: 'amazon-global-store.html', title: 'Amazon Global Store' },
    next: null
  },
  'works/pdp-ux.html': {
    prev: { href: 'design-system.html', title: 'Design System' },
    next: { href: '11kitties.html', title: '11Kitties' }
  },
  'works/11kitties.html': {
    prev: { href: 'pdp-ux.html', title: 'PDP UX' },
    next: { href: 'ootd-fashion.html', title: '#OOTD Fashion' }
  },
  'works/ootd-fashion.html': {
    prev: { href: '11kitties.html', title: '11Kitties' },
    next: { href: 'ooah-luxury.html', title: 'OOAh Luxury' }
  },
  'works/ooah-luxury.html': {
    prev: { href: 'ootd-fashion.html', title: '#OOTD Fashion' },
    next: { href: 'ooah.html', title: 'OOAh' }
  },

  /* ========== Labs ========== */
  'labs/TrendingSearches.html': {
    prev: null,
    next: { href: 'InteractiveAnalogClock.html', title: 'Interactive Analog Clock' }
  },
  'labs/InteractiveAnalogClock.html': {
    prev: { href: 'TrendingSearches.html', title: 'Popular Shopping Keywords' },
    next: null
  },
};
