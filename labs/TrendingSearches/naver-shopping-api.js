/**
 * 데이터랩 후보 키워드 순위 계산
 * - 네이버 데이터랩 쇼핑인사이트 API로 후보 키워드(CANDIDATE_KEYWORDS)별 트렌드(클릭 추이) 조회
 * - 기간별 ratio 합계로 점수 산출 후 순위 정렬, 상위 10개를 naver_shopping_sample.json으로 저장
 * - snxbest 등 베스트 키워드 목록을 공개 API로 제공하지 않으므로 이 방식 사용
 * @see https://developers.naver.com/docs/serviceapi/datalab/shopping/shopping.md
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

/** 순위 계산용 후보 키워드 (데이터랩 키워드별 트렌드 API에 전달, 점수 합계로 순위 산정) */
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
  '책', '만화', '문구', '디자인문구', '인테리어', '침대', '소파', '책상', '의자',
  '니트', '맨투맨', '후드티', '청바지', '레깅스', '원피스', '스커트', '블라우스', '셔츠', '자켓',
  '샌들', '슬리퍼', '로퍼', '워커', '패딩부츠', '앵클부츠', '크로스백', '토트백', '백팩', '클러치',
  '제습기', '공기청정기필터', '무선청소기', '진공청소기', '다이슨', '전기요', '핫팩', '손난로',
  '비타민', '오메가3', '유산균', '프로바이오틱스', '콜라겐', '밀크씨슬', '루테인', '멀티비타민', '비오틴', '철분',
  '다이어트', '단백질', '프로틴', '닭가슴살', '샐러드', '간편식', '즉석밥', '라면', '과자', '초콜릿',
  '반려동물사료', '강아지간식', '고양이모래', '펫푸드', '배변패드', '목줄', '하네스', '캔사료', '동물병원',
  '명절선물', '기념일선물', '생일선물', '입학선물', '퇴직선물', '결혼선물', '장례화환', '과일선물', '한과',
  '파라다이스그레인', '지에프국간장', '야마하페달', '뉴발란스', '미국에코백', '에코백', '보스턴백', '크로스백',
  '스마트폰케이스', '갤럭시케이스', '아이폰케이스', '보호필름', '카메라', '드론', '게이밍모니터', '게이밍의자', '기계식키보드',
  '캠핑텐트', '캠핑의자', '캠핑테이블', '버너', '캠핑랜턴', '슬리핑백', '아이스박스', '캠핑카',
  '조깅화', '런닝화', '트레킹화', '등산화', '골프웨어', '골프장갑', '테니스라켓', '배드민턴라켓', '축구화', '수영복',
  '아기물티슈', '기저귀', '분유', '유아식', '젖병', '유모차', '아기침대', '유아가구', '목욕용품', '베이비오일',
  '남성화장품', '스킨로션', '선블록', '클렌징', '마스크팩', '세럼', '에센스', '아이크림', '넥크림', '바디로션',
  '향수', '디퓨저', '캔들', '방향제', '탈취제', '제습제', '방충제', '살충제',
  '생수', '탄산수', '주스', '커피', '녹차', '홍차', '전통주', '와인', '맥주', '소주',
  '홈카페', '에스프레소머신', '캡슐커피', '드립백', '원두커피', '티백', '머그컵', '와인잔'
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
            console.error('API 오류:', json.errorCode || '', json.errorMessage || '');
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
  try {
  if (!clientId || !clientSecret) {
    console.error('❌ NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 환경변수를 설정하세요.');
    process.exit(1);
  }

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const end = new Date();
  end.setDate(end.getDate() - 1);  // 데이터랩 전일 집계 기준
  const start = new Date(end);
  start.setDate(start.getDate() - 6);  // 조회 기간: 최근 7일 (데이터 확보·순위 변동용)
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

  const totalScore = sorted.reduce((acc, item) => acc + (Number(item.score) || 0), 0);
  const hasRealData = totalScore > 0;

  if (!hasRealData) {
    console.warn('⚠️ API에서 트렌드 데이터가 없습니다. 조회 기간을 확인하거나 시크릿/앱 설정을 점검하세요.');
    if (fs.existsSync(samplePath)) {
      console.warn('   기존 결과를 유지합니다. 파일을 덮어쓰지 않습니다.');
      return;
    }
  }

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
  console.log(`✅ 데이터랩 후보 키워드 순위 저장: ${samplePath} (${top10.length}건)`);
  } catch (err) {
    console.error('❌ 스크립트 오류:', err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  }
})();
