// 컬러 상수 정의
const COLORS = {
    YELLOW: '#FFFF00',
    BLACK: '#000000',
    YELLOW_20: 'rgba(255, 255, 0, 0.2)'
};

function renderSharedLayout() {
    const navContainer = document.getElementById('shared-nav');
    const footerContainer = document.getElementById('shared-footer');
    if (!navContainer || !footerContainer) {
        return;
    }

    const currentPath = window.location.pathname;
    const lastSegment = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const isIndexPath = lastSegment === '' || lastSegment === 'index.html';
    const baseHref = isIndexPath ? '' : '../index.html';
    const navTargets = ['about', 'works', 'labs', 'art'];
    const navLabelMap = { art: 'Arts' };
    const navLinksHtml = navTargets.map(section => {
        const hrefValue = isIndexPath ? `#${section}` : `${baseHref}#${section}`;
        const label = navLabelMap[section] || section.charAt(0).toUpperCase() + section.slice(1);
        return `<a href="${hrefValue}" class="nav-menu-item text-nav-menu">${label}</a>`;
    }).join('');

    const navMobileLinksHtml = navTargets.map((section, index) => {
        const hrefValue = isIndexPath ? `#${section}` : `${baseHref}#${section}`;
        // 모바일 메뉴에서는 Arts 항목에 (coming soon)을 윗첨자로 표시
        if (section === 'art') {
            return `<a href="${hrefValue}" class="nav-mobile-menu-item text-nav-menu" data-index="${index}">Arts<sup>(coming soon)</sup></a>`;
        }
        const label = navLabelMap[section] || section.charAt(0).toUpperCase() + section.slice(1);
        return `<a href="${hrefValue}" class="nav-mobile-menu-item text-nav-menu" data-index="${index}">${label}</a>`;
    }).join('');

    const brandHtml = isIndexPath
        ? `<div class="nav-brand" id="navBrandAnimated">welcome to</div>`
        : `<a class="nav-brand" id="navBrandAnimated" href="${baseHref || 'index.html'}">welcome to</a>`;

    navContainer.innerHTML = `
<nav class="navbar">
    <div class="container">
        ${brandHtml}
        <div class="nav-menu-wrapper">
            ${navLinksHtml}
        </div>
        <button class="nav-hamburger" type="button" aria-label="메뉴 열기" aria-expanded="false" id="navHamburger">
            <span class="nav-hamburger-line"></span>
            <span class="nav-hamburger-line"></span>
            <span class="nav-hamburger-line"></span>
        </button>
        <div class="nav-mobile-overlay" id="navMobileOverlay" aria-hidden="true">
            <div class="nav-mobile-overlay-panel">
                <button class="nav-mobile-close" type="button" aria-label="메뉴 닫기" id="navMobileClose">
                    <span class="nav-mobile-close-line"></span>
                    <span class="nav-mobile-close-line"></span>
                </button>
                <nav class="nav-mobile-menu" aria-label="모바일 메뉴">
                    ${navMobileLinksHtml}
                </nav>
            </div>
        </div>
    </div>
</nav>`;

    footerContainer.innerHTML = `
<footer class="site-footer">
    <div class="container site-footer-inner">
        <p>© hwangdesign — sweet home</p>
        <button class="theme-toggle" aria-label="테마 전환" id="themeToggle">
            <span class="theme-icon-dark">🌙</span>
            <span class="theme-icon-light">☀️</span>
        </button>
    </div>
</footer>`;
}

renderSharedLayout();

/** 모바일 GNB: 햄버거 버튼 클릭 시 절반 높이 레이어에 메뉴 순차 노출 */
(function initMobileNav() {
    const hamburger = document.getElementById('navHamburger');
    const overlay = document.getElementById('navMobileOverlay');
    const closeBtn = document.getElementById('navMobileClose');
    if (!hamburger || !overlay) return;

    function openOverlay() {
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', '메뉴 닫기');
        // 전체 페이지 세로 스크롤 방지
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.classList.add('nav-mobile-open');
    }

    function closeOverlay() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', '메뉴 열기');
        // 스크롤 잠금 해제
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.classList.remove('nav-mobile-open');
    }

    hamburger.addEventListener('click', function () {
        if (overlay.classList.contains('is-open')) closeOverlay();
        else openOverlay();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeOverlay);
    }

    overlay.querySelectorAll('.nav-mobile-menu-item').forEach(function (link) {
        link.addEventListener('click', closeOverlay);
    });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeOverlay();
    });
})();

