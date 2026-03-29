# 웹FTP 유지 전제의 Next.js 포트폴리오 운영 지침서

## Static Export 기반 운영 구조 + Cursor 실행 가이드

---

## 1. 목적

현재 사용 중인 웹FTP 호스팅 환경은 Node.js 런타임 기반의 Next.js 서버를 직접 실행하기 어렵다.

따라서 포트폴리오 사이트는 **Next.js로 개발하되, 배포는 정적 파일 형태로 export하여 웹FTP로 업로드하는 방식**으로 운영한다.

---

## 2. 보수적 운영의 위치 (웹FTP + static export)

**웹FTP 유지 + Next.js static export**는 가능한 조합 가운데 **가장 보수적인** 쪽에 해당한다.

- **개발**: Next.js
- **배포**: `next build`로 생성한 **`out` 폴더**를 FTP로 업로드

| 장점 | 단점 |
|------|------|
| 기존 운영 환경(호스팅·도메인·업로드 방식)을 **거의 바꾸지 않아도** 된다 | PR **프리뷰**, **자동 배포**, **브랜치별 배포** 같은 현대적 운영 흐름은 **상대적으로 약하다** |

---

## 3. 운영 전략

- 개발: Next.js
- 콘텐츠: Markdown
- 배포: Static Export
- 업로드: 웹FTP

---

## 4. 전체 흐름

Markdown 작성 → Next.js 렌더링 → **`npm run build`** → **`out/`** 폴더 생성 → FTP 업로드

로컬 확인: `npm run dev` (개발 서버는 FTP와 무관)

---

## 5. next.config.js 설정

```js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
}

module.exports = nextConfig
```

---

## 6. 폴더 구조

```text
portfolio/
├─ app/
│  ├─ page.tsx
│  └─ projects/
│     ├─ page.tsx
│     └─ [slug]/page.tsx
├─ content/
│  └─ projects/
│     └─ martplus.md
├─ lib/
│  └─ projects.ts
├─ types/
│  └─ project.ts
├─ public/
└─ out/
```

---

## 7. Markdown 구조

```md
---
title: "MartPlus"
slug: "martplus"
date: "2026-03-29"
category: "Commerce UX"
summary: "요약"
problem: "문제"
outcome: "결과"
---

## Problem
문제 정의

## Insight
인사이트

## Strategy
전략

## Outcome
결과
```

---

## 8. Cursor 핵심 규칙

- 모든 콘텐츠는 Markdown
- 페이지는 자동 생성
- 하드코딩 금지
- 서버 기능 사용 금지
- static export 기준 설계

---

## 9. 배포 체크

- out 폴더 생성 확인
- out 내부 파일 FTP 업로드
- index.html 정상 확인

---

## 10. 결론

이 구조는 **정적 사이트 + 콘텐츠 자동화** 기반이다.

---

## 이 저장소와의 관계 (참고)

루트에서 **Next.js App Router + `content/projects/*.md`** 로 빌드한다. 이전 순수 HTML은 **`legacy/`**에 보관한다. 배포는 **`out/`** 전체 업로드. 상세는 루트 **`README.md`**.
