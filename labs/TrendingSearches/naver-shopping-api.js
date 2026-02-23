/**
 * 네이버 쇼핑 검색 API로 후보 키워드별 검색 결과 수 조회 → 순위 산출
 * @see https://developers.naver.com/docs/serviceapi/search/shopping/shopping.md
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

function fetchTotal(keyword) {
  return new Promise((resolve, reject) => {
    const q = encodeURIComponent(keyword);
    const opts = {
      hostname: 'openapi.naver.com',
      path: `/v1/search/shop.json?query=${q}&display=1&start=1`,
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret
      }
    };
    const req = https.request(opts, (res) => {
      let body = '';
      res.on('data', (ch) => { body += ch; });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.errorCode) {
            resolve({ keyword, total: 0 });
            return;
          }
          const total = typeof json.total === 'number' ? json.total : 0;
          resolve({ keyword, total });
        } catch (_) {
          resolve({ keyword, total: 0 });
        }
      });
    });
    req.on('error', () => resolve({ keyword, total: 0 }));
    req.setTimeout(10000, () => { req.destroy(); resolve({ keyword, total: 0 }); });
    req.end();
  });
}

(async () => {
  if (!clientId || !clientSecret) {
    console.error('❌ NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 환경변수를 설정하세요.');
    process.exit(1);
  }

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const results = [];
  for (let i = 0; i < CANDIDATE_KEYWORDS.length; i++) {
    const kw = CANDIDATE_KEYWORDS[i];
    const r = await fetchTotal(kw);
    results.push(r);
    if ((i + 1) % 10 === 0) console.log(`진행: ${i + 1}/${CANDIDATE_KEYWORDS.length}`);
    await new Promise((r) => setTimeout(r, 120));
  }

  results.sort((a, b) => (b.total - a.total));

  const top10 = results.slice(0, 10).map((r, i) => ({
    ranking: String(i + 1),
    keyword: r.keyword
  }));

  const output = {
    updatedAt: new Date().toISOString(),
    items: top10
  };

  fs.writeFileSync(samplePath, JSON.stringify(output, null, 2), 'utf-8');
  fs.writeFileSync(datedPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`✅ 네이버 쇼핑 검색 API 순위 저장: ${samplePath} (${top10.length}건)`);
})();
