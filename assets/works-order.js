/**
 * Works / Labs 이전·다음 네비 단일 순서 (소스 오브 트루스)
 *
 * - main: 메인 Works 그리드 순서와 같게 유지 (index.html #portfolioGrid 카드 순서)
 * - branches: 그리드에 없는 분기 시리즈. entryPrev / exitNext 로 메인 라인과 연결
 * - labs: Labs 그리드 순서와 같게 유지
 *
 * 신규 메인 작업: main 배열에만 한 줄 추가 → project-nav-config.js가 prev/next 자동 생성
 * (index.html 카드는 아직 수동 추가 — WORKS_CHECKLIST.md 참고)
 */
window.WORKS_NAV_ORDER = {
  main: [
    { file: 'back-to-basics.html', title: 'Back_to_Basics' },
    { file: 'martplus.html', title: 'Mart<sup>Plus</sup>' },
    { file: '11kitiz-s2.html', title: '11Kitties<sup>Season 2</sup>' },
    { file: 'ootd.html', title: '#ootd' },
    { file: 'design-system.html', title: 'Design System' },
    { file: 'ooah.html', title: 'OOAh' },
    { file: '11street-dx.html', title: '11STREET Design eXperience' },
    { file: 'amazon-global-store.html', title: 'Amazon Global Store' },
    { file: 'wedding.html', title: 'Wedding' }
  ],

  /**
   * 분기 라인: 메인 그리드에 노출되지 않아도 네비만 연결되는 페이지들.
   * design-system에서 갈라져 pdp-ux → … → ooah-luxury → 다시 ooah(메인)로 합류.
   */
  branches: [
    {
      id: 'pdp-variant',
      entryPrev: { href: 'design-system.html', title: 'Design System' },
      exitNext: { href: 'ooah.html', title: 'OOAh' },
      items: [
        { file: 'pdp-ux.html', title: 'PDP UX' },
        { file: '11kitties.html', title: '11Kitties' },
        { file: 'ootd-fashion.html', title: '#OOTD Fashion' },
        { file: 'ooah-luxury.html', title: 'OOAh Luxury' }
      ]
    }
  ],

  labs: [
    { file: 'TrendingSearches.html', title: 'Popular Shopping Keywords' },
    { file: 'InteractiveAnalogClock.html', title: 'Interactive Analog Clock' }
  ]
};
