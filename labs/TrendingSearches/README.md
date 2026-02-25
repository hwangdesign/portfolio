# 🛒 Trending Searches (네이버 쇼핑 인기 키워드)

**데이터랩 후보 키워드 순위 계산** 방식입니다. 네이버 데이터랩 쇼핑인사이트 API로 후보 키워드별 트렌드(클릭 추이)를 조회한 뒤, 기간별 ratio 합계로 순위를 산정해 상위 10개를 매일 갱신합니다.

## 구조

```
labs/TrendingSearches/
├── naver-shopping-api.js   # 데이터랩 쇼핑인사이트 API (후보 키워드 → 트렌드 ratio 합계 → 순위)
├── naver-shopping.js       # (선택) 네이버 쇼핑인사이트 크롤링
├── naver/                  # naver_shopping_sample.json, naver_shopping_날짜.json
├── index.html              # 뷰어 (인기 키워드 표시)
└── package.json
```

## 데이터 소스

- **네이버 데이터랩 쇼핑인사이트 API**: [쇼핑인사이트](https://developers.naver.com/docs/serviceapi/datalab/shopping/shopping.md)  
  - 후보 키워드 목록(`CANDIDATE_KEYWORDS`)으로 키워드별 트렌드 조회 → 기간 내 `ratio` 합계로 점수 산출 → 점수 순 상위 10개를 인기 키워드로 저장

## 사용법

```bash
cd labs/TrendingSearches
export NAVER_CLIENT_ID="발급받은 클라이언트 아이디"
export NAVER_CLIENT_SECRET="발급받은 클라이언트 시크릿"
node naver-shopping-api.js
```

- `naver/naver_shopping_sample.json`: 뷰어가 로드하는 파일 (`updatedAt`, `items`)
- GitHub Actions에서 매일 동일 스크립트 실행 후 `trends-data` 브랜치에 푸시

## 뷰어

`index.html`을 브라우저에서 열거나 로컬 서버로 실행하세요.  
키워드 클릭 시 **네이버 쇼핑 검색**으로 연결됩니다.

## GitHub Actions

- **trends-4h.yml**: 데이터랩 후보 키워드 순위 계산 — 매일 `naver-shopping-api.js` 실행 → `trends-data` 브랜치에 `naver/naver_shopping_sample.json` 푸시 (시크릿: `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`)
