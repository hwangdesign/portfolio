/**
 * Lab 1 - Interactive Analog Clock
 * 실시간 시계, 마우스/터치 반응형 그래픽
 */

(function () {
  const canvas = document.getElementById('clockCanvas');
  const ctx = canvas.getContext('2d');
  const clockWrapper = document.querySelector('.clock-wrapper');

  // Canvas sizing (400 = fallback from HTML width/height)
  let size = 400;
  let scale = 1;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    let nextSize = Math.min(rect.width, rect.height);
    if (nextSize <= 0) {
      nextSize = Math.min(clockWrapper.offsetWidth, clockWrapper.offsetHeight) || 360;
    }
    nextSize = Math.max(1, nextSize);
    if (size > 0 && Math.abs(nextSize - size) < 1) return;
    size = nextSize;
    scale = window.devicePixelRatio || 1;

    canvas.width = size * scale;
    canvas.height = size * scale;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(scale, scale);
  }

  let displaySecondAngle = null;
  let displayMinuteAngle = null;
  let displayHourAngle = null;

  function lerpAngle(current, target, ease) {
    let diff = target - current;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    return current + diff * ease;
  }

  function getTimeInTimezone(tz) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const get = (type) => parseInt(parts.find((p) => p.type === type)?.value ?? 0, 10);
    const ms = now.getMilliseconds();
    return {
      hours: get('hour'),
      minutes: get('minute'),
      seconds: get('second'),
      ms
    };
  }

  // Mouse position (normalized -1 to 1; 999 = off-screen, triangles at rest)
  let mouseX = 999;
  let mouseY = 999;
  let targetMouseX = 999;
  let targetMouseY = 999;

  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  let isTouching = false;
  let gyroEnabled = false;
  const GYRO_SENSITIVITY = 0.6;

  // Scatter: per-triangle based on distance to cursor (no clock-area check)
  // Values scale with canvas size for mobile
  const SCATTER_INTERVAL = 0.022;
  let scatterProgress = 0;

  function handleDeviceOrientation(e) {
    if (!gyroEnabled) return;
    const gamma = e.gamma != null ? e.gamma : 0;
    const beta = e.beta != null ? e.beta : 0;
    targetMouseX = Math.max(-1, Math.min(1, (gamma / 30) * GYRO_SENSITIVITY));
    targetMouseY = Math.max(-1, Math.min(1, ((beta - 45) / 30) * GYRO_SENSITIVITY));
  }

  function requestGyroPermission() {
    if (!isMobile || gyroEnabled) return;
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((state) => {
          if (state === 'granted') {
            gyroEnabled = true;
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        })
        .catch(() => {});
    } else if (typeof DeviceOrientationEvent !== 'undefined') {
      gyroEnabled = true;
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }
  }

  function handlePointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    targetMouseX = rect.width > 0 ? Math.max(-1, Math.min(1, (clientX - centerX) / (rect.width / 2))) : 0;
    targetMouseY = rect.height > 0 ? Math.max(-1, Math.min(1, (clientY - centerY) / (rect.height / 2))) : 0;
  }

  document.addEventListener('mousemove', handlePointerMove);
  document.addEventListener('touchmove', handlePointerMove, { passive: true });
  document.addEventListener('touchstart', (e) => {
    isTouching = true;
    if (isMobile) requestGyroPermission();
  });
  document.addEventListener('touchend', () => { isTouching = false; });
  document.addEventListener('mouseleave', () => {
    if (!isTouching) {
      targetMouseX = 999;
      targetMouseY = 999;
    }
  });

  if (isMobile) {
    clockWrapper.addEventListener('click', requestGyroPermission, { once: true });
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      gyroEnabled = true;
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }
  }

  function updateMouse() {
    const ease = 0.068;
    mouseX += (targetMouseX - mouseX) * ease;
    mouseY += (targetMouseY - mouseY) * ease;

    const cursorNear = Math.abs(targetMouseX) < 2 && Math.abs(targetMouseY) < 2;
    const targetProgress = cursorNear ? 1 : 0;
    const returnEase = cursorNear ? 0.032 : 0.058;
    scatterProgress += (targetProgress - scatterProgress) * returnEase;
  }

  // Deterministic random scatter direction per triangle (handId: 0=hour, 1=min, 2=sec)
  function getScatterOffset(handId, triIndex) {
    const seed = handId * 10000 + triIndex;
    const angle = ((seed * 137.5 + 47) % 360) * (Math.PI / 180);
    const scatterDist = Math.min(640, size * 1.6);
    const dist = scatterDist * (0.6 + ((seed * 31) % 40) / 100);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  }

  function getSpinAngle(handId, triIndex, proximityFactor, distFromCenter) {
    const seed = handId * 10000 + triIndex;
    const raw = (seed * 7 + 11) % 5;
    const direction = raw <= 1 ? -(raw + 1) : raw + 1;
    const baseSpeed = 0.9 + ((seed * 17) % 80) / 100;
    const maxRadius = size / 2;
    const distanceFactor = Math.min(1, distFromCenter / maxRadius);
    const centerSpeedMultiplier = 0.9 + distanceFactor * 2;
    const spinSpeed = proximityFactor * proximityFactor * baseSpeed * centerSpeedMultiplier;
    return proximityFactor * direction * spinSpeed * (performance.now() * 0.005);
  }

  function drawTriangle(cx, cy, angle, baseSize) {
    const h = baseSize * 1.5;
    const w = baseSize;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(h / 2, 0);
    ctx.lineTo(-h / 2, -w / 2);
    ctx.lineTo(-h / 2, w / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawInvertedTriangle(cx, cy, angle, baseSize) {
    const h = baseSize * 1.5;
    const w = baseSize;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle + Math.PI);
    ctx.beginPath();
    ctx.moveTo(h / 2, 0);
    ctx.lineTo(-h / 2, -w / 2);
    ctx.lineTo(-h / 2, w / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawCircle(cx, cy, baseSize) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, baseSize * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function getCenterAlpha(cx, cy) {
    const centerX = size / 2;
    const centerY = size / 2;
    const dist = Math.sqrt((cx - centerX) ** 2 + (cy - centerY) ** 2);
    const maxRadius = size / 2;
    return Math.max(0.15, 1 - (dist / maxRadius) * 0.85);
  }

  function drawHand(angle, lengthRatio, triangleCount, color, baseSize, handId, shape) {
    const centerX = size / 2;
    const centerY = size / 2;
    const length = (size / 2) * lengthRatio * 0.92;
    const baseAngle = (angle - 90) * (Math.PI / 180);

    ctx.fillStyle = color;

    const scatterMouseX = Math.abs(mouseX) < 2 ? centerX + mouseX * (size / 2) : 1e6;
    const scatterMouseY = Math.abs(mouseY) < 2 ? centerY + mouseY * (size / 2) : 1e6;
    const offsetX = Math.abs(mouseX) < 2 ? mouseX * 4 : 0;
    const offsetY = Math.abs(mouseY) < 2 ? mouseY * 4 : 0;
    const influenceRadius = Math.max(32, Math.min(48, size * 0.12));

    for (let i = 0; i < triangleCount; i++) {
      const t = (i + 0.5) / triangleCount;
      const dist = t * length;
      const baseX = centerX + Math.cos(baseAngle) * dist + offsetX * t;
      const baseY = centerY + Math.sin(baseAngle) * dist + offsetY * t;

      const dxToCursor = baseX - scatterMouseX;
      const dyToCursor = baseY - scatterMouseY;
      const distToCursor = Math.sqrt(dxToCursor * dxToCursor + dyToCursor * dyToCursor);
      const proximityFactor = Math.max(0, 1 - distToCursor / influenceRadius);
      const intervalFactor = Math.max(0, scatterProgress - i * SCATTER_INTERVAL);
      const effectiveProximity = proximityFactor * intervalFactor;

      const scatter = getScatterOffset(handId, i);
      const x = baseX + scatter.x * effectiveProximity;
      const y = baseY + scatter.y * effectiveProximity;
      const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const spinAngle = getSpinAngle(handId, i, effectiveProximity, distFromCenter);
      const drawAngle = baseAngle + spinAngle;

      ctx.globalAlpha = getCenterAlpha(x, y);
      if (shape === 'circle') {
        drawCircle(x, y, baseSize);
      } else if (shape === 'inverted') {
        drawInvertedTriangle(x, y, drawAngle, baseSize);
      } else {
        drawTriangle(x, y, drawAngle, baseSize);
      }
      ctx.globalAlpha = 1;
    }
  }

  function drawClock() {
    resizeCanvas();
    updateMouse();

    const tz = window.__timezone || 'Asia/Seoul';
    const t = getTimeInTimezone(tz);
    const hours = t.hours % 12;
    const minutes = t.minutes;
    const seconds = t.seconds;
    const ms = t.ms;

    const targetSecondAngle = (seconds + ms / 1000) * 6;
    const targetMinuteAngle = minutes * 6 + seconds * 0.1;
    const targetHourAngle = hours * 30 + minutes * 0.5;

    if (displaySecondAngle == null) {
      displaySecondAngle = targetSecondAngle;
      displayMinuteAngle = targetMinuteAngle;
      displayHourAngle = targetHourAngle;
    }
    const handEase = 0.085;
    displaySecondAngle = lerpAngle(displaySecondAngle, targetSecondAngle, handEase);
    displayMinuteAngle = lerpAngle(displayMinuteAngle, targetMinuteAngle, handEase);
    displayHourAngle = lerpAngle(displayHourAngle, targetHourAngle, handEase);

    const secondAngle = displaySecondAngle;
    const minuteAngle = displayMinuteAngle;
    const hourAngle = displayHourAngle;

    const s = size;

    ctx.clearRect(0, 0, s, s);

    // Triangle size (unified, responsive to canvas)
    const triBase = Math.max(4, s / 80);
    const isDark = document.documentElement.classList.contains('dark-mode');
    const triColor = isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)';

    // Hour hand - triangles
    drawHand(hourAngle, 0.35, 16, triColor, triBase, 0, 'triangle');

    // Minute hand - triangles
    drawHand(minuteAngle, 0.7, 24, triColor, triBase, 1, 'triangle');

    // Second hand - triangles
    drawHand(secondAngle, 0.92, 32, triColor, triBase, 2, 'triangle');

    // Center cap (fixed position)
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, 6, 0, Math.PI * 2);
    ctx.fillStyle = triColor;
    ctx.fill();

    // Clock wrapper tilt (CSS transform, only when cursor on page)
    const tiltX = Math.abs(mouseX) < 2 ? mouseY * 4 : 0;
    const tiltY = Math.abs(mouseY) < 2 ? -mouseX * 4 : 0;
    clockWrapper.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  }

  function tick() {
    drawClock();
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resizeCanvas);

  function init() {
    resizeCanvas();
    tick();
  }

  (function initTimezoneDropdown() {
    const STORAGE_KEY = 'lab1-timezone';
    const wrap = document.querySelector('.timezone-select-wrap');
    const trigger = document.getElementById('timezoneTrigger');
    const triggerText = document.getElementById('timezoneTriggerText');
    const dropdown = document.getElementById('timezoneDropdown');
    const options = document.querySelectorAll('.timezone-option');

    const timezoneLabels = {
      'Asia/Seoul': 'Seoul (KST)',
      'Asia/Tokyo': 'Tokyo (JST)',
      'Asia/Shanghai': 'Shanghai (CST)',
      'Asia/Singapore': 'Singapore (SGT)',
      'Asia/Dubai': 'Dubai (GST)',
      'Europe/London': 'London (GMT/BST)',
      'Europe/Paris': 'Paris (CET)',
      'Europe/Berlin': 'Berlin (CET)',
      'America/New_York': 'New York (EST/EDT)',
      'America/Chicago': 'Chicago (CST/CDT)',
      'America/Los_Angeles': 'Los Angeles (PST/PDT)',
      'America/Sao_Paulo': 'Sao Paulo (BRT)',
      'Australia/Sydney': 'Sydney (AEST)',
      'Pacific/Auckland': 'Auckland (NZST)',
      'UTC': 'UTC'
    };

    const availableZones = Object.keys(timezoneLabels);

    function getLocalTimezoneMatch() {
      let localTz;
      try {
        localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch {
        return 'UTC';
      }
      if (availableZones.includes(localTz)) return localTz;
      try {
        const now = new Date();
        const localOffset = -now.getTimezoneOffset() / 60;
        const zoneOffsets = {
          'America/Los_Angeles': [-8, -7],
          'America/Chicago': [-6, -5],
          'America/New_York': [-5, -4],
          'America/Sao_Paulo': [-3],
          'UTC': [0],
          'Europe/London': [0, 1],
          'Europe/Paris': [1],
          'Europe/Berlin': [1],
          'Asia/Dubai': [4],
          'Asia/Shanghai': [8],
          'Asia/Singapore': [8],
          'Asia/Seoul': [9],
          'Asia/Tokyo': [9],
          'Australia/Sydney': [10, 11],
          'Pacific/Auckland': [12, 13]
        };
        let best = 'UTC';
        let bestDiff = 24;
        for (const [tz, offs] of Object.entries(zoneOffsets)) {
          const diff = Math.min(...offs.map((o) => Math.abs(localOffset - o)));
          if (diff < bestDiff) {
            bestDiff = diff;
            best = tz;
          }
        }
        return best;
      } catch {
        return 'UTC';
      }
    }

    function setTimezone(value) {
      window.__timezone = value;
      localStorage.setItem(STORAGE_KEY, value);
      triggerText.textContent = timezoneLabels[value] || value;
      options.forEach((opt) => {
        opt.classList.toggle('selected', opt.dataset.value === value);
      });
      dropdown.setAttribute('aria-hidden', 'true');
      wrap.classList.remove('open');
    }

    setTimezone(getLocalTimezoneMatch());

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      wrap.classList.toggle('open');
      const isOpen = wrap.classList.contains('open');
      dropdown.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      trigger.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        const selected = dropdown.querySelector('.timezone-option.selected');
        if (selected) {
          selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    });

    options.forEach((opt) => {
      opt.addEventListener('click', () => {
        setTimezone(opt.dataset.value);
      });
    });

    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('open');
        dropdown.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();

(function darkModeToggle() {
  const STORAGE_KEY = 'lab1-dark-mode';
  const toggleBtn = document.querySelector('.dark-mode-toggle');
  const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  if (!toggleBtn) return;

  function isDarkMode() {
    return document.documentElement.classList.contains('dark-mode');
  }

  function setDarkMode(on, save) {
    if (on) {
      document.documentElement.classList.add('dark-mode');
      if (save) localStorage.setItem(STORAGE_KEY, '1');
    } else {
      document.documentElement.classList.remove('dark-mode');
      if (save) localStorage.setItem(STORAGE_KEY, '0');
    }
  }

  toggleBtn.addEventListener('click', () => {
    setDarkMode(!isDarkMode(), true);
  });

  if (mq) {
    mq.addEventListener('change', (e) => {
      if (localStorage.getItem(STORAGE_KEY) == null) {
        setDarkMode(e.matches, false);
      }
    });
  }
})();

(function fallingLines() {
  const canvas = document.getElementById('fallingLinesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const LINE_THICKNESS = 1;
  const MIN_LENGTH = 20;
  const MAX_LENGTH = 60;
  const BASE_SPEED = 0.35;

  let lines = [];
  let width = 0;
  let height = 0;

  function getVerticalLineXPositions() {
    const positions = [];
    const centerX = width / 2;
    let x = centerX;
    const intervalVw = width <= 480 ? 35 : 30;
    const step = width * (intervalVw / 100);
    for (let i = 0; i < 20; i++) {
      positions.push(x);
      x += step;
      if (x > width + step) break;
    }
    x = centerX - step;
    for (let i = 0; i < 20; i++) {
      if (x >= 0) positions.push(x);
      x -= step;
      if (x < -step) break;
    }
    return positions;
  }

  function createLine(x) {
    return {
      x,
      y: -MAX_LENGTH - Math.random() * 200,
      length: MIN_LENGTH + Math.random() * (MAX_LENGTH - MIN_LENGTH),
      speed: BASE_SPEED * (0.7 + Math.random() * 0.6)
    };
  }

  function initLines() {
    lines = [];
    const xPositions = getVerticalLineXPositions();
    xPositions.forEach((x) => {
      for (let i = 0; i < 3; i++) {
        lines.push(createLine(x));
      }
    });
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initLines();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.classList.contains('dark-mode');
    const baseOpacity = 0.5;
    ctx.lineWidth = LINE_THICKNESS;
    ctx.lineCap = 'round';

    const xPositions = getVerticalLineXPositions();
    lines.forEach((line) => {
      line.y += line.speed;
      if (line.y > height + line.length) {
        const idx = Math.floor(Math.random() * xPositions.length);
        line.x = xPositions[idx];
        line.y = -line.length - Math.random() * 100;
        line.length = MIN_LENGTH + Math.random() * (MAX_LENGTH - MIN_LENGTH);
        line.speed = BASE_SPEED * (0.7 + Math.random() * 0.6);
      }
      const fadeIn = Math.min(1, (line.y + line.length) / 80);
      const fadeOut = Math.min(1, (height - line.y) / 60);
      const alpha = baseOpacity * fadeIn * fadeOut;
      ctx.strokeStyle = isDark
        ? `rgba(255, 255, 255, ${alpha})`
        : `rgba(0, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(line.x, line.y);
      ctx.lineTo(line.x, line.y + line.length);
      ctx.stroke();
    });
  }

  function tick() {
    draw();
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  resize();
  tick();
})();
