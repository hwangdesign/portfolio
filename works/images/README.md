# Works 프로젝트 이미지 구조

각 프로젝트별로 폴더를 만들고 대표이미지(thumbnail)와 디테일 이미지를 관리합니다.
InteractiveAnalogClock 폴더 구조와 동일한 규칙을 적용합니다.

## 폴더 구조

```
works/images/
├── DesignSystem/
│   ├── thumbnail.svg      # 대표 이미지
│   ├── Details01.svg     # 디테일 이미지 1
│   └── Details*.svg      # 추가 디테일 이미지
├── 11stBrand/
│   ├── thumbnail.svg
│   └── Details*.svg
├── AmazonGlobalStore/
│   ├── thumbnail.svg
│   └── Details*.svg
└── ...
```

## 규칙

- **폴더명**: 프로젝트명, 공백·하이픈 없음 (예: `DesignSystem`, `11stBrand`)
- **대표이미지**: `thumbnail.svg` — 메인 페이지 그리드용
- **디테일 이미지**: `Details01.svg`, `Details02.svg` 등 — 상세 페이지용
