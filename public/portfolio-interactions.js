// 컬러 상수 정의
const COLORS = {
    YELLOW: '#FFFF00',
    BLACK: '#000000',
    YELLOW_20: 'rgba(255, 255, 0, 0.2)'
};



/** Art 섹션 그리드: exhibition.json 기반 동적 주입 (index 페이지에만 #artGrid 존재 시) */
(function initArtGrid() {
    const grid = document.getElementById('artGrid');
    if (!grid) return;
    var fetchUrl = new URL('art/data/exhibition.json', location.href).href;
    fetch(fetchUrl)
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
 * 프로젝트 상세 페이지 배경은 전역과 동일하게 흰색 고정.
 */

function setThemeColorForProject(color) {
    var m = document.getElementById('themeColorMeta');
    if (m) m.setAttribute('content', color);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', color);
}

function applyProjectPageBackground(theme) {
    if (!document.body.classList.contains('project-detail-page')) return;
    document.body.style.removeProperty('--project-bg-color');
    document.body.style.removeProperty('background-color');
    setThemeColorForProject('#ffffff');
}

// applyProjectPageBackground: React(ProjectDetailEffects + SiteFooter)에서 호출

// Nav brand click 이벤트는 nav-brand 애니메이션 부분에서 처리됨



// Smooth scroll: href가 "#id" 또는 "/#id" (Next 네비) — querySelector에 URL을 넘기면 SyntaxError
function portfolioHashTargetId(href) {
    if (!href || typeof href !== 'string') return null;
    var i = href.indexOf('#');
    if (i < 0) return null;
    var id = href.slice(i + 1);
    var q = id.indexOf('?');
    if (q >= 0) id = id.slice(0, q);
    return id || null;
}

document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        var id = portfolioHashTargetId(href);
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        var offsetTop = target.offsetTop - 80;
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
            } else if (targetText === 'Arts') {
                element.innerHTML = 'Arts<sup>(coming soon)</sup>';
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
    'OOAh': '🎨',
    '11STREET Design eXperience': '🎨',
    '11KittiesSeason 2': '🎨',
    '#ootd': '🎨',
    'Amazon Global Store': '🎨',
    'Wedding': '🎨',
    'Back_to_Basics': '🎨',
    'Arts': '🎨'
};

// 메인·Works/Labs/Arts·프로젝트 타이틀 스크램블 + 이모지 박스 (Next 하이드레이션·클라이언트 라우트 후 재호출)
var __pSectionTitleIO = null;
var __pTitleBoxObservers = [];

function portfolioTeardownAnimatedSectionTitles() {
    if (__pSectionTitleIO) {
        __pSectionTitleIO.disconnect();
        __pSectionTitleIO = null;
    }
    __pTitleBoxObservers.forEach(function (o) { o.disconnect(); });
    __pTitleBoxObservers.length = 0;
    document.querySelectorAll('.animated-section-title').forEach(function (el) {
        if (!el.closest('.portfolio-info')) {
            el.removeAttribute('data-animated');
            el.removeAttribute('data-box-rotation');
        }
        el.querySelectorAll('.section-title-box').forEach(function (box) { box.remove(); });
    });
}

function portfolioSetupAnimatedSectionTitles() {
    portfolioTeardownAnimatedSectionTitles();
    var sectionTitleObserver = new IntersectionObserver((entries) => {
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
                    if (targetText === 'Arts') {
                        entry.target.innerHTML = 'Arts<sup>(coming soon)</sup>';
                        entry.target.style.height = '';
                        entry.target.style.minHeight = '';
                        return;
                    }
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
        __pTitleBoxObservers.push(boxObserver);
    });
    __pSectionTitleIO = sectionTitleObserver;
    window.__portfolioUpdateTitleBox = updateTitleBox;
}

window.portfolioSetupAnimatedSectionTitles = portfolioSetupAnimatedSectionTitles;

document.addEventListener('DOMContentLoaded', () => {
    portfolioSetupAnimatedSectionTitles();
    
    // 해상도 변경 시 모든 section-title-box 위치 재조정
    let resizeTimeout;
    let isResizing = false;
    
    function handleResize() {
        // 타이틀 박스 위치 재조정
        const upd = window.__portfolioUpdateTitleBox;
        const allSectionTitles = document.querySelectorAll('.animated-section-title');
        allSectionTitles.forEach(title => {
            const text = title.textContent || title.dataset.title || '';
            if (text && text.length >= 1 && typeof upd === 'function') {
                upd(title);
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
    const lineSpacing = 640;

    // 라인 제거 헬퍼 함수
    function removeLines(lines) {
        lines.forEach(line => line.parentNode?.removeChild(line));
        lines.length = 0;
    }
    
    // 배경 세로 라인 생성 헬퍼 함수 (index: 0=1번째, 1=2번째, ... 짝수번째는 투명도 0%)
    function createVerticalLine(left, index) {
        const line = document.createElement('div');
        line.className = index === 1 ? 'background-line background-line-second' : 'background-line';
        
        const isProjectDetailPage = document.body.classList.contains('project-detail-page');
        /* 본문(z-index:2) 아래·body 배경 위. 색은 CSS .background-line + data-theme */
        const lineZIndex = (index === 1 && isProjectDetailPage) ? '0' : '1';
        const navbar = document.querySelector('.navbar');
        const navHeight = navbar ? navbar.offsetHeight : 80;
        
        Object.assign(line.style, {
            left: `${left}px`,
            top: `${navHeight}px`,
            height: `calc(100vh - ${navHeight}px)`,
            position: 'fixed',
            width: '1px',
            zIndex: lineZIndex,
            pointerEvents: 'none',
            transition: 'left 0.1s ease-out'
        });
        document.body.appendChild(line);
        return line;
    }

    function getBackgroundLinesAnchor() {
        return document.getElementById('animatedTitle')
            || document.querySelector('main .hero-content .animated-section-title')
            || document.querySelector('main .animated-section-title');
    }

    /** Works/Labs(또는 Art) 그리드 썸네일 열과 동일한 시작 X·열 간격 (픽셀). 없으면 null */
    function getThumbnailColumnRhythm() {
        var grid = document.querySelector('#portfolioGrid, #labsGrid, #artGrid');
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
        var startX = Math.round(firstRow[0].left);
        var step = lineSpacing;
        if (firstRow.length >= 2) {
            var s = Math.round(firstRow[1].left - firstRow[0].left);
            if (s >= 100 && s <= 2000) step = s;
        }
        return { startX: startX, step: step };
    }

    function createBackgroundLines() {
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
            backgroundLines.push(createVerticalLine(positions[li], li));
        }
    }

    window.portfolioRebuildBackgroundLines = createBackgroundLines;
    
    // 초기 실행 (Next 하이드레이션 전이면 실패할 수 있음 → portfolioRebuildBackgroundLines 재호출)
    setTimeout(function () {
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
        const isIndexPage = !/(?:\/works\/|\/labs\/)/.test(window.location.pathname);
        
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
        
        // Next.js: 서브페이지 브랜드는 <Link href="/"> — 네비게이션은 Link에 맡기고, 홈의 div만 기존 클릭/터치 동작 유지
        const brandIsLink = navBrand.tagName === 'A';
        
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
            if (brandIsLink) {
                isTouching = false;
                isHovering = false;
                if (navBrand.dataset.animating !== 'true') {
                    animateToText(navBrandTitles[0], navBrand, false, [], () => {
                        navBrand.dataset.animating = 'false';
                        if (!isIndexPage) {
                            navBrandTimer = setTimeout(() => {
                                animateNavBrand();
                            }, 30000);
                        }
                    });
                }
                return;
            }
            if (isTouching && !touchHandled) {
                touchHandled = true;
                isTouching = false;
                isHovering = false;
                
                const isProjectPage = window.location.pathname.includes('/works/') || 
                                     window.location.pathname.includes('/labs/');
                if (isProjectPage) {
                    window.location.href = "/";
                } else {
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
        
        if (!brandIsLink) {
            navBrand.style.cursor = 'pointer';
            navBrand.addEventListener('click', (e) => {
                if (touchHandled) {
                    e.preventDefault();
                    return;
                }
                const isProjectPage = window.location.pathname.includes('/works/') || 
                                     window.location.pathname.includes('/labs/');
                if (isProjectPage) {
                    window.location.href = "/";
                } else {
                    window.location.reload();
                }
            });
        }
        
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
    // 그리드/텍스트 뷰 플로팅: React HomePageClient에서 처리

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

