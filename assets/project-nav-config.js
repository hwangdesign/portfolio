/**
 * 이전글/다음글 네비게이션 — assets/works-order.js 의 순서에서 자동 생성
 *
 * 수정: works-order.js 의 main / branches / labs 배열만 편집
 * 로드 순서: works-order.js → 본 파일 → script.js
 */
(function () {
  var order = window.WORKS_NAV_ORDER;
  if (!order || !Array.isArray(order.main)) {
    console.error('WORKS_NAV_ORDER가 없습니다. works-order.js를 project-nav-config.js보다 먼저 로드하세요.');
    window.PROJECT_NAV_CONFIG = {};
    return;
  }

  var cfg = {};

  function addChain(prefix, items, opts) {
    opts = opts || {};
    for (var i = 0; i < items.length; i++) {
      var cur = items[i];
      var key = prefix + cur.file;
      var prev = null;
      var next = null;

      if (i > 0) {
        prev = { href: items[i - 1].file, title: items[i - 1].title };
      } else if (opts.entryPrev) {
        prev = opts.entryPrev;
      }

      if (i < items.length - 1) {
        next = { href: items[i + 1].file, title: items[i + 1].title };
      } else if (opts.exitNext) {
        next = opts.exitNext;
      }

      cfg[key] = { prev: prev, next: next };
    }
  }

  addChain('works/', order.main, {});

  if (Array.isArray(order.branches)) {
    order.branches.forEach(function (branch) {
      addChain('works/', branch.items, {
        entryPrev: branch.entryPrev,
        exitNext: branch.exitNext
      });
    });
  }

  if (Array.isArray(order.labs)) {
    addChain('labs/', order.labs, {});
  }

  window.PROJECT_NAV_CONFIG = cfg;
})();
