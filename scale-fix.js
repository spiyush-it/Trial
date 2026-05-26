/**
 * ═══════════════════════════════════════════════════════
 *  Balaji Hitech — Universal Scale Fix  (scale-fix.js)
 *  Add before </body> on all 8 pages:
 *    <script src="scale-fix.js"></script>
 * ═══════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  var DESIGN_WIDTH = 1536;
  var ZOOM_STEP    = 0.05;

  function calcZoom(w) {
    if (w >= DESIGN_WIDTH) return 1;
    var z = Math.round((w / DESIGN_WIDTH) / ZOOM_STEP) * ZOOM_STEP;
    return Math.max(0.60, Math.min(1, z));
  }

  /* ── Mobile detection: skip zoom entirely on touch/mobile devices ── */
  function isMobile() {
    return (
      /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      ('ontouchstart' in window && navigator.maxTouchPoints > 1)
    );
  }

  function run() {
    /* Exit immediately on mobile — leave the page exactly as-is */
    if (isMobile()) return;

    var zoom = calcZoom(window.innerWidth);
    var body = document.body;
    var html = document.documentElement;

    var header = document.querySelector(
      'header.bh__site-header, header.site-header, header'
    );

    /* ── RESET if no zoom needed ── */
    if (zoom === 1) {
      body.style.zoom       = '';
      body.style.paddingTop = '';
      html.style.overflowX  = '';
      body.style.overflowX  = '';
      if (header) {
        header.style.position = '';
        header.style.top      = '';
        header.style.left     = '';
        header.style.width    = '';
        header.style.zIndex   = '';
        header.style.zoom     = '';
      }
      return;
    }

    /* ── Step 1: Zoom the WHOLE page including header ── */
    body.style.zoom = zoom;

    /* ── Step 2: Make header fixed so it sticks on scroll ──
       Since body is zoomed, fixed positioning works in
       zoomed-body coordinates. We set:
         width: (100vw / zoom) so it spans full screen width
         zoom stays inherited from body (same as rest of page)
    ────────────────────────────────────────────────────────*/
    if (header) {
      header.style.position = 'fixed';
      header.style.top      = '0';
      header.style.left     = '0';
      header.style.width    = (100 / zoom) + 'vw';  // compensate for body zoom
      header.style.zIndex   = '9999';
      header.style.zoom     = '';  // inherit body zoom — same scale as rest of page
    }

    /* ── Step 3: Offset body so content doesn't hide under fixed header ── */
    requestAnimationFrame(function () {
      if (header) {
        var headerH = header.getBoundingClientRect().height;
        /* getBoundingClientRect gives real px, convert to body-zoom units */
        body.style.paddingTop = Math.ceil(headerH / zoom) + 'px';
      }
    });

    /* ── Step 4: Prevent horizontal scroll ── */
    html.style.overflowX = 'hidden';
    body.style.overflowX = 'hidden';

    /* ── Step 5: Fix images ── */
    document.querySelectorAll('img').forEach(function (img) {
      img.style.maxWidth = '100%';
      if (img.getAttribute('width') && parseInt(img.getAttribute('width')) > 200) {
        img.style.width  = 'auto';
        img.style.height = 'auto';
      }
    });
  }

  /* Debounced resize */
  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(run, 100);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
  window.addEventListener('load', run);

})();
