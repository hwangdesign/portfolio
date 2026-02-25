# 🛒 Trending Searches (네이버 쇼핑 인기 키워드)

**네이버 개발자 센터 API 연동**으로 리얼 트렌드 데이터를 받아, 인기 키워드 상위 10개를 **매일 자동 갱신**합니다.  
데이터랩 쇼핑인사이트 API에 후보 키워드를 넣고, 조회 기간(1일)의 클릭 비율(ratio) 합계로 순위를 산정합니다.

## API 연동 설정 (네이버 개발자 센터)

리얼 데이터 갱신을 위해 한 번만 설정하면 됩니다.

1. **[네이버 개발자 센터](https://developers.naver.com)** 접속 → 로그인  
2. **Application** → **애플리케이션 등록**  
   - 애플리케이션 이름 입력  
   - **사용 API**에서 **데이터랩 (쇼핑인사이트)** 선택 후 등록  
3. 등록한 앱을 클릭해 **Client ID**, **Client Secret** 복사  
4. **GitHub** 저장소 → **Settings** → **Secrets and variables** → **Actions**  
5. **New repository secret**으로 아래 두 개 추가  
   - `NAVER_CLIENT_ID` : 복사한 Client ID  
   - `NAVER_CLIENT_SECRET` : 복사한 Client Secret  

설정 후 매일 12시(KST)에 워크플로가 실행되며, **Actions** 탭에서 수동 실행도 가능합니다.

## 구조

```
labs/TrendingSearches/
├── naver-shopping-api.js   # 네이버 데이터랩 API 호출 (후보 키워드 → 트렌드 ratio → 순위)
├── naver-shopping.js       # (선택) 네이버 쇼핑인사이트 크롤링
├── naver/                  # naver_shopping_sample.json (뷰어가 로드)
├── index.html              # 뷰어 (인기 키워드 표시)
└── package.json
```

## 데이터 소스

- **네이버 데이터랩 쇼핑인사이트 API**: [쇼핑인사이트 API 문서](https://developers.naver.com/docs/serviceapi/datalab/shopping/shopping.md)  
  - 후보 키워드 목록으로 키워드별 트렌드(클릭 추이) 조회 → 조회 기간(1일) `ratio` 합계로 점수 산출 → 상위 10개를 인기 키워드로 저장

## 사용법 (로컬 테스트)

```bash
cd labs/TrendingSearches
export NAVER_CLIENT_ID="발급받은 클라이언트 아이디"
export NAVER_CLIENT_SECRET="발급받은 클라이언트 시크릿"
node naver-shopping-api.js
```

- 생성 파일: `naver/naver_shopping_sample.json` (`updatedAt`, `items` 상위 10개)  
- GitHub Actions에서 매일 동일 스크립트 실행 후 `trends-data` 브랜치에 푸시

## 뷰어

`index.html`을 브라우저에서 열거나 로컬 서버로 실행하세요.  
키워드 클릭 시 **네이버 쇼핑 검색**으로 연결됩니다.

## GitHub Actions

- **trends-4h.yml**: 네이버 개발자 센터 API 연동 — 매일 12시(KST) `naver-shopping-api.js` 실행 → 리얼 데이터로 인기 키워드 갱신 → `trends-data` 브랜치에 `naver/naver_shopping_sample.json` 푸시  
- 필요한 Secrets: `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` (위 API 연동 설정 참고)
