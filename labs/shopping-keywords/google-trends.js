/**
 * Google Trends - 한국 쇼핑 카테고리 인기 검색어 수집
 * @see https://trends.google.co.kr/trending
 * category: 2 = 쇼핑
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TRENDS_URL = 'https://trends.google.co.kr/trending?geo=KR&category=2'; // 쇼핑 카테고리

const now = new Date();
const m = now.getMonth() + 1;
const d = now.getDate();
const y = now.getFullYear();
const currentDate = `${m}-${d}-${y}`;

const folderPath = path.join(__dirname, 'google');
const filename = path.join(folderPath, `google_trends_${currentDate}.json`);

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
    await page.goto(TRENDS_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(5000); // 트렌드 로딩 대기

    const data = await page.evaluate(() => {
      const items = [];
      // Google Trends DOM: feed-item, 또는 detail-list-item 등
      const selectors = [
        'div.feed-item',
        'div[role="listitem"]',
        'div.detail-list-item',
        'div.trending-list-item',
        'md-list-item'
      ];
      let elements = [];
      for (const sel of selectors) {
        elements = document.querySelectorAll(sel);
        if (elements.length > 0) break;
      }
      if (elements.length === 0) {
        // 대안: 모든 링크에서 트렌드 제목 추출 시도
        const links = document.querySelectorAll('a[href*="/trends/"]');
        links.forEach((a, i) => {
          const title = a.getAttribute('title') || a.textContent?.trim();
          if (title && title.length > 1 && title.length < 100) {
            items.push({ ranking: String(i + 1), keyword: title.trim() });
          }
        });
      } else {
        elements.forEach((el, i) => {
          const titleEl = el.querySelector('.title a, .title, a[title], [role="heading"]');
          const keyword = titleEl?.getAttribute('title') || titleEl?.textContent?.trim() || el.textContent?.trim();
          if (keyword) items.push({ ranking: String(i + 1), keyword: keyword.substring(0, 80) });
        });
      }
      return items.length > 0 ? items : [];
    });

    const result = data.length > 0 ? data : [];
    fs.writeFileSync(filename, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`✅ Google Trends (쇼핑) 저장 완료: ${filename} (${result.length}건)`);
  } catch (err) {
    console.error('❌ Google Trends 수집 실패:', err.message);
  } finally {
    await browser.close();
  }
})();
