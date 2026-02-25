# Art — 코딩 그래픽 · 온라인 전시관

코딩으로 만든 그래픽 작업을 **데이터베이스(JSON)** 로 관리하고, **온라인 전시관** 페이지에서 갤러리로 보여주는 구조입니다.

## 폴더 구조

```
art/
├── data/
│   └── exhibition.json   ← 전시 DB: 작품 목록 (여기에 항목 추가)
├── sketches/             ← 코딩으로 만든 그래픽 스케치
│   └── grid-waves/       ← 예시: Canvas 그리드+파동
│       └── index.html
├── index.html            ← 온라인 전시관 갤러리 (data 로드해 표시)
└── README.md
```

## 작품 추가 방법

### 1. 그래픽 스케치 만들기

`art/sketches/` 아래에 폴더를 만들고 그 안에 작업을 넣습니다.

- **Canvas API**: 지금 예시처럼 `<canvas>` + JavaScript
- **p5.js**: [p5js.org](https://p5js.org) CDN 넣고 스케치 작성
- **Three.js / WebGL**: 3D 또는 셰이더
- **SVG**: JS로 SVG 생성

예: `art/sketches/my-piece/index.html` 에 한 페이지로 완성된 작품을 두면 됩니다.

### 2. 전시 데이터에 등록

`art/data/exhibition.json` 의 `works` 배열에 작품 정보를 추가합니다.

```json
{
  "id": "고유-id",
  "title": "작품 제목",
  "description": "간단한 설명 (선택)",
  "year": "2025",
  "technique": "Canvas API / p5.js / Three.js 등",
  "thumbnail": "sketches/폴더명/thumbnail.png",
  "detailUrl": "sketches/폴더명/index.html",
  "createdAt": "2025-02-25"
}
```

- `thumbnail`: 선택. 없으면 카드에 "No image" 표시. 각 스케치 폴더에 `thumbnail.png` 를 넣고 위처럼 경로 지정하면 됩니다.
- `detailUrl`: 전시관에서 "작품 보기" 시 열리는 페이지 (보통 스케치의 `index.html`).

### 3. 결과 확인

- **전시관**: `art/index.html` (또는 사이트 배포 시 `/art/`) 에서 `exhibition.json` 을 불러와 갤러리로 표시합니다.
- 메인 포트폴리오 `index.html` 의 **Art** 섹션에서 "온라인 전시관 보기" 로 이동할 수 있습니다.

## 데이터베이스 확장

지금은 **JSON 파일** 하나가 DB 역할을 합니다. 나중에 다음처럼 바꿀 수 있습니다.

- **Supabase / Firebase**: 실시간 DB + 인증으로 관리자만 작품 추가
- **GitHub + JSON**: 지금처럼 `exhibition.json` 만 수정해서 커밋하면 전시관에 자동 반영

원하면 관리자 페이지(폼)를 만들어서 JSON을 수정하거나, 위 서비스와 연동하는 방법도 정리해 드릴 수 있습니다.
