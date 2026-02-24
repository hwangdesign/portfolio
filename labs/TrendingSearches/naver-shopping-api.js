/**
 * 네이버 데이터랩 쇼핑인사이트 API로 후보 키워드별 트렌드(클릭 추이) 조회 → 순위 산출
 * @see https://developers.naver.com/docs/serviceapi/datalab/shopping/shopping.md
 * 4시간마다 실행해 naver_shopping_sample.json 갱신
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const clientId = process.env.NAVER_CLIENT_ID || '';
const clientSecret = process.env.NAVER_CLIENT_SECRET || '';

const folderPath = path.join(__dirname, 'naver');
const samplePath = path.join(folderPath, 'naver_shopping_sample.json');

const now = new Date();
const m = now.getMonth() + 1;
const d = now.getDate();
const y = now.getFullYear();
const currentDate = `${m}-${d}-${y}`;
const datedPath = path.join(folderPath, `naver_shopping_${currentDate}.json`);

/** 순위 매칭용 후보 키워드 (쇼핑 인기 검색어 후보) */
const CANDIDATE_KEYWORDS = [
  '겨울 패딩', '선크림', '노트북', '에어팟', '무선 이어폰', '아이패드', '가습기', '공기청정기', '전기담요', '스마트워치',
  '겨울 코트', '패딩 조끼', '휴대폰 케이스', '블루투스 이어폰', '갤럭시', '아이폰', '맥북', '태블릿', '스마트폰',
  '선풍기', '에어컨', '히터', '전기장판', '담요', '이불', '카페트', '방한용품',
  '마스크', '핸드크림', '립밤', '스킨케어', '화장품', '선물', '꽃배달', '과일',
  '운동화', '부츠', '스니커즈', '가방', '지갑', '시계', '안경', '모자',
  '키보드', '마우스', '모니터', '헤드폰', '스피커', '웹캠', '충전기', '보조배터리',
  '공구', '주방용품', '욕실용품', '청소기', '로봇청소기', '식기세척기', '전자레인지', '에어프라이어',
  '텀블러', '도시락', '냉장고', '세탁기', '건조기', '다리미', '의류관리기',
  '자전거', '캠핑', '등산', '골프', '요가', '필라테스', '홈트레이닝',
  '책', '만화', '문구', '디자인문구', '인테리어', '침대', '소파', '책상', '의자'
];

/** 데이터랩 쇼핑 분야 코드 (네이버쇼핑 cat_id). 필요 시 변경 가능 */
const DATALAB_CATEGORY = process.env.NAVER_DATALAB_CATEGORY || '50000000';

/** 최대 5개 키워드씩 요청 (API 제한) */
const KEYWORDS_PER_REQUEST = 5;

function getDateString(date) {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}

/**
 * 데이터랩 쇼핑인사이트 키워드별 트렌드 조회 (POST /v1/datalab/shopping/category/keywords)
 * @param {string[]} keywords - 최대 5개
 * @param {string} startDate - yyyy-mm-dd
 * @param {string} endDate - yyyy-mm-dd
 */
function fetchKeywordTrend(keywords, startDate, endDate) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      startDate,
      endDate,
      timeUnit: 'date',
      category: DATALAB_CATEGORY,
      keyword: keywords.map(kw => ({ name: kw, param: [kw] }))
    });
    const opts = {
      hostname: 'openapi.naver.com',
      path: '/v1/datalab/shopping/category/keywords',
      method: 'POST',
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body, 'utf-8')
      }
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (ch) => { data += ch; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.errorMessage || json.errorCode) {
            resolve([]);
            return;
          }
          const results = Array.isArray(json.results) ? json.results : [];
          resolve(results);
        } catch (_) {
          resolve([]);
        }
      });
    });
    req.on('error', () => resolve([]));
    req.setTimeout(15000, () => { req.destroy(); resolve([]); });
    req.end(body);
  });
}

/**
 * results 항목에서 키워드별 트렌드 점수 산출 (최근 구간 ratio 합계, 없으면 0)
 */
function scoreFromResult(result) {
  const kw = Array.isArray(result.keyword) ? result.keyword[0] : (result.title || '');
  const data = Array.isArray(result.data) ? result.data : [];
  const sum = data.reduce((acc, d) => acc + (typeof d.ratio === 'number' ? d.ratio : 0), 0);
  return { keyword: kw, score: sum };
}

(async () => {
  if (!clientId || !clientSecret) {
    console.error('❌ NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 환경변수를 설정하세요.');
    process.exit(1);
  }

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 7);
  const startDate = getDateString(start);
  const endDate = getDateString(end);

  const scoreMap = new Map();
  for (const kw of CANDIDATE_KEYWORDS) {
    scoreMap.set(kw, 0);
  }

  for (let i = 0; i < CANDIDATE_KEYWORDS.length; i += KEYWORDS_PER_REQUEST) {
    const chunk = CANDIDATE_KEYWORDS.slice(i, i + KEYWORDS_PER_REQUEST);
    const results = await fetchKeywordTrend(chunk, startDate, endDate);
    for (const r of results) {
      const { keyword, score } = scoreFromResult(r);
      if (keyword && scoreMap.has(keyword)) {
        scoreMap.set(keyword, score);
      }
    }
    if (i + KEYWORDS_PER_REQUEST < CANDIDATE_KEYWORDS.length) {
      await new Promise((r) => setTimeout(r, 250));
    }
    if ((i + KEYWORDS_PER_REQUEST) % 10 === 0 || i + KEYWORDS_PER_REQUEST >= CANDIDATE_KEYWORDS.length) {
      console.log(`진행: ${Math.min(i + KEYWORDS_PER_REQUEST, CANDIDATE_KEYWORDS.length)}/${CANDIDATE_KEYWORDS.length}`);
    }
  }

  const sorted = [...scoreMap.entries()]
    .map(([keyword, score]) => ({ keyword, score }))
    .sort((a, b) => b.score - a.score);

  const top10 = sorted.slice(0, 10).map((r, i) => ({
    ranking: String(i + 1),
    keyword: r.keyword
  }));

  const output = {
    updatedAt: new Date().toISOString(),
    items: top10
  };

  fs.writeFileSync(samplePath, JSON.stringify(output, null, 2), 'utf-8');
  fs.writeFileSync(datedPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`✅ 네이버 데이터랩 쇼핑인사이트 트렌드 순위 저장: ${samplePath} (${top10.length}건)`);
})();