/** Art 섹션 그리드: exhibition.json 기반 동적 주입 (index 페이지에만 #artGrid 존재 시) */
(function initArtGrid() {
    const grid = document.getElementById('artGrid');
    if (!grid) return;
    const base = (location.pathname.endsWith('/') || location.pathname.endsWith('index.html')) ? '' : location.pathname.replace(/\/[^/]+$/, '/');
    fetch((base || './') + 'art/data/exhibition.json')
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (data) {
            const works = Array.isArray(data.works) ? data.works : [];
            works.forEach(function (work) {
                if (!work.thumbnail && !work.detailUrl) return;
                const a = document.createElement('a');
                a.className = 'portfolio-item';
                a.href = work.detailUrl ? 'art/' + work.detailUrl : '#';
                if (work.detailUrl) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener noreferrer'); }
                const thumb = document.createElement('div');
                thumb.className = 'portfolio-thumbnail';
                const img = document.createElement('img');
                img.src = work.thumbnail ? (work.thumbnail.indexOf('http') === 0 ? work.thumbnail : 'art/' + work.thumbnail) : 'https://via.placeholder.com/600x400/111111/333333?text=Art';
                img.alt = work.title || 'Art';
                img.loading = 'lazy';
                img.onerror = function () { img.src = 'https://via.placeholder.com/600x400/111111/333333?text=Art'; };
                thumb.appendChild(img);
                a.appendChild(thumb);
                grid.appendChild(a);
            });
        })
        .catch(function () {});
})();

/**
 * GA4 고객 동선 추적: 포트폴리오/랩/아트/CTA 클릭 시 select_content 이벤트 전송
 */
(function initGA4FlowTracking() {
    function sendGA4Event(eventName, params) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    }
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a');
        if (!link || !link.href) return;
        var href = link.getAttribute('href') || '';
        var titleEl = link.querySelector('.portfolio-title, .section-title');
        var label = titleEl ? (titleEl.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100) : link.textContent.trim().slice(0, 100);
        if (link.classList.contains('portfolio-item')) {
            var section = link.closest('#portfolioGrid') ? 'works' : link.closest('#labsGrid') ? 'labs' : link.closest('.art-grid') ? 'art' : 'portfolio';
            sendGA4Event('select_content', { content_type: section, content_id: href, content_name: label || href });
        } else if (link.classList.contains('btn-cta')) {
            sendGA4Event('click_cta', { link_url: link.href, link_text: label || link.textContent.trim().slice(0, 80) });
        }
    }, false);
})();

/**
 * 프로젝트 상세 페이지 이전/다음글 네비: body.project-detail-page, #project-nav-root + config 기준
 */
function renderProjectNav() {
    if (!document.body.classList.contains('project-detail-page')) return;
    const root = document.getElementById('project-nav-root');
    if (!root || typeof window.PROJECT_NAV_CONFIG !== 'object') return;

    const pathname = window.location.pathname || '';
    const parts = pathname.split('/').filter(Boolean);
    const worksIdx = parts.indexOf('works');
    const labsIdx = parts.indexOf('labs');
    let navKey = null;
    if (worksIdx >= 0 && parts[worksIdx + 1]) navKey = 'works/' + parts[worksIdx + 1];
    else if (labsIdx >= 0 && parts[labsIdx + 1]) navKey = 'labs/' + parts[labsIdx + 1];
    if (!navKey || !window.PROJECT_NAV_CONFIG[navKey]) return;

    const cfg = window.PROJECT_NAV_CONFIG[navKey];
    const labelPrev = '←←';
    const labelNext = '→→';
    const emptyTitle = '-';

    const prevHtml = cfg.prev
        ? `<a href="${cfg.prev.href}" class="project-nav-link prev"><span class="project-nav-label">${labelPrev}</span><span class="project-nav-title">${cfg.prev.title}</span></a>`
        : `<span class="project-nav-link disabled prev"><span class="project-nav-label">${labelPrev}</span><span class="project-nav-title">${emptyTitle}</span></span>`;
    const nextHtml = cfg.next
        ? `<a href="${cfg.next.href}" class="project-nav-link next"><span class="project-nav-label">${labelNext}</span><span class="project-nav-title">${cfg.next.title}</span></a>`
        : `<span class="project-nav-link disabled next"><span class="project-nav-label">${labelNext}</span><span class="project-nav-title">${emptyTitle}</span></span>`;

    root.innerHTML = `<div class="project-navigation-wrapper"><div class="container"><nav class="project-navigation">${prevHtml}${nextHtml}</nav></div></div>`;
}

renderProjectNav();

