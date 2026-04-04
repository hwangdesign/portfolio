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

/**
 * 배경 세로선 — Next.js Script(afterInteractive)는 DOMContentLoaded 이후에 로드되므로
 * 이 코드를 DOMContentLoaded 안에만 두면 콜백이 절대 실행되지 않음. 즉시 초기화 IIFE로 분리.
 */
(function initPortfolioBackgroundVerticalLines() {
    const backgroundLines = [];
    const lineSpacing = 640;
    const LAYER_ID = 'portfolio-bg-lines-layer';

    function removeLines(lines) {
        lines.forEach((line) => line.parentNode && line.parentNode.removeChild(line));
        lines.length = 0;
    }

    function ensureLinesLayer() {
        var layer = document.getElementById(LAYER_ID);
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
        var r = el.getBoundingClientRect();
        return r.top + window.scrollY;
    }

    /** GNB 아래부터 푸터 시작 직전까지(문서 좌표). 뷰포트 vh 미사용 — 컨텐츠 길이에 맞춤 */
    function updateLinesLayerGeometry() {
        var layer = ensureLinesLayer();
        var nav = document.querySelector('.navbar');
        var footer = document.querySelector('.site-footer');
        var navH = nav ? nav.offsetHeight : 80;
        if (!footer) {
            layer.style.top = navH + 'px';
            layer.style.height = '0px';
            return;
        }
        var footerTop = elementDocumentTop(footer);
        var h = Math.max(0, Math.round(footerTop - navH));
        layer.style.top = navH + 'px';
        layer.style.height = h + 'px';
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
        var grid = document.getElementById('portfolioGrid') || document.querySelector('#labsGrid, #artGrid');
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
        /* 썸네일(열) 왼쪽 시작선과 겹침 — 첫 썸네일 left가 첫 직선 */
        var startX = Math.round(firstRow[0].left);
        return { startX: startX, step: step };
    }

    function createBackgroundLines() {
        updateLinesLayerGeometry();
        var layer = ensureLinesLayer();
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

    window.portfolioRebuildBackgroundLines = createBackgroundLines;

    var lineResizeTimeout;
    window.addEventListener(
        'resize',
        function () {
            clearTimeout(lineResizeTimeout);
            lineResizeTimeout = setTimeout(createBackgroundLines, 250);
        },
        { passive: true }
    );

    var contentResizeObserver = null;
    var contentRoTimer = 0;
    var bodyLineObserveStarted = false;
    function observeBodyForLines() {
        if (bodyLineObserveStarted || typeof ResizeObserver === 'undefined') return;
        bodyLineObserveStarted = true;
        contentResizeObserver = new ResizeObserver(function () {
            clearTimeout(contentRoTimer);
            contentRoTimer = window.setTimeout(createBackgroundLines, 100);
        });
        contentResizeObserver.observe(document.body);
    }

    function bootLines() {
        createBackgroundLines();
        observeBodyForLines();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function onDomReady() {
            document.removeEventListener('DOMContentLoaded', onDomReady);
            bootLines();
            setTimeout(bootLines, 120);
            setTimeout(bootLines, 500);
        });
    } else {
        bootLines();
        setTimeout(bootLines, 120);
        setTimeout(bootLines, 500);
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    let resizeTimeout;
    let isResizing = false;

    function handleResize() {
        if (typeof window.portfolioRebuildBackgroundLines === 'function') {
            window.portfolioRebuildBackgroundLines();
        }
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

    const navBrand = document.getElementById('navBrandAnimated');
    /* React SiteNav 홈 브랜드는 data-nav-brand-react 로 이미 클릭·터치 처리 */
    if (navBrand && navBrand.getAttribute('data-nav-brand-react') !== '1') {
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
                    window.location.href = '/';
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
                    window.location.href = '/';
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

