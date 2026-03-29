# Works 신규·수정 체크리스트

## 현재 (Next.js · 권장)

1. **`content/projects/슬러그.md`** — 프론트매터(`title`, `slug`, `date`, `summary`, `thumbnail` 등) + Case Study 본문 (`CASE_STUDY_GUIDE.md`).
2. **`public/works/images/...`** — 썸네일·상세 이미지 (URL은 `/works/images/...`).
3. **`npm run build`** → **`out/`** 을 FTP 업로드.

홈·Works 그리드는 `content/projects/*.md` 메타데이터로 **`app/page.tsx`**에서 자동 나열됩니다.

---

## 레거시 HTML (`legacy/` 참고)

이전 순수 HTML 운영 시: 메인 순서는 **`legacy/assets/works-order.js`** 한 곳에서 관리하고, `project-nav-config.js`는 자동 생성됩니다.

### 메인 라인에 작업 추가 (구 방식)

1. **`legacy/assets/works-order.js`** — `main` 배열에 한 줄 추가.
2. **`legacy/index.html`** — `#portfolioGrid`에 카드 추가.
3. **`legacy/works/프로젝트.html`** — 상세 페이지.
4. **`legacy/works/images/...`** — 에셋.
5. 스크립트: **`works-order.js` → `project-nav-config.js` → `script.js`**, `#project-nav-root` 포함.

## 분기 / Labs (레거시 HTML)

- **`legacy/assets/works-order.js`** — `branches`·`labs` 조정 (구조 동일).
- 페이지·그리드: `legacy/index.html` 등.

## 빠른 점검 (레거시)

| 항목 | 위치 |
|------|------|
| 이전/다음 순서 | `legacy/assets/works-order.js` |
| 그리드 노출 | `legacy/index.html` |
| 네비 | `#project-nav-root` + 스크립트 순서 (위 참고) |

---

**메인 라인**(레거시 네비)은 `back-to-basics` → … → `wedding` 순입니다.  
**분기**는 `design-system` → `pdp-ux` … → `ooah-luxury` → `ooah` (`works-order.js` 주석).
