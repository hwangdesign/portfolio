# Labs 프로젝트 이미지 구조

각 프로젝트별로 폴더를 만들고 대표이미지(thumbnail)와 디테일 이미지를 관리합니다.
InteractiveAnalogClock 폴더 구조를 기준으로 모든 프로젝트에 동일하게 적용합니다.

## 폴더 구조

```
labs/images/
├── InteractiveAnalogClock/
│   ├── thumbnail.svg      # 대표 이미지 (인덱스·히어로용)
│   ├── Details01.svg
│   ├── Details02.svg
│   └── Details03.svg
├── Lab2/
│   ├── thumbnail.svg
│   └── Details*.svg
├── Lab3/
│   └── ...
└── Lab4/
    └── ...
```

## 규칙

- **폴더명**: 프로젝트명, 공백 없음 (예: `InteractiveAnalogClock`, `Lab2`)

## 공백 제거

파일/폴더명에 공백이 있으면 이미지 링크가 불안정할 수 있습니다. `fix_filenames.sh`를 실행하거나 Finder에서 수동으로 이름을 변경하세요.
- **대표이미지**: `thumbnail.svg` — 메인 페이지 그리드·히어로 배경에 사용
- **디테일 이미지**: `Details01.svg`, `Details02.svg` 등 — 상세 페이지 갤러리에 사용
