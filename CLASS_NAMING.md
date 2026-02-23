# 클래스 네이밍 규칙 (Class Naming Convention)

수정·확장 시 일관된 클래스 이름을 사용하기 위한 가이드입니다.

**공통 에셋 (한 폴더 관리)**  
`assets/` — `styles.css`, `script.js`, `project-nav-config.js` 를 한 곳에서 관리합니다.

---

## 1. 규칙 요약

| 구분 | 패턴 | 예시 |
|------|------|------|
| **레이아웃** | 단일 이름 또는 `역할-이름` | `container`, `main-content`, `section`, `divider` |
| **블록(컴포넌트)** | `블록` 또는 `블록__요소` | `hero`, `hero__content`, `hero__actions` |
| **상태/뷰** | 블록에 추가 클래스 | `portfolio-grid` + `text-view`, `view-toggle-btn` + `active` |
| **유틸리티** | `종류-값` | `text-primary`, `font-title`, `bg-yellow` |
| **페이지 타입** | `역할-상세` | `project-detail-page` |

- **kebab-case**만 사용 (`sectionTitle` ❌ → `section-title` ✅)
- 블록 내부 요소는 `블록__요소` (이중 언더스코어)로 구분
- 외부 라이브러리 클래스는 유지 (예: `material-symbols-outlined`)

---

## 2. 블록별 클래스 목록

### 레이아웃
| 클래스 | 용도 |
|--------|------|
| `main-content` | 메인 콘텐츠 영역 |
| `container` | 최대 너비·패딩을 가진 콘텐츠 래퍼 |
| `section` | 섹션 래퍼 (padding 등) |
| `divider` | 섹션 구분선 |

### 네비게이션 (nav)
| 클래스 | 용도 |
|--------|------|
| `navbar` | 상단 네비게이션 |
| `nav-brand` | 로고/브랜드 영역 |
| `nav-menu-wrapper` | 메뉴 링크 래퍼 |
| `nav-menu-item` | 메뉴 링크 (About, Works, Labs) |
| `theme-toggle` | 다크/라이트 토글 버튼 |
| `theme-icon-dark`, `theme-icon-light` | 토글 아이콘 |

### 히어로 (hero)
| 클래스 | 용도 |
|--------|------|
| `hero` | 히어로 상단 영역 |
| `hero__content` | 히어로 텍스트·버튼 영역 |
| `hero-info-description` | 히어로 설명 문단 |
| `hero__actions` | CTA 버튼 그룹 래퍼 (기존 `hero-buttons`) |
| `hero-lottie` | 히어로 Lottie 영역 (있는 페이지) |

### CTA 버튼 (btn-cta)
| 클래스 | 용도 |
|--------|------|
| `btn-cta` | 주요 링크 버튼 (BRUNCH, RESUME, SITE 등) |
| `btn-cta__icon-wrap` | 버튼 내 아이콘 래퍼 |
| `btn-cta__icon` | Material 아이콘 (keyboard_arrow_right) |

### 섹션 공통
| 클래스 | 용도 |
|--------|------|
| `section-title` | 섹션 제목 (h1, h2) |
| `animated-section-title` | 애니메이션 적용 타이틀 |
| `section-title-box` | JS로 생성되는 타이틀 래퍼 |
| `section-title-box-emoji` | 타이틀 옆 이모지 |
| `section-body` | 본문 문단 영역 |
| `project-date` | 프로젝트 날짜 라벨 |
| `prefix-char` | 설명 앞 접두사 (+) |

### 포트폴리오 (목록)
| 클래스 | 용도 |
|--------|------|
| `portfolio-section` | Works/Labs 섹션 래퍼 |
| `portfolio-header` | 섹션 제목 + 뷰 토글 영역 |
| `portfolio-view-toggle` | 그리드/텍스트 뷰 토글 |
| `view-toggle-btn` | 토글 버튼 (data-view="grid" | "text") |
| `portfolio-grid` | 카드 그리드 컨테이너 |
| `text-view` | 텍스트 뷰일 때 grid에 추가 |
| `portfolio-item` | 카드 링크 (a) |
| `portfolio-thumbnail` | 썸네일 영역 |
| `portfolio-info` | 제목·날짜 영역 |
| `portfolio-title-wrapper` | 제목 + 날짜 한 줄 |
| `portfolio-title` | 프로젝트명 |
| `portfolio-date` | 날짜 (2025/05 등) |

### 프로젝트 상세 (project-*)
| 클래스 | 용도 |
|--------|------|
| `project-detail-page` | body에 지정 (상세 페이지 여부) |
| `hero-content-section` | 상세 페이지 히어로 섹션 |
| `project-details-section` | 본문 이미지·텍스트 섹션 |
| `project-details-content` | 이미지+section-body 리스트 |
| `project-image` | 프로젝트 이미지 공통 |
| `project-image-detail` | 1080x607 디테일 이미지 |
| `project-navigation-wrapper` | 이전/다음 네비 래퍼 |
| `project-navigation` | nav |
| `project-nav-link` | 이전/다음 링크 (prev, next, disabled) |
| `project-nav-label` | 화살표 라벨 (←←, →→) |
| `project-nav-title` | 이전/다음 프로젝트명 |

### 푸터
| 클래스 | 용도 |
|--------|------|
| `site-footer` | 푸터 |
| `site-footer-inner` | 푸터 내부 (container + 토글) |

### 이전글/다음글 (project-nav)
| 클래스 | 용도 |
|--------|------|
| `project-navigation-wrapper` | 네비 전체 래퍼 (스크립트로 주입) |
| `project-navigation` | nav |
| `project-nav-link` | 이전/다음 링크 (prev, next, disabled) |
| `project-nav-label` | 화살표 라벨 (←←, →→) |
| `project-nav-title` | 이전/다음 프로젝트명 |
| **설정** | **project-nav-config.js** 에서 href·title 일괄 관리 |

### 유틸리티 (색·폰트)
- **텍스트**: `text-primary`, `text-yellow`, `text-description`, `text-nav-menu` 등
- **폰트 크기**: `font-title`, `font-base`, `font-small` 등
- **배경**: `bg-yellow`, `bg-black` 등
- **테두리**: `border-white`, `border-yellow` 등

---

## 3. 새 클래스 추가 시

1. **어디에 속하는지** 정한 뒤 위 블록에 맞춰 이름 결정
2. **블록 내부 요소**면 `블록__요소` 사용 (예: `portfolio__card`)
3. **상태**는 별도 클래스로 추가 (예: `active`, `disabled`, `text-view`)
4. 이 문서의 해당 블록 목록에 한 줄 추가해 두기
