/**
 * Google Trends - 한국 4시간 기준 실시간 인기 검색어 수집
 * @see https://trends.google.com/trending?geo=KR&hours=4
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TRENDS_URL = 'https://trends.google.com/trending?geo=KR&hours=4';

const now = new Date();
const m = now.getMonth() + 1;
const d = now.getDate();
const y = now.getFullYear();
const currentDate = `${m}-${d}-${y}`;

const folderPath = path.join(__dirname, 'google');
const filename = path.join(folderPath, `google_trends_${currentDate}.json`);
const samplePath = path.join(folderPath, 'google_trends_sample.json');

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
      const seen = new Set();
      function add(ranking, keyword) {
        const k = (keyword || '').trim().substring(0, 80);
        if (!k || k.length < 2 || seen.has(k)) return;
        seen.add(k);
        items.push({ ranking: String(ranking), keyword: k });
      }

      // 1) 테이블 행 (tr[role="row"]) - 트렌드 페이지 현재 구조
      const rows = document.querySelectorAll('tr[role="row"]');
      rows.forEach((row, i) => {
        const cells = row.querySelectorAll('td');
        const firstCell = cells[0];
        if (firstCell) {
          const link = firstCell.querySelector('a');
          const text = (link?.getAttribute('title') || link?.textContent || firstCell.textContent || '').trim();
          if (text) add(items.length + 1, text);
        }
      });

      // 2) 리스트 아이템 / 피드
      if (items.length === 0) {
        const listSelectors = [
          'div.feed-item',
          'div[role="listitem"]',
          'div.detail-list-item',
          'md-list-item',
          'li[role="option"]'
        ];
        for (const sel of listSelectors) {
          const els = document.querySelectorAll(sel);
          if (els.length > 0) {
            els.forEach((el, i) => {
              const titleEl = el.querySelector('.title a, .title, a[title], [role="heading"]');
              const keyword = titleEl?.getAttribute('title') || titleEl?.textContent?.trim() || el.textContent?.trim();
              if (keyword) add(items.length + 1, keyword);
            });
            break;
          }
        }
      }

      // 3) 트렌드 링크에서 제목 추출
      if (items.length === 0) {
        document.querySelectorAll('a[href*="/trends/"], a[href*="trending"]').forEach((a, i) => {
          const title = a.getAttribute('title') || a.textContent?.trim();
          if (title && title.length > 1 && title.length < 100) add(items.length + 1, title);
        });
      }

      return items;
    });

    const result = data.length > 0 ? data : [];
    const output = {
      updatedAt: new Date().toISOString(),
      items: result
    };
    fs.writeFileSync(filename, JSON.stringify(output, null, 2), 'utf-8');
    fs.writeFileSync(samplePath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`✅ Google Trends (4시간) 저장 완료: ${filename}, ${samplePath} (${result.length}건)`);
  } catch (err) {
    console.error('❌ Google Trends 수집 실패:', err.message);
  } finally {
    await browser.close();
  }
})();