// Theme Toggle 기능
(function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    // OS 다크/라이트 모드 설정 감지 함수
    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    // localStorage에서 테마 불러오기 (없으면 OS 설정 사용)
    const savedTheme = localStorage.getItem('theme') || getSystemTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // 모바일 상태바(theme-color) 항상 블랙 고정
    function updateThemeColor(theme, projectBgColor) {
        const themeColorMeta = document.getElementById('themeColorMeta');
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', '#000000');
        }
        let colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
        if (!colorSchemeMeta) {
            colorSchemeMeta = document.createElement('meta');
            colorSchemeMeta.name = 'color-scheme';
            document.head.appendChild(colorSchemeMeta);
        }
        colorSchemeMeta.setAttribute('content', theme === 'light' ? 'light' : 'dark');
    }
    
    // 배경 라인 색상 업데이트 함수
    function updateBackgroundLinesColor(theme) {
        const allLines = document.querySelectorAll('.background-line, .background-line-short');
        const shortLineColor = theme === 'light' ? 'rgba(0, 0, 0, 0.2)' : COLORS.YELLOW_20;
        const verticalLineColor = theme === 'light' ? 'rgba(0, 0, 0, 0.14)' : 'rgba(255, 215, 0, 0.38)';
        
        allLines.forEach(line => {
            if (line.classList.contains('background-line')) {
                line.style.background = verticalLineColor;
                line.style.opacity = '1';
            } else if (line.classList.contains('background-line-short')) {
                line.style.background = shortLineColor;
            }
        });
    }
    
    // 테마 토글 이벤트
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // 테마 변경
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // 모바일 상태바 색상 업데이트
            updateThemeColor(newTheme);
            
            // 배경 라인 색상 업데이트
            updateBackgroundLinesColor(newTheme);
            
            // 탑 버튼 색상 업데이트
            if (typeof updateScrollTopBtnColor === 'function') {
                updateScrollTopBtnColor(newTheme);
            }
            
            // 프로젝트 본문 배경 (라이트 모드 전용)
            if (typeof applyProjectPageBackground === 'function') {
                applyProjectPageBackground(newTheme);
            }
        });
    }
    
    // 초기 로드 시 상태바 색상 및 배경 라인 색상 설정
    updateThemeColor(savedTheme);
    setTimeout(() => {
        updateBackgroundLinesColor(savedTheme);
    }, 200);
})();

/**
 * 프로젝트 배경컬러 추출 정의
 * - 적용 조건: body.project-detail-page + data-theme="light"
 * - 이미지 소스: 페이지 내 첫 Details 이미지(DOM, 웹 호환) → 없으면 PROJECT_BG_IMAGE_MAP(썸네일) 또는 data-bg-image
 * - 샘플링: 64×64 캔버스, 픽셀 밝기 30~240, 투명도 ≥128
 * - 주조색: 20단위로 양자화된 RGB 중 빈도 최대
 * - 밝기 낮추기 + 채도 높이기 후 구글 머티리얼 팔레트(가장 밝은 톤) 중 가장 가까운 색으로 매칭
 * - 실패 시: #fafafa
 */
const MATERIAL_PALETTE_50 = [
    '#FFEBEE', '#FCE4EC', '#F3E5F5', '#EDE7F6', '#E8EAF6', '#E3F2FD', '#E1F5FE', '#E0F7FA', '#E0F2F1', '#E8F5E9',
    '#F1F8E9', '#F9FBE7', '#FFFDE7', '#FFF8E1', '#FFF3E0', '#FBE9E7', '#EFEBE9', '#FAFAFA', '#ECEFF1'
];

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
    }
    return [h * 360, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) { r = g = b = l; } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1; if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function adjustColorForMatching(r, g, b, saturateBoost, lightnessReduce) {
    const [h, s, l] = rgbToHsl(r, g, b);
    const newS = Math.min(100, s * saturateBoost);
    const newL = Math.max(0, l - lightnessReduce);
    return hslToRgb(h, newS, newL);
}

function findClosestMaterialColor(r, g, b) {
    let minDist = Infinity;
    let closest = MATERIAL_PALETTE_50[0];
    for (const hex of MATERIAL_PALETTE_50) {
        const m = hex.slice(1).match(/.{2}/g);
        const pr = parseInt(m[0], 16), pg = parseInt(m[1], 16), pb = parseInt(m[2], 16);
        const dist = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
        if (dist < minDist) { minDist = dist; closest = hex; }
    }
    return closest;
}
const PROJECT_BG_EXTRACT = {
    sampleSize: 64,
    brightnessMin: 30,
    brightnessMax: 240,
    alphaMin: 128,
    quantizeStep: 20,
    saturateBoost: 2.5,
    lightnessReduce: 15,
    fallbackColor: '#fafafa'
};

