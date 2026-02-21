// 컬러 상수 정의
const COLORS = {
    YELLOW: '#FFFF00',
    BLACK: '#000000',
    YELLOW_20: 'rgba(255, 255, 0, 0.2)',
    SHADOW: 'rgba(0, 0, 0, 0.2)'
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
    const navTargets = ['about', 'works', 'labs'];
    const navLinksHtml = navTargets.map(section => {
        const hrefValue = isIndexPath ? `#${section}` : `${baseHref}#${section}`;
        return `<a href="${hrefValue}" class="nav-menu-item text-nav-menu">${section.charAt(0).toUpperCase() + section.slice(1)}</a>`;
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
        const lineColor = theme === 'light' ? 'rgba(0, 0, 0, 0.2)' : COLORS.YELLOW_20;
        
        allLines.forEach(line => {
            if (line.classList.contains('background-line')) {
                // 세로 라인은 CSS로 처리되지만, 필요시 인라인 스타일도 업데이트
                line.style.background = theme === 'light' ? '#000000' : COLORS.YELLOW;
            } else if (line.classList.contains('background-line-short')) {
                line.style.background = lineColor;
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
    'martplus.html': 'images/MartPlus/thumbnail.png',
    '11kitiz-s2.html': 'images/11Kitties/thumbnail.png',
    'ootd.html': 'images/ootd/thumbnail.png',
    'design-system.html': 'images/DesignSystem/thumbnail.png',
    'ooah.html': 'images/ooah/thumbnail.svg',
    '11street-dx.html': 'images/eXperience/thumbnail.png',
    'amazon-global-store.html': 'images/AmazonGlobalStore/thumbnail.png',
    'lab-1.html': 'images/InteractiveAnalogClock/thumbnail.png',
    'lab-2.html': 'images/Lab2/thumbnail.png',
    'lab-3.html': 'images/Lab3/thumbnail.png',
    'lab-4.html': 'images/Lab4/thumbnail.png'
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

// Nav brand click 이벤트는 nav-brand 애니메이션 부분에서 처리됨



// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for sticky navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
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

// Airport Display Board Animation
const titles = ['Hwang Seonyoon', 'Creative Director', 'Product Designer'];
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
let currentTitleIndex = 0;
let isAnimating = false;

function getRandomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
}

// 바이트 수 계산 함수
function getByteLength(str) {
    let byteLength = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        if (char <= 0x007F) {
            byteLength += 1; // ASCII
        } else if (char <= 0x07FF) {
            byteLength += 2; // Latin, Greek, Cyrillic, etc.
        } else {
            byteLength += 3; // 한글, 중국어 등
        }
    }
    return byteLength;
}

function animateToText(targetText, element, isLooping = false, loopTitles = [], onComplete = null) {
    const targetByteLength = getByteLength(targetText);
    let currentText = '';
    let iterations = 0;
    const maxIterations = 20; // 랜덤 문자 반복 횟수
    let revealedLength = 0; // 현재까지 노출된 문자 수
    
    if (element.dataset.animating === 'true') return;
    element.dataset.animating = 'true';
    
    // 레이아웃 시프트 방지: 최종 텍스트의 높이를 미리 계산하여 고정
    const originalHeight = element.style.height;
    const originalMinHeight = element.style.minHeight;
    element.textContent = targetText;
    const finalHeight = element.offsetHeight;
    element.style.height = finalHeight + 'px';
    element.style.minHeight = finalHeight + 'px';
    element.textContent = '';
    
    const interval = setInterval(() => {
        if (iterations < maxIterations) {
            // 순차적으로 앞글자부터 노출
            const revealProgress = Math.min(1, iterations / maxIterations);
            revealedLength = Math.floor(targetText.length * revealProgress);
            
            currentText = '';
            let currentByteLength = 0;
            
            for (let i = 0; i < targetText.length; i++) {
                const char = targetText[i];
                const charByteLength = getByteLength(char);
                
                if (i < revealedLength) {
                    // 이미 노출된 문자는 실제 문자 사용
                    currentText += char;
                    currentByteLength += charByteLength;
                } else {
                    // 아직 노출되지 않은 문자는 랜덤 문자로
                    if (currentByteLength + charByteLength <= targetByteLength) {
                        // 바이트 수를 맞추기 위해 랜덤 문자 추가
                        if (charByteLength === 1) {
                            currentText += getRandomChar();
                            currentByteLength += 1;
                        } else if (charByteLength === 2) {
                            // 2바이트 문자 (예: 그리스어 등)
                            currentText += getRandomChar() + getRandomChar();
                            currentByteLength += 2;
                        } else {
                            // 3바이트 문자 (한글 등)
                            currentText += getRandomChar() + getRandomChar() + getRandomChar();
                            currentByteLength += 3;
                        }
                    }
                }
            }
            
            // 바이트 수가 부족하면 랜덤 문자로 채우기
            while (currentByteLength < targetByteLength) {
                currentText += getRandomChar();
                currentByteLength += 1;
            }
            
            element.textContent = currentText;
            iterations++;
        } else {
            // 최종 텍스트로 정착 (위첨자 표기 필요한 경우 innerHTML 사용)
            if (targetText === '11KittiesSeason 2') {
                element.innerHTML = '11Kitties<sup>Season 2</sup>';
            } else if (targetText === 'MartPlus') {
                element.innerHTML = 'Mart<sup>Plus</sup>';
            } else {
                element.textContent = targetText;
            }
            // 높이 고정 해제 (자동 높이로 복원)
            element.style.height = '';
            element.style.minHeight = '';
            clearInterval(interval);
            element.dataset.animating = 'false';
            
            // 완료 콜백 실행
            if (onComplete) {
                onComplete();
            }
            
            // 루핑 모드인 경우에만 다음 문장으로 전환
            if (isLooping && loopTitles.length > 0) {
                setTimeout(() => {
                    currentTitleIndex = (currentTitleIndex + 1) % loopTitles.length;
                    animateToText(loopTitles[currentTitleIndex], element, true, loopTitles);
                }, 3000);
            }
        }
    }, 50); // 50ms마다 업데이트
}

// 섹션별 이모티콘 매핑 (모든 OS 호환성 고려)
const EMOJI_MAP = {
    'Creative Director': '🥳',
    'Creative Director Hwang Seonyoon': '🥳',
    'Core Competencies': '🖋️',
    'Career Experience': '💡',
    'Education': '🎒',
    'Awards': '🪅',
    'Activities': '🪄',
    'Cover Letter': '🦄',
    'Works': '💎',
    'Labs': '🧪',
    'About': '😎',
    'MartPlus': '🎨',
    'Design System': '🎨',
    'PDP UX': '🎨',
    '11Kitties': '🎨',
    '#OOTD Fashion': '🎨',
    'OOAh Luxury': '🎨',
    'OOAh': '🎨',
    '11STREET Design eXperience': '🎨',
    '11KittiesSeason 2': '🎨',
    '#ootd': '🎨',
    'Amazon Global Store': '🎨'
};

// 페이지 로드 시 메인 타이틀 및 섹션 제목 애니메이션을 위한 Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
    // 섹션 제목 애니메이션을 위한 Intersection Observer
    const sectionTitleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const targetText = entry.target.dataset.title;
            if (targetText) {
                // 이미 애니메이션이 실행되었는지 확인
                if (entry.target.dataset.animated === 'true') {
                    return; // 이미 실행되었으면 더 이상 실행하지 않음
                }
                
                if (entry.isIntersecting) {
                    // 영역에 들어올 때 한 번만 애니메이션 실행
                    entry.target.dataset.animated = 'true';
                    
                    // (Season 2), Plus 등 위첨자 표기가 필요한 타이틀은 애니메이션 없이 즉시 표기
                    if (targetText === '11KittiesSeason 2') {
                        entry.target.innerHTML = '11Kitties<sup>Season 2</sup>';
                        entry.target.style.height = '';
                        entry.target.style.minHeight = '';
                        return;
                    }
                    if (targetText === 'MartPlus') {
                        entry.target.innerHTML = 'Mart<sup>Plus</sup>';
                        entry.target.style.height = '';
                        entry.target.style.minHeight = '';
                        return;
                    }
                    
                    // 최종 텍스트의 높이를 미리 계산하여 고정
                    const tempHeight = entry.target.style.height;
                    entry.target.textContent = targetText;
                    const finalHeight = entry.target.offsetHeight;
                    entry.target.style.height = finalHeight + 'px';
                    entry.target.style.minHeight = finalHeight + 'px';
                    entry.target.textContent = '';
                    setTimeout(() => {
                        animateToText(targetText, entry.target, false);
                    }, 300);
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // 섹션 타이틀에 박스 추가 및 위치 업데이트 함수
    function updateTitleBox(title) {
        // portfolio-info 내의 타이틀은 이모지를 표시하지 않음
        if (title.closest('.portfolio-info')) {
            return;
        }
        
        // 기존 박스가 있으면 제거
        const existingBox = title.querySelector('.section-title-box');
        if (existingBox) {
            existingBox.remove();
        }
        
        // 텍스트 내용 가져오기
        const text = title.textContent || title.dataset.title || '';
        if (!text || text.length < 1) return;
        
        // 텍스트 노드 찾기
        let textNode = null;
        for (let node of title.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                textNode = node;
                break;
            }
        }
        
        if (!textNode) return;
        
        // 마지막 1.5개 음절 위치 계산
        const textLength = text.length;
        if (textLength < 2) {
            // 2글자 미만이면 마지막 1글자만 사용
            const lastOneCharStart = textLength - 1;
            const lastOneCharEnd = textLength;
            
            try {
                const range = document.createRange();
                range.setStart(textNode, lastOneCharStart);
                range.setEnd(textNode, lastOneCharEnd);
                
                const rect = range.getBoundingClientRect();
                const titleRect = title.getBoundingClientRect();
                
                // 박스 생성
                const box = document.createElement('div');
                box.className = 'section-title-box';
                
                // 박스 위치 계산 (마지막 1글자와 겹치게)
                const boxLeft = rect.left - titleRect.left;
                const boxTop = rect.top - titleRect.top;
                
                // Y축을 위로 20% 올리기 (박스 높이의 20%)
                const isMobile = window.innerWidth <= 768;
                const boxHeight = isMobile ? 120 : 200;
                const offsetY = boxHeight * 0.2;
                const adjustedTop = boxTop - offsetY;
                
                // 기울기 각도 고정
                let rotation = parseFloat(title.dataset.boxRotation);
                if (isNaN(rotation)) {
                    rotation = (Math.random() * 30) - 15;
                    title.dataset.boxRotation = rotation.toString();
                }
                
                // 섹션별 이모티콘 매핑
                const sectionTitle = title.dataset.title || text;
                const emoji = EMOJI_MAP[sectionTitle] || '';
                
                if (emoji) {
                    const emojiElement = document.createElement('span');
                    emojiElement.className = 'section-title-box-emoji';
                    emojiElement.setAttribute('role', 'img');
                    emojiElement.setAttribute('aria-label', `${sectionTitle} icon`);
                    emojiElement.textContent = emoji;
                    emojiElement.style.cursor = 'pointer';
                    emojiElement.style.pointerEvents = 'auto';
                    const emojiFontSize = isMobile ? 70 : 100;
                    emojiElement.style.fontSize = `${emojiFontSize}px`;
                    
                    const handleEmojiClick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const originalTop = parseFloat(box.dataset.originalTop) || adjustedTop;
                        const currentTop = parseFloat(box.style.top) || originalTop;
                        const newTop = currentTop - 80;
                        box.style.top = `${newTop}px`;
                        box.style.transition = 'top 0.3s ease-out';
                        setTimeout(() => {
                            box.style.top = `${originalTop}px`;
                            setTimeout(() => {
                                box.style.transition = '';
                            }, 300);
                        }, 300);
                    };
                    
                    emojiElement.addEventListener('click', handleEmojiClick);
                    emojiElement.addEventListener('touchstart', handleEmojiClick);
                    box.appendChild(emojiElement);
                }
                
                const boxWidth = isMobile ? 120 : 200;
                box.style.width = `${boxWidth}px`;
                box.style.height = `${boxHeight}px`;
                box.style.left = `${boxLeft}px`;
                box.style.top = `${adjustedTop}px`;
                box.style.transform = `rotate(${rotation}deg)`;
                box.style.transformOrigin = 'center center';
                box.dataset.originalTop = adjustedTop;
                title.appendChild(box);
            } catch (e) {
                // 에러 발생 시 무시
            }
            return;
        }
        
        // 마지막 2글자 범위 구하기 (1.5개 음절 계산용)
        const lastTwoCharsStart = textLength - 2;
        const lastTwoCharsEnd = textLength;
        
        try {
            // 마지막 2글자의 범위
            const rangeTwoChars = document.createRange();
            rangeTwoChars.setStart(textNode, lastTwoCharsStart);
            rangeTwoChars.setEnd(textNode, lastTwoCharsEnd);
            const rectTwoChars = rangeTwoChars.getBoundingClientRect();
            
            // 마지막 1글자의 범위
            const rangeOneChar = document.createRange();
            rangeOneChar.setStart(textNode, textLength - 1);
            rangeOneChar.setEnd(textNode, textLength);
            const rectOneChar = rangeOneChar.getBoundingClientRect();
            
            const titleRect = title.getBoundingClientRect();
            
            // 박스 생성
            const box = document.createElement('div');
            box.className = 'section-title-box';
            
            // 마지막 1.8개 음절 위치 계산
            // 마지막 1글자의 시작 위치에서 그 앞 0.8글자 너비만큼 왼쪽으로 이동
            const lastCharWidth = rectOneChar.width;
            const twoCharsWidth = rectTwoChars.width;
            const prevCharWidth = twoCharsWidth - lastCharWidth; // 앞 글자의 전체 너비
            const pointEightCharWidth = prevCharWidth * 0.8; // 앞 글자의 0.8배 너비
            
            // 박스 위치 계산 (마지막 1.8개 음절과 겹치게)
            const boxLeft = rectOneChar.left - titleRect.left - pointEightCharWidth;
            const boxTop = rectOneChar.top - titleRect.top;
            
            // Y축을 위로 20% 올리기 (박스 높이의 20%)
            // 모바일 환경 고려: 화면 너비에 따라 박스 높이 결정
            const isMobile = window.innerWidth <= 768;
            const boxWidth = isMobile ? 120 : 200;
            const boxHeight = isMobile ? 120 : 200;
            const emojiFontSize = isMobile ? 70 : 100;
            const offsetY = boxHeight * 0.2;
            const adjustedTop = boxTop - offsetY;
            
            // 기울기 각도 고정 (각 타이틀마다 한 번만 생성하여 저장)
            let rotation = parseFloat(title.dataset.boxRotation);
            if (isNaN(rotation)) {
                // 각도가 없으면 새로 생성하고 저장
                rotation = (Math.random() * 30) - 15; // -15도 ~ +15도
                title.dataset.boxRotation = rotation.toString();
            }
            
            const sectionTitle = title.dataset.title || text;
            const emoji = EMOJI_MAP[sectionTitle] || '';
            
            // 이모티콘 요소 생성
            if (emoji) {
                const emojiElement = document.createElement('span');
                emojiElement.className = 'section-title-box-emoji';
                emojiElement.setAttribute('role', 'img');
                emojiElement.setAttribute('aria-label', `${sectionTitle} icon`);
                emojiElement.textContent = emoji;
                emojiElement.style.cursor = 'pointer';
                emojiElement.style.pointerEvents = 'auto';
                // 모바일에서 이모티콘 폰트 크기 명시적으로 설정
                emojiElement.style.fontSize = `${emojiFontSize}px`;
                
                // 클릭/터치 이벤트: y축 위로 80px 이동
                const handleEmojiClick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const originalTop = parseFloat(box.dataset.originalTop) || adjustedTop;
                    const currentTop = parseFloat(box.style.top) || originalTop;
                    const newTop = currentTop - 80;
                    
                    box.style.top = `${newTop}px`;
                    box.style.transition = 'top 0.3s ease-out';
                    
                    // 애니메이션 완료 후 원래 위치로 복귀
                    setTimeout(() => {
                        box.style.top = `${originalTop}px`;
                        setTimeout(() => {
                            box.style.transition = '';
                        }, 300);
                    }, 300);
                };
                
                emojiElement.addEventListener('click', handleEmojiClick);
                emojiElement.addEventListener('touchstart', handleEmojiClick);
                
                box.appendChild(emojiElement);
            }
            
            // 박스 크기를 인라인 스타일로 명시적으로 설정 (사파리 브라우저 호환성)
            box.style.width = `${boxWidth}px`;
            box.style.height = `${boxHeight}px`;
            box.style.left = `${boxLeft}px`;
            box.style.top = `${adjustedTop}px`;
            box.style.transform = `rotate(${rotation}deg)`;
            box.style.transformOrigin = 'center center';
            box.dataset.originalTop = adjustedTop; // 원래 위치 저장
            
            title.appendChild(box);
        } catch (e) {
            // 에러 발생 시 무시
        }
    }
    
    // 모든 애니메이션 섹션 제목 관찰
    const animatedSectionTitles = document.querySelectorAll('.animated-section-title');
    animatedSectionTitles.forEach(title => {
        // portfolio-info 내부의 타이틀은 애니메이션 제외
        if (title.closest('.portfolio-info')) {
            // 텍스트를 즉시 표시 (애니메이션 없이)
            const targetText = title.dataset.title || title.textContent;
            if (targetText) {
                if (targetText === '11KittiesSeason 2') {
                    title.innerHTML = '11Kitties<sup>Season 2</sup>';
                } else if (targetText === 'MartPlus') {
                    title.innerHTML = 'Mart<sup>Plus</sup>';
                } else {
                    title.textContent = targetText;
                }
            }
            return;
        }
        sectionTitleObserver.observe(title);
        
        // 애니메이션 완료 후 박스 업데이트를 위한 MutationObserver
        let mutationTimeout = null;
        const boxObserver = new MutationObserver(() => {
            // 디바운싱으로 불필요한 업데이트 방지
            if (mutationTimeout) {
                clearTimeout(mutationTimeout);
            }
            mutationTimeout = setTimeout(() => {
                const text = title.textContent || '';
                const targetText = title.dataset.title || '';
                // 텍스트가 완성되었을 때만 박스 업데이트
                if (text && text === targetText && text.length >= 1) {
                    updateTitleBox(title);
                }
                mutationTimeout = null;
            }, 150); // 100ms에서 150ms로 조정하여 성능 개선
        });
        
        boxObserver.observe(title, {
            childList: true,
            characterData: true,
            subtree: true
        });
        
        // 초기 박스 추가 시도
        setTimeout(() => {
            updateTitleBox(title);
        }, 2000);
    });
    
    // 해상도 변경 시 모든 section-title-box 위치 재조정
    let resizeTimeout;
    let isResizing = false;
    
    function handleResize() {
        // 타이틀 박스 위치 재조정
        const allSectionTitles = document.querySelectorAll('.animated-section-title');
        allSectionTitles.forEach(title => {
            const text = title.textContent || title.dataset.title || '';
            if (text && text.length >= 1) {
                updateTitleBox(title);
            }
        });
        
        // 배경 라인 재생성
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
        }, 250); // 디바운싱을 위해 250ms 대기
    }, { passive: true });
    
    // 배경 라인 요소들 생성 및 관리
    const backgroundLines = [];
    const shortLines = [];
    const lineSpacing = 640;
    const shortLineSpacing = 640;
    const minLineGap = 20;
    const maxAttempts = 100;
    const shortLineConfig = {
        minLength: 10,
        maxLength: 100,
        lengthStep: 10,
        minSpeed: 0.4,
        maxSpeed: 0.6,
        minCount: 3,
        maxCount: 5,
        opacity: 0.2
    };
    let animationFrameId = null;
    
    // 라인 제거 헬퍼 함수
    function removeLines(lines) {
        lines.forEach(line => line.parentNode?.removeChild(line));
        lines.length = 0;
    }
    
    // 배경 세로 라인 생성 헬퍼 함수 (index: 0=1번째, 1=2번째, ... 짝수번째는 투명도 0%)
    function createVerticalLine(left, index) {
        const line = document.createElement('div');
        line.className = index === 1 ? 'background-line background-line-second' : 'background-line';
        
        // 현재 테마에 따라 배경색 설정
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const lineColor = currentTheme === 'light' ? '#000000' : COLORS.YELLOW;
        
        // 짝수번째(2,4,6...) 그려지는 구분선: 투명도 10%
        const lineOpacity = '0.1';
        const isProjectDetailPage = document.body.classList.contains('project-detail-page');
        const lineZIndex = (index === 1 && isProjectDetailPage) ? '-1' : '9999';
        const navbar = document.querySelector('.navbar');
        const navHeight = navbar ? navbar.offsetHeight : 80;
        
        Object.assign(line.style, {
            left: `${left}px`,
            top: `${navHeight}px`,
            height: `calc(100vh - ${navHeight}px)`,
            background: lineColor,
            opacity: lineOpacity,
            position: 'fixed',
            width: '1px',
            zIndex: lineZIndex,
            pointerEvents: 'none',
            transition: 'opacity 0.1s ease-out, left 0.1s ease-out'
        });
        document.body.appendChild(line);
        return line;
    }
    
    // 겹치지 않는 Y축 위치 찾기
    function findNonOverlappingY(usedPositions, lineHeight, viewportHeight) {
        for (let attempts = 0; attempts < maxAttempts; attempts++) {
            const randomY = Math.random() * (viewportHeight - lineHeight);
            const lineTop = randomY;
            const lineBottom = randomY + lineHeight;
            
            const overlaps = usedPositions.some(used => {
                const usedBottom = used.top + used.height;
                return !(lineBottom + minLineGap < used.top || lineTop > usedBottom + minLineGap);
            });
            
            if (!overlaps) return randomY;
        }
        return null;
    }
    
    // 랜덤 짧은 라인 생성
    function createRandomShortLine(leftPosition, usedPositions) {
        const viewportHeight = window.innerHeight;
        const randomHeight = (Math.floor(Math.random() * 10) + 1) * shortLineConfig.lengthStep;
        const randomY = findNonOverlappingY(usedPositions, randomHeight, viewportHeight);
        
        if (randomY === null) return null;
        
        const shortLine = document.createElement('div');
        shortLine.className = 'background-line-short';
        const speed = Math.random() * (shortLineConfig.maxSpeed - shortLineConfig.minSpeed) + shortLineConfig.minSpeed;
        
        // 현재 테마에 따라 색상 결정
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const lineColor = currentTheme === 'light' ? 'rgba(0, 0, 0, 0.2)' : COLORS.YELLOW_20;
        
        Object.assign(shortLine.style, {
            position: 'fixed',
            left: `${leftPosition}px`,
            width: '1px',
            height: `${randomHeight}px`,
            top: `${randomY}px`,
            background: lineColor,
            zIndex: '1',
            pointerEvents: 'none',
            transition: 'none'
        });
        
        shortLine.dataset.speed = speed;
        document.body.appendChild(shortLine);
        shortLines.push(shortLine);
        usedPositions.push({ top: randomY, height: randomHeight });
        
        return shortLine;
    }
    
    // 애니메이션 함수
    function animateShortLines() {
        const viewportHeight = window.innerHeight;
        
        for (const line of shortLines) {
            const currentTop = parseFloat(line.style.top) || 0;
            const speed = parseFloat(line.dataset.speed) || shortLineConfig.minSpeed;
            const lineHeight = parseFloat(line.style.height) || shortLineConfig.minLength;
            const newTop = currentTop + speed;
            
            line.style.top = newTop > viewportHeight ? `${-lineHeight}px` : `${newTop}px`;
        }
        
        animationFrameId = requestAnimationFrame(animateShortLines);
    }
    
    function createBackgroundLines() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        
        removeLines(backgroundLines);
        removeLines(shortLines);
        
        const creativeDirectorTitle = document.getElementById('animatedTitle');
        if (!creativeDirectorTitle) return;
        
        const firstLineLeft = creativeDirectorTitle.getBoundingClientRect().left;
        const windowWidth = window.innerWidth;
        
        // 모바일 여부 확인하여 라인 간격 조정
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 모바일: 두 번째 라인을 디바이스 정가운데에 위치
            const secondLineLeft = windowWidth / 2;
            const calculatedSpacing = secondLineLeft - firstLineLeft;
            
            let lineIndex = 0;
            // 첫 번째 라인 생성
            backgroundLines.push(createVerticalLine(firstLineLeft, lineIndex++));
            
            // 두 번째 라인 생성 (정가운데)
            backgroundLines.push(createVerticalLine(secondLineLeft, lineIndex++));
            
            // 오른쪽으로 라인 생성 (두 번째 라인부터 동일한 간격으로)
            for (let left = secondLineLeft + calculatedSpacing; left < windowWidth; left += calculatedSpacing) {
                backgroundLines.push(createVerticalLine(left, lineIndex++));
            }
            
            // 왼쪽으로 라인 생성 (첫 번째 라인부터 동일한 간격으로)
            for (let left = firstLineLeft - calculatedSpacing; left >= 0; left -= calculatedSpacing) {
                backgroundLines.push(createVerticalLine(left, lineIndex++));
            }
            
            /* 떨어지는 세로 구분선 모션 비활성 */
        } else {
            // PC: 스크린 처음부터 끝까지 세로 라인 생성
            const currentLineSpacing = lineSpacing;
            const currentShortLineSpacing = shortLineSpacing;
            
            let lineIndex = 0;
            // 오른쪽으로 라인 생성 (firstLineLeft ~ windowWidth)
            for (let left = firstLineLeft; left < windowWidth; left += currentLineSpacing) {
                backgroundLines.push(createVerticalLine(left, lineIndex++));
            }
            // 왼쪽으로 라인 생성 (0 ~ firstLineLeft)
            for (let left = firstLineLeft - currentLineSpacing; left >= 0; left -= currentLineSpacing) {
                backgroundLines.push(createVerticalLine(left, lineIndex++));
            }
            
            /* 떨어지는 세로 구분선 모션 비활성 */
        }
        
        /* animateShortLines(); 비활성 */
    }
    
    // 초기 실행
    setTimeout(() => {
        createBackgroundLines();
    }, 100);
    
    // 리사이즈 이벤트는 위의 handleResize 함수에서 통합 처리됨
    
    // nav-brand 애니메이션
    const navBrand = document.getElementById('navBrandAnimated');
    if (navBrand) {
        const navBrandTitles = ['welcome to'];
        const hoverText = '← go to home';
        let navBrandTimer = null;
        let isHovering = false;
        
        // index.html 페이지인지 확인
        const isIndexPage = !window.location.pathname.includes('/works/');
        
        function animateNavBrand() {
            if (navBrand.dataset.animating === 'true' || isHovering) return;
            
            const currentTitle = navBrandTitles[0];
            const repeatDelay = isIndexPage ? 10000 : 30000; // index.html은 10초, 프로젝트 페이지는 30초
            
            // 애니메이션 완료 후 대기하고 재실행
            animateToText(currentTitle, navBrand, false, [], () => {
                if (!isHovering) {
                    navBrandTimer = setTimeout(() => {
                        // 대기 후 모션 재실행
                        animateNavBrand();
                    }, repeatDelay);
                }
            });
        }
        
        // 프로젝트 페이지에서만 마우스 오버 이벤트 추가
        if (!isIndexPage) {
            // 마우스 오버 시 텍스트 변경 (랜덤 모션 적용)
            navBrand.addEventListener('mouseenter', () => {
                isHovering = true;
                // 타이머 취소
                if (navBrandTimer) {
                    clearTimeout(navBrandTimer);
                    navBrandTimer = null;
                }
                // 랜덤 모션으로 텍스트 변경
                if (navBrand.dataset.animating !== 'true') {
                    animateToText(hoverText, navBrand, false, [], () => {
                        navBrand.dataset.animating = 'false';
                    });
                }
            });
            
            // 마우스 아웃 시 원래 텍스트로 복원 (랜덤 모션 적용)
            navBrand.addEventListener('mouseleave', () => {
                isHovering = false;
                // 랜덤 모션으로 원래 텍스트로 복원
                if (navBrand.dataset.animating !== 'true') {
                    animateToText(navBrandTitles[0], navBrand, false, [], () => {
                        navBrand.dataset.animating = 'false';
                        // 애니메이션 재시작
                        navBrandTimer = setTimeout(() => {
                            animateNavBrand();
                        }, 30000);
                    });
                }
            });
        }
        
        // 모바일 터치 이벤트 추가 (모든 페이지)
        let isTouching = false;
        let touchHandled = false;
        
        navBrand.addEventListener('touchstart', (e) => {
            isTouching = true;
            touchHandled = false;
            isHovering = true;
            // 타이머 취소
            if (navBrandTimer) {
                clearTimeout(navBrandTimer);
                navBrandTimer = null;
            }
            // 랜덤 모션으로 텍스트 변경
            if (navBrand.dataset.animating !== 'true') {
                animateToText(hoverText, navBrand, false, [], () => {
                    navBrand.dataset.animating = 'false';
                });
            }
        });
        
        navBrand.addEventListener('touchend', (e) => {
            if (isTouching && !touchHandled) {
                touchHandled = true;
                isTouching = false;
                isHovering = false;
                
                // 프로젝트 페이지인 경우 index.html로 이동
                const isProjectPage = window.location.pathname.includes('/works/') || 
                                     window.location.pathname.includes('/labs/');
                if (isProjectPage) {
                    const baseHref = window.location.pathname.includes('/works/') ? '../index.html' : '../index.html';
                    window.location.href = baseHref;
                } else {
                    // 메인 페이지인 경우 페이지 새로고침
                    window.location.reload();
                }
            }
        });
        
        navBrand.addEventListener('touchcancel', () => {
            isTouching = false;
            isHovering = false;
            // 랜덤 모션으로 원래 텍스트로 복원
            if (navBrand.dataset.animating !== 'true') {
                animateToText(navBrandTitles[0], navBrand, false, [], () => {
                    navBrand.dataset.animating = 'false';
                    // 애니메이션 재시작
                    if (!isIndexPage) {
                        navBrandTimer = setTimeout(() => {
                            animateNavBrand();
                        }, 30000);
                    }
                });
            }
        });
        
        // 클릭 이벤트 추가 (데스크톱용, 모바일에서는 touchHandled로 중복 방지)
        navBrand.style.cursor = 'pointer';
        navBrand.addEventListener('click', (e) => {
            // 모바일 터치로 처리된 경우 클릭 이벤트 무시
            if (touchHandled) {
                e.preventDefault();
                return;
            }
            
            // 프로젝트 페이지인 경우 index.html로 이동
            const isProjectPage = window.location.pathname.includes('/works/') || 
                                 window.location.pathname.includes('/labs/');
            if (isProjectPage) {
                const baseHref = window.location.pathname.includes('/works/') ? '../index.html' : '../index.html';
                window.location.href = baseHref;
            } else {
                // 메인 페이지인 경우 페이지 새로고침
                window.location.reload();
            }
        });
        
        // 모든 페이지에서 초기 애니메이션 시작
        setTimeout(() => {
            animateNavBrand();
        }, 500);
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

    // Design System Details01: 3색 포인트 랜덤 자리 이동
    if (window.location.pathname.includes('design-system')) {
        const gradientBg = document.querySelector('.project-image-detail-gradient-wrap .gradient-bg');
        if (gradientBg) {
            const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
            const move = () => {
                gradientBg.style.setProperty('--pos1-x', rand(15, 85) + '%');
                gradientBg.style.setProperty('--pos1-y', rand(15, 85) + '%');
                gradientBg.style.setProperty('--pos2-x', rand(15, 85) + '%');
                gradientBg.style.setProperty('--pos2-y', rand(15, 85) + '%');
                gradientBg.style.setProperty('--pos3-x', rand(15, 85) + '%');
                gradientBg.style.setProperty('--pos3-y', rand(15, 85) + '%');
            };
            move();
            setInterval(move, 2000);
        }
    }
});

