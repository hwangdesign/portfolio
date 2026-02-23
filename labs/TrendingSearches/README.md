# 🛒 Trending Searches (네이버 쇼핑 인기 검색어)

네이버 쇼핑 검색 API로 후보 키워드별 검색 결과 수를 조회해, **검색량 순** 상위 10개를 4시간마다 순위로 매칭하는 랩입니다.

## 구조

```
labs/TrendingSearches/
├── naver-shopping-api.js   # 네이버 검색 API 연동 (후보 키워드 → total 기준 순위)
├── naver-shopping.js       # (선택) 네이버 쇼핑인사이트 크롤링
├── naver/                  # naver_shopping_sample.json, naver_shopping_날짜.json
├── index.html              # 뷰어 (네이버 쇼핑 인기 키워드만 표시)
└── package.json
```

## 데이터 소스

- **네이버 검색 API (쇼핑)**: [검색 > 쇼핑](https://developers.naver.com/docs/serviceapi/search/shopping/shopping.md)  
  - 후보 키워드 목록으로 `query` 요청 → `total` 기준 정렬 → 상위 10개를 인기 키워드로 저장

## 사용법

```bash
cd labs/TrendingSearches
export NAVER_CLIENT_ID="발급받은 클라이언트 아이디"
export NAVER_CLIENT_SECRET="발급받은 클라이언트 시크릿"
node naver-shopping-api.js
```

- `naver/naver_shopping_sample.json`: 뷰어가 로드하는 파일 (`updatedAt`, `items`)
- 4시간마다 GitHub Actions에서 동일 스크립트 실행 후 `trends-data` 브랜치에 푸시

## 뷰어

`index.html`을 브라우저에서 열거나 로컬 서버로 실행하세요.  
키워드 클릭 시 **네이버 쇼핑 검색**으로 연결되며, 4시간마다 데이터를 다시 불러옵니다.

## GitHub Actions

- **trends-4h.yml**: 4시간마다 `naver-shopping-api.js` 실행 → `trends-data` 브랜치에 `naver/naver_shopping_sample.json` 푸시 (시크릿: `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`)
- **daily-shopping-keywords.yml**: main 푸시/일일 스케줄 시 동일 API 실행 → main에 naver JSON 커밋