const PROJECT_BG_IMAGE_MAP = {
    'back-to-basics.html': 'images/Back_to_Basics/thumbnail.png',
    'martplus.html': 'images/MartPlus/thumbnail.png',
    '11kitiz-s2.html': 'images/11Kitties/thumbnail.png',
    'ootd.html': 'images/ootd/thumbnail.png',
    'design-system.html': 'images/DesignSystem/thumbnail.png',
    'ooah.html': 'images/ooah/thumbnail.svg',
    '11street-dx.html': 'images/eXperience/thumbnail.png',
    'amazon-global-store.html': 'images/AmazonGlobalStore/thumbnail.png',
    'InteractiveAnalogClock.html': 'images/InteractiveAnalogClock/thumbnail.png',
    'lab-2.html': 'images/Lab2/thumbnail.png'
};

function getProjectBgImageSrc() {
    const dataBgImage = document.body.getAttribute('data-bg-image');
    if (dataBgImage) {
        return new URL(dataBgImage, location.href).href;
    }
    const pathname = location.pathname || location.href;
    const filename = pathname.split('/').pop() || pathname.replace(/^.*\//, '');
    const imgPath = PROJECT_BG_IMAGE_MAP[filename];
    if (imgPath) {
        return new URL(imgPath, location.href).href;
    }
    const imgEl = document.querySelector('.project-details-content img[src*="Details01"]') ||
        document.querySelector('.project-details-content img[src*="Details"]');
    return imgEl && !imgEl.src.startsWith('data:') ? imgEl.src : null;
}

function getProjectBgImageElement() {
    const dataBgImage = document.body.getAttribute('data-bg-image');
    if (dataBgImage) return null;
    const pathname = location.pathname || location.href;
    const filename = pathname.split('/').pop() || pathname.replace(/^.*\//, '');
    if (!PROJECT_BG_IMAGE_MAP[filename]) return null;
    const firstDetail = document.querySelector('.project-details-content img[src*="Details01"]') ||
        document.querySelector('.project-details-content img[src*="Details"]');
    return firstDetail && !firstDetail.src.startsWith('data:') ? firstDetail : null;
}

function setThemeColorForProject(color) {
    const m = document.getElementById('themeColorMeta');
    if (m) m.setAttribute('content', '#000000');
}

function applyProjectPageBackground(theme) {
    if (!document.body.classList.contains('project-detail-page')) return;
    
    if (theme !== 'light') {
        document.body.style.removeProperty('--project-bg-color');
        document.body.style.removeProperty('background-color');
        setThemeColorForProject('#111111');
        return;
    }
    
    const { sampleSize, brightnessMin, brightnessMax, alphaMin, quantizeStep, saturateBoost, lightnessReduce, fallbackColor } = PROJECT_BG_EXTRACT;
    
    function extractAndApply(img) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = sampleSize;
            canvas.height = sampleSize;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
            const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
            
            const colorCounts = {};
            const step = 4;
            for (let i = 0; i < data.length; i += step) {
                const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                if (a < alphaMin) continue;
                const brightness = (r + g + b) / 3;
                if (brightness < brightnessMin || brightness > brightnessMax) continue;
                const key = `${Math.round(r / quantizeStep) * quantizeStep},${Math.round(g / quantizeStep) * quantizeStep},${Math.round(b / quantizeStep) * quantizeStep}`;
                colorCounts[key] = (colorCounts[key] || 0) + 1;
            }
            
            let maxCount = 0, dominantKey = null;
            for (const k in colorCounts) {
                if (colorCounts[k] > maxCount) { maxCount = colorCounts[k]; dominantKey = k; }
            }
            if (!dominantKey) {
                document.body.style.backgroundColor = fallbackColor;
                setThemeColorForProject(fallbackColor);
                return;
            }
            
            const [r, g, b] = dominantKey.split(',').map(Number);
            const [adjR, adjG, adjB] = adjustColorForMatching(r, g, b, saturateBoost ?? 2.5, lightnessReduce ?? 15);
            const clampedR = Math.min(255, Math.max(0, adjR));
            const clampedG = Math.min(255, Math.max(0, adjG));
            const clampedB = Math.min(255, Math.max(0, adjB));
            const bgColor = findClosestMaterialColor(clampedR, clampedG, clampedB);
            document.body.style.setProperty('--project-bg-color', bgColor);
            document.body.style.backgroundColor = bgColor;
            setThemeColorForProject(bgColor);
        } catch (e) {
            document.body.style.backgroundColor = fallbackColor;
            setThemeColorForProject(fallbackColor);
        }
    }
    
    function loadViaImage(src, useCrossOrigin) {
        const img = new Image();
        if (useCrossOrigin) img.crossOrigin = 'anonymous';
        img.onload = () => extractAndApply(img);
        img.onerror = () => { document.body.style.backgroundColor = fallbackColor; setThemeColorForProject(fallbackColor); };
        img.src = src;
    }
    
    const domImg = getProjectBgImageElement();
    if (domImg && domImg.complete && domImg.naturalWidth > 0) {
        try { extractAndApply(domImg); } catch (_) { document.body.style.backgroundColor = fallbackColor; setThemeColorForProject(fallbackColor); }
        return;
    }
    if (domImg) {
        domImg.addEventListener('load', function onLoad() {
            domImg.removeEventListener('load', onLoad);
            try { extractAndApply(domImg); } catch (_) { document.body.style.backgroundColor = fallbackColor; setThemeColorForProject(fallbackColor); }
        });
        domImg.addEventListener('error', () => { document.body.style.backgroundColor = fallbackColor; setThemeColorForProject(fallbackColor); });
        return;
    }
    
    const imgSrc = getProjectBgImageSrc();
    if (!imgSrc) return;
    
    if (location.protocol === 'file:') {
        loadViaImage(imgSrc, false);
        return;
    }
    
    fetch(imgSrc).then(r => r.ok ? r.blob() : Promise.reject()).then(blob => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = function() {
            extractAndApply(img);
            URL.revokeObjectURL(url);
        };
        img.onerror = function() {
            URL.revokeObjectURL(url);
            loadViaImage(imgSrc, false);
        };
        img.src = url;
    }).catch(() => loadViaImage(imgSrc, true));
}

