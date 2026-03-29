# Portfolio (Next.js · static export)

## 개발

```bash
npm install
npm run dev
```

## 배포 (웹FTP)

`output: 'export'`로 **정적 파일**만 생성합니다. Node 서버 없이 호스팅 가능합니다.

```bash
npm run build
```

생성물: **`out/`** 디렉터리 전체를 FTP로 업로드합니다.

## 콘텐츠

- 프로젝트 케이스: `content/projects/*.md` (프론트매터 + 본문)
- 정적 에셋: `public/` → 사이트 루트 URL (`/works/images/...` 등)

## 레거시

이전 순수 HTML 사이트는 **`legacy/`**에 보관되어 있습니다.

자세한 운영 원칙은 `docs/nextjs-webftp-cursor-full.md`, 케이스 스터리 문체는 `CASE_STUDY_GUIDE.md`를 참고하세요.
