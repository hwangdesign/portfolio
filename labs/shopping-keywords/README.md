# 🛒 Shopping Keywords KR

Google Trends와 네이버쇼핑 인기 검색어를 종합한 쇼핑 키워드 랭킹 프로젝트입니다.

## 구조

```
shopping-keywords/
├── google-trends.js    # Google Trends (쇼핑 카테고리) 크롤러
├── naver-shopping.js   # 네이버 쇼핑인사이트 크롤러
├── google/             # Google Trends JSON 출력
├── naver/              # 네이버쇼핑 JSON 출력
├── index.html          # 뷰어 (종합 랭킹 / Google / 네이버 탭)
└── package.json
```

## 데이터 소스

- **Google Trends**: [trends.google.co.kr/trending?geo=KR&category=2](https://trends.google.co.kr/trending?geo=KR&category=2) (쇼핑 카테고리)
- **네이버쇼핑**: [datalab.naver.com/shoppingInsight](https://datalab.naver.com/shoppingInsight/sCategory.naver) (검색어 통계)

## 사용법

```bash
cd labs/shopping-keywords
npm install
npm run collect   # Google + 네이버 수집
npm run google    # Google Trends만
npm run naver     # 네이버쇼핑만
```

## 뷰어

`index.html`을 브라우저에서 열거나 로컬 서버로 실행하세요.

- **종합 랭킹**: 두 소스 점수 합산 (101-순위), 양쪽 모두 등장한 키워드가 상위
- **Google Trends**: Google 쇼핑 트렌드만
- **네이버쇼핑**: 네이버 쇼핑인사이트만

키워드 클릭 시 Google 검색 또는 네이버쇼핑 검색으로 연결됩니다.

## GitHub Actions

`.github/workflows/daily-shopping-keywords.yml`이 매일 **KST 오전 7시**에 실행됩니다.
