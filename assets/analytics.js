/**
 * Google Analytics (GA4) — 단일 소스로 전 사이트 적용
 * 측정 ID 변경 시 이 파일의 MEASUREMENT_ID 만 수정하면 됩니다.
 * GA4 관리자 > 데이터 스트림 > 웹 스트림 > 측정 ID
 */
(function () {
    var MEASUREMENT_ID = 'G-Y1X7S6RJYL';

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID, {
        page_path: window.location.pathname || '/',
        page_title: document.title,
        send_page_view: true
    });

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(s);
})();
