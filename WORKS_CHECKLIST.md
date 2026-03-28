# Works 신규·수정 체크리스트

메인 작업 순서와 이전/다음 네비는 **`assets/works-order.js`** 한 곳에서 관리합니다.  
`project-nav-config.js`는 수정하지 않습니다(자동 생성).

---

## 메인 라인에 작업 추가 (그리드에 노출)

1. **`assets/works-order.js`** — `main` 배열에 `{ file, title }` 한 줄 추가 (원하는 순서).
2. **`index.html`** — `#portfolioGrid`에 카드 블록 추가 (`href`, 썸네일, 제목, `data-date`).
3. **`works/프로젝트.html`** — 상세 페이지 작성.
4. **`works/images/프로젝트폴더/`** — `thumbnail` 등 에셋.
5. 상세 HTML 하단 스크립트: **`works-order.js` → `project-nav-config.js` → `script.js`** 순서, 본문에 `<div id="project-nav-root"></div>` 포함.

## 분기 라인만 있는 페이지 (그리드 없음)

- **`works-order.js`** — `branches`에 시리즈를 추가하거나, 기존 `items` / `entryPrev` / `exitNext`만 조정.
- 메인 `main` 배열에는 넣지 않습니다.

## Labs 추가

1. **`works-order.js`** — `labs` 배열에 `{ file, title }` 추가.
2. **`index.html`** — `#labsGrid` 카드 추가.
3. 랩 상세 HTML에 네비 스크립트 순서 동일.

## 빠른 점검

| 항목 | 위치 |
|------|------|
| 이전/다음 순서 | `assets/works-order.js` |
| 그리드 노출 | `index.html` (수동) |
| 네비 DOM 슬롯 | 상세 페이지 `#project-nav-root` |
| 스크립트 순서 | `works-order.js` → `project-nav-config.js` → `script.js` |

---

**메인 라인**은 `back-to-basics` → … → `wedding` 순입니다.  
**분기**는 `design-system`에서 `pdp-ux`로 갈라져 `ooah-luxury` 후 다시 `ooah`로 합류합니다 (`works-order.js` 주석 참고).