function initProjectPageBackground() {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light' && document.body.classList.contains('project-detail-page')) {
        setTimeout(() => applyProjectPageBackground('light'), 300);
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectPageBackground);
} else {
    initProjectPageBackground();
}

// Nav brand hover/클릭은 아래 DOMContentLoaded 블록에서 처리



// Smooth scroll for anchor links
function portfolioHashTargetId(href) {
    if (!href || typeof href !== 'string') return null;
    const i = href.indexOf('#');
    if (i < 0) return null;
    let id = href.slice(i + 1);
    const q = id.indexOf('?');
    if (q >= 0) id = id.slice(0, q);
    return id || null;
}

document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const id = portfolioHashTargetId(href);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
});


// Scroll to top button (optional enhancement)
let scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top-btn';
document.body.appendChild(scrollTopBtn);

// 탑 버튼 색상 업데이트 함수
function updateScrollTopBtnColor(theme) {
    if (scrollTopBtn) {
        if (theme === 'light') {
            scrollTopBtn.style.background = '#000000';
            scrollTopBtn.style.color = COLORS.YELLOW;
        } else {
            scrollTopBtn.style.background = COLORS.YELLOW;
            scrollTopBtn.style.color = COLORS.BLACK;
        }
    }
}

// 초기 테마에 맞춰 탑 버튼 색상 설정
const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
setTimeout(() => {
    updateScrollTopBtnColor(initialTheme);
}, 100);

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 스크롤 버튼 표시/숨김 최적화: requestAnimationFrame 사용
let scrollBtnRafId = null;
window.addEventListener('scroll', () => {
    if (scrollBtnRafId) return;
    scrollBtnRafId = requestAnimationFrame(() => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
        scrollBtnRafId = null;
    });
}, { passive: true });

// 탑 버튼 호버 스타일은 CSS에서 처리

