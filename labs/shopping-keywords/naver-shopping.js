/**
 * 네이버 쇼핑인사이트 - 검색어 통계 크롤링
 * @see https://datalab.naver.com/shoppingInsight/sCategory.naver
 * 검색어 통계 탭에서 분야별 인기 검색어 수집
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const DATALAB_URL = 'https://datalab.naver.com/shoppingInsight/sCategory.naver';

const now = new Date();
const m = now.getMonth() + 1;
const d = now.getDate();
const y = now.getFullYear();
const currentDate = `${m}-${d}-${y}`;

const folderPath = path.join(__dirname, 'naver');
const filename = path.join(folderPath, `naver_shopping_${currentDate}.json`);

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    await page.goto(DATALAB_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(3000);

    const data = await page.evaluate(() => {
      const items = [];
      // 검색어 통계 테이블: 키워드 목록 추출
      const keywordCells = document.querySelectorAll(
        'table.keyword_rank tbody tr td.keyword, ' +
        'table tbody tr td:nth-child(2), ' +
        '.keyword_list li, ' +
        '[class*="keyword"]'
      );
      keywordCells.forEach((el, i) => {
        const keyword = el.textContent?.trim();
        if (keyword && keyword.length > 1 && keyword.length < 50) {
          items.push({ ranking: String(i + 1), keyword });
        }
      });
      // 대안: 데이터랩 UI 구조에 맞는 셀렉터
      if (items.length === 0) {
        const rows = document.querySelectorAll('tr, .list_item');
        rows.forEach((row, i) => {
          const text = row.textContent?.trim();
          if (text && /^[가-힣a-zA-Z0-9\s]+$/.test(text) && text.length < 40) {
            items.push({ ranking: String(i + 1), keyword: text });
          }
        });
      }
      return items.slice(0, 100); // 상위 100개
    });

    const result = data.length > 0 ? data : [];
    fs.writeFileSync(filename, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`✅ 네이버 쇼핑인사이트 저장 완료: ${filename} (${result.length}건)`);
  } catch (err) {
    console.error('❌ 네이버 쇼핑 수집 실패:', err.message);
  } finally {
    await browser.close();
  }
})();
