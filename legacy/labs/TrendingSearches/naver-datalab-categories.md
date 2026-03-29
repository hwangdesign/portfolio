# 네이버 쇼핑인사이트(데이터랩) 카테고리 코드

네이버는 **쇼핑 분야 코드(cat_id) 전체 목록을 공식 문서로 제공하지 않습니다.**

## 확인 방법

1. **네이버쇼핑**  
   [shopping.naver.com](https://shopping.naver.com/) 접속 → 좌측/상단 카테고리에서 원하는 분야 클릭  
   → 주소창 URL에 `cat_id=숫자` 형태로 코드가 붙습니다.

2. **쇼핑인사이트(데이터랩)**  
   [datalab.naver.com/shoppingInsight/sCategory.naver](https://datalab.naver.com/shoppingInsight/sCategory.naver)  
   → 분야 선택 시 사용되는 코드가 네이버쇼핑의 `cat_id`와 동일한 체계입니다.

3. **API 문서**  
   [쇼핑인사이트 API](https://developers.naver.com/docs/serviceapi/datalab/shopping/shopping.md)  
   > 쇼핑 분야 코드. 네이버쇼핑에서 카테고리를 선택했을 때의 URL에 있는 `cat_id` 파라미터 값으로 분야 코드를 확인할 수 있습니다.

## 카테고리 구조

- **4단계**: 카테고리1 > 카테고리2 > 카테고리3 > 카테고리4
- 데이터랩 API의 `category` 파라미터에는 **해당 분야의 cat_id**(1단계~4단계 중 하나)를 넣습니다.

## 문서/예시에 나온 코드 (일부)

| 코드       | 분야명       | 출처        |
|-----------|--------------|-------------|
| 50000000  | 패션의류     | API 문서 예시 |
| 50000002  | 화장품/미용  | API 문서 예시 |

그 외 분야(디지털/가전, 식품, 가구/인테리어 등)는 위 확인 방법으로 네이버쇼핑 또는 쇼핑인사이트에서 직접 `cat_id`를 확인해야 합니다.

## 이 프로젝트에서 사용

- 기본값: `50000000` (패션의류)  
- 변경: 환경변수 `NAVER_DATALAB_CATEGORY`에 원하는 `cat_id` 지정  
  예: `NAVER_DATALAB_CATEGORY=50000002 node naver-shopping-api.js`