// 페이지 로드 시 배경 라인·내비 등 (정적 HTML)
document.addEventListener('DOMContentLoaded', () => {
    // 해상도 변경 시 배경 라인 재생성
    let resizeTimeout;
    let isResizing = false;

    function handleResize() {
        createBackgroundLines();
    }

    window.addEventListener('resize', () => {
        if (!isResizing) {
            isResizing = true;
        }
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResize();
            isResizing = false;
        }, 250);
    }, { passive: true });

    // 배경 라인 요소들 생성 및 관리
    const backgroundLines = [];
    const lineSpacing = 640;
    const LAYER_ID = 'portfolio-bg-lines-layer';

    function removeLines(lines) {
        lines.forEach(line => line.parentNode?.removeChild(line));
        lines.length = 0;
    }

    function ensureLinesLayer() {
        let layer = document.getElementById(LAYER_ID);
        if (!layer) {
            layer = document.createElement('div');
            layer.id = LAYER_ID;
            layer.className = 'portfolio-bg-lines-layer';
            layer.setAttribute('aria-hidden', 'true');
            document.body.appendChild(layer);
        }
        return layer;
    }

    function elementDocumentTop(el) {
        const r = el.getBoundingClientRect();
        return r.top + window.scrollY;
    }

    function updateLinesLayerGeometry() {
        const layer = ensureLinesLayer();
        const nav = document.querySelector('.navbar');
        const footer = document.querySelector('.site-footer');
        const navH = nav ? nav.offsetHeight : 80;
        if (!footer) {
            layer.style.top = `${navH}px`;
            layer.style.height = '0px';
            return;
        }
        const footerTop = elementDocumentTop(footer);
        const h = Math.max(0, Math.round(footerTop - navH));
        layer.style.top = `${navH}px`;
        layer.style.height = `${h}px`;
    }

    function createVerticalLine(layer, left, index) {
        const line = document.createElement('div');
        line.className = index === 1 ? 'background-line background-line-second' : 'background-line';

        Object.assign(line.style, {
            left: `${left}px`,
            position: 'absolute',
            top: '0',
            bottom: '0',
            width: '1px',
            pointerEvents: 'none',
            transition: 'left 0.1s ease-out',
        });
        layer.appendChild(line);
        return line;
    }

    function getBackgroundLinesAnchor() {
        return (
            document.getElementById('animatedTitle') ||
            document.querySelector('main .hero-content .section-title') ||
            document.querySelector('main h1.section-title')
        );
    }

    function getThumbnailColumnRhythm() {
        var grid = document.getElementById('portfolioGrid')
            || document.querySelector('#labsGrid, #artGrid');
        if (!grid || grid.classList.contains('text-view')) return null;
        var thumbs = grid.querySelectorAll('.portfolio-thumbnail');
        if (!thumbs.length) return null;
        var rects = [];
        for (var i = 0; i < thumbs.length; i++) {
            rects.push(thumbs[i].getBoundingClientRect());
        }
        var minTop = Math.min.apply(null, rects.map(function (r) { return r.top; }));
        var firstRow = rects.filter(function (r) { return Math.abs(r.top - minTop) < 8; });
        if (!firstRow.length) return null;
        firstRow.sort(function (a, b) { return a.left - b.left; });
        var step = lineSpacing;
        if (firstRow.length >= 2) {
            var s = Math.round(firstRow[1].left - firstRow[0].left);
            if (s >= 100 && s <= 2000) step = s;
        }
        var startX = Math.round(firstRow[0].left);
        return { startX: startX, step: step };
    }

    function createBackgroundLines() {
        updateLinesLayerGeometry();
        const layer = ensureLinesLayer();
        removeLines(backgroundLines);

        var windowWidth = window.innerWidth;
        var isMobile = windowWidth <= 768;
        var rhythm = getThumbnailColumnRhythm();
        var anchor = getBackgroundLinesAnchor();
        if (!rhythm && !anchor) return;

        var firstLineLeft;
        var step = lineSpacing;
        if (rhythm) {
            firstLineLeft = rhythm.startX;
            step = rhythm.step;
        } else {
            firstLineLeft = Math.round(anchor.getBoundingClientRect().left);
        }

        var positions = [];
        var seen = {};
        function addPos(x) {
            var k = Math.round(x);
            if (seen[k]) return;
            seen[k] = true;
            positions.push(k);
        }

        if (isMobile) {
            var secondLineLeft = windowWidth / 2;
            var calculatedSpacing = secondLineLeft - firstLineLeft;
            addPos(firstLineLeft);
            addPos(secondLineLeft);
            var x;
            for (x = secondLineLeft + calculatedSpacing; x < windowWidth; x += calculatedSpacing) {
                addPos(x);
            }
            for (x = firstLineLeft - calculatedSpacing; x >= 0; x -= calculatedSpacing) {
                addPos(x);
            }
        } else {
            var left;
            for (left = firstLineLeft; left < windowWidth; left += step) {
                addPos(left);
            }
            for (left = firstLineLeft - step; left >= 0; left -= step) {
                addPos(left);
            }
        }

        positions.sort(function (a, b) { return a - b; });
        for (var li = 0; li < positions.length; li++) {
            backgroundLines.push(createVerticalLine(layer, positions[li], li));
        }
    }

    let bodyLineObserveStarted = false;
    let contentRoTimer = 0;
    let contentResizeObserver = null;
    function observeBodyForLines() {
        if (bodyLineObserveStarted || typeof ResizeObserver === 'undefined') return;
        bodyLineObserveStarted = true;
        contentResizeObserver = new ResizeObserver(() => {
            clearTimeout(contentRoTimer);
            contentRoTimer = window.setTimeout(createBackgroundLines, 100);
        });
        contentResizeObserver.observe(document.body);
    }
    
    // 초기 실행
    setTimeout(() => {
        createBackgroundLines();
        observeBodyForLines();
    }, 100);
    
    // 리사이즈 이벤트는 위의 handleResize 함수에서 통합 처리됨
    
    // nav-brand (스크램블 없이 텍스트만 전환)
    const navBrand = document.getElementById('navBrandAnimated');
    if (navBrand) {
        const navBrandTitles = ['welcome to'];
        const hoverText = '← go to home';
        const isIndexPage = !/(?:\/works\/|\/labs\/)/.test(window.location.pathname);
        navBrand.textContent = navBrandTitles[0];

        const brandIsLink = navBrand.tagName === 'A';

        if (!isIndexPage) {
            navBrand.addEventListener('mouseenter', () => {
                navBrand.textContent = hoverText;
            });
            navBrand.addEventListener('mouseleave', () => {
                navBrand.textContent = navBrandTitles[0];
            });
        }

        let isTouching = false;
        let touchHandled = false;

        navBrand.addEventListener('touchstart', () => {
            isTouching = true;
            touchHandled = false;
            if (!isIndexPage) {
                navBrand.textContent = hoverText;
            }
        });

        navBrand.addEventListener('touchend', () => {
            if (brandIsLink) {
                isTouching = false;
                if (!isIndexPage) {
                    navBrand.textContent = navBrandTitles[0];
                }
                return;
            }
            if (isTouching && !touchHandled) {
                touchHandled = true;
                isTouching = false;
                const isProjectPage =
                    window.location.pathname.includes('/works/') ||
                    window.location.pathname.includes('/labs/');
                if (isProjectPage) {
                    window.location.href = '../index.html';
                } else {
                    window.location.reload();
                }
            }
        });

        navBrand.addEventListener('touchcancel', () => {
            isTouching = false;
            if (!isIndexPage) {
                navBrand.textContent = navBrandTitles[0];
            }
        });

        if (!brandIsLink) {
            navBrand.style.cursor = 'pointer';
            navBrand.addEventListener('click', (e) => {
                if (touchHandled) {
                    e.preventDefault();
                    return;
                }
                const isProjectPage =
                    window.location.pathname.includes('/works/') ||
                    window.location.pathname.includes('/labs/');
                if (isProjectPage) {
                    window.location.href = '../index.html';
                } else {
                    window.location.reload();
                }
            });
        }
    }
    
    // 모바일에서도 링크가 새창으로 열리도록 처리
    const projectLinks = document.querySelectorAll('.experience-projects a');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 모바일에서도 확실하게 새창으로 열리도록 처리
            const url = this.getAttribute('href');
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
                e.preventDefault();
            }
        });
    });
    
    // 포트폴리오 뷰 전환 기능 (Works & Labs 동기화)
    const viewToggleButtons = document.querySelectorAll('.view-toggle-btn');
    const portfolioSections = document.querySelectorAll('.portfolio-section');

    const applyViewMode = (view) => {
        portfolioSections.forEach(section => {
            const sectionGrid = section.querySelector('.portfolio-grid');
            if (!sectionGrid) return;

            if (view === 'text') {
                sectionGrid.classList.add('text-view');
            } else {
                sectionGrid.classList.remove('text-view');
            }
        });

        viewToggleButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
    };

    viewToggleButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const view = this.dataset.view;
            applyViewMode(view);
            localStorage.setItem('portfolioView', view);
        });
    });

    const savedView = localStorage.getItem('portfolioView') || 'grid';
    applyViewMode(savedView);
    
    // 플로팅 버튼 기능: Creative Director(About) 영역을 제외한 모든 영역에서 등장
    const portfolioViewToggle = document.querySelector('.portfolio-view-toggle');
    const aboutSection = document.getElementById('about');
    
    if (portfolioViewToggle && aboutSection) {
        const navbar = document.querySelector('.navbar');
        const navHeight = navbar ? navbar.offsetHeight : 80;
        document.documentElement.style.setProperty('--nav-height', `${navHeight}px`);
        
        let aboutSectionInView = false;
        
        const updateFloating = () => {
            const isInPortfolioArea = !aboutSectionInView;
            
            if (isInPortfolioArea) {
                portfolioViewToggle.classList.remove('floating-exit');
                portfolioViewToggle.classList.add('floating');
                document.body.classList.add('portfolio-floating-active');
                document.body.classList.remove('portfolio-floating-inactive');
            } else {
                if (portfolioViewToggle.classList.contains('floating')) {
                    portfolioViewToggle.classList.add('floating-exit');
                    portfolioViewToggle.addEventListener('animationend', function onExitEnd() {
                        portfolioViewToggle.classList.remove('floating', 'floating-exit');
                        document.body.classList.remove('portfolio-floating-active');
                        document.body.classList.add('portfolio-floating-inactive');
                    }, { once: true });
                } else {
                    document.body.classList.remove('portfolio-floating-active');
                    document.body.classList.add('portfolio-floating-inactive');
                }
            }
        };
        
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                aboutSectionInView = entry.isIntersecting;
            });
            updateFloating();
        }, { threshold: 0, rootMargin: '0px' });
        
        aboutObserver.observe(aboutSection);
        
        const checkInitial = () => {
            const r = aboutSection.getBoundingClientRect();
            aboutSectionInView = r.bottom > 0 && r.top < window.innerHeight;
            updateFloating();
        };
        setTimeout(checkInitial, 100);
        
        // 모바일 회전/리사이즈 시 navHeight 재계산
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const nh = navbar ? navbar.offsetHeight : 80;
                document.documentElement.style.setProperty('--nav-height', `${nh}px`);
            }, 150);
        });
    }

    // Design System Details01: WebGL + Shader 그라데이션 (Hume AI 스타일 유기적 모션, 기존 3색)
    if (window.location.pathname.includes('design-system')) {
        const wrap = document.querySelector('.project-image-detail-gradient-wrap');
        const gradientBg = wrap && wrap.querySelector('.gradient-bg');
        if (gradientBg && wrap) {
            const vertexSource = `
                attribute vec2 a_position;
                varying vec2 v_uv;
                void main() {
                    v_uv = a_position * 0.5 + 0.5;
                    gl_Position = vec4(a_position, 0.0, 1.0);
                }
            `;
            const fragmentSource = `
                precision highp float;
                uniform vec2 u_resolution;
                uniform float u_time;
                varying vec2 v_uv;
                void main() {
                    vec2 uv = v_uv;
                    vec3 color1 = vec3(1.0, 0.25, 0.0);
                    vec3 color2 = vec3(1.0, 0.0, 0.15);
                    vec3 color3 = vec3(0.95, 0.0, 1.0);
                    float t = u_time * 0.4;
                    vec2 p1 = vec2(0.35 + 0.28 * sin(t), 0.35 + 0.28 * cos(t * 0.73));
                    vec2 p2 = vec2(0.5 + 0.32 * sin(t * 0.87 + 2.1), 0.62 + 0.28 * cos(t * 0.61 + 1.2));
                    vec2 p3 = vec2(0.68 + 0.28 * sin(t * 0.91 + 4.2), 0.48 + 0.32 * cos(t * 0.53 + 2.5));
                    float d1 = distance(uv, p1);
                    float d2 = distance(uv, p2);
                    float d3 = distance(uv, p3);
                    float soft = 2.2;
                    float c1 = exp(-d1 * d1 * soft) * 1.4;
                    float c2 = exp(-d2 * d2 * soft) * 1.4;
                    float c3 = exp(-d3 * d3 * soft) * 2.4;
                    float sum = c1 + c2 + c3 + 0.001;
                    vec3 col = (c1 * color1 + c2 * color2 + c3 * color3) / sum;
                    col = pow(col, vec3(0.92));
                    gl_FragColor = vec4(col, 1.0);
                }
            `;
            const canvas = document.createElement('canvas');
            canvas.className = 'gradient-canvas';
            canvas.setAttribute('aria-hidden', 'true');
            gradientBg.style.background = 'transparent';
            gradientBg.appendChild(canvas);
            const gl = canvas.getContext('webgl', { alpha: false, antialias: true });
            if (!gl) return;
            const program = gl.createProgram();
            const vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vs, vertexSource);
            gl.compileShader(vs);
            if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) return;
            const fs = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fs, fragmentSource);
            gl.compileShader(fs);
            if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) return;
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
            gl.useProgram(program);
            const buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
            const locPos = gl.getAttribLocation(program, 'a_position');
            gl.enableVertexAttribArray(locPos);
            gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);
            const locRes = gl.getUniformLocation(program, 'u_resolution');
            const locTime = gl.getUniformLocation(program, 'u_time');
            let rafId = 0;
            function resize() {
                const rect = wrap.getBoundingClientRect();
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                const w = Math.round(rect.width * dpr);
                const h = Math.round(rect.height * dpr);
                if (canvas.width !== w || canvas.height !== h) {
                    canvas.width = w;
                    canvas.height = h;
                    canvas.style.width = rect.width + 'px';
                    canvas.style.height = rect.height + 'px';
                }
            }
            function draw() {
                resize();
                gl.viewport(0, 0, canvas.width, canvas.height);
                gl.uniform2f(locRes, canvas.width, canvas.height);
                gl.uniform1f(locTime, performance.now() * 0.001);
                gl.clearColor(1, 0, 0.22, 1);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
                rafId = requestAnimationFrame(draw);
            }
            resize();
            draw();
            const ro = new ResizeObserver(() => { resize(); });
            ro.observe(wrap);
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) cancelAnimationFrame(rafId);
                else draw();
            });
        }
    }
});

