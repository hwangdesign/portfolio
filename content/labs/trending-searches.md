---
title: Popular Shopping Keywords
slug: trending-searches
titleHtml: "Popular Shopping Keywords"
date: "2026/02"
type: lab
category: Data
summary: "네이버 쇼핑 인기 키워드 자동 수집·뷰어"
order: 2
thumbnail: /images/labs/TrendingSearches/thumbnail.png
published: true
showOnHome: true
ctas:
  - label: SITE
    href: "/labs/TrendingSearches/index.html"
lede:
  - "네이버 쇼핑 검색 API로 수집한 인기 키워드 10위 랭킹이에요."
  - "GitHub Actions로 매일 12시(KST) 1회 네이버 쇼핑 API를 호출해 자동 수집해요."
---

![POPULAR SHOPPING KEYWORDS 디테일 1](/images/labs/TrendingSearches/Details01.gif)

<div class="section-body">

**인기 키워드 10위 랭킹** — [네이버 쇼핑 검색 API](https://developers.naver.com/docs/serviceapi/search/shopping/shopping.md)로 후보 키워드별 검색 결과 수를 조회해 상위 10개를 순위로 정리해요. GitHub Actions로 매일 12시(KST) 1회 API를 호출해 자동 수집하고, 결과를 `trends-data` 브랜치의 `naver_shopping_sample.json`에 갱신해요.

</div>

![POPULAR SHOPPING KEYWORDS 디테일 2](/images/labs/TrendingSearches/Details02.png)

<div class="section-body">

**뷰어 페이지** — 매일 12시에 갱신되는 위 JSON을 `trends-data` 브랜치에서 fetch로 불러와 10위 랭킹을 보여줘요. 키워드를 클릭하면 네이버 쇼핑 검색 결과로 이동해요.

</div>
