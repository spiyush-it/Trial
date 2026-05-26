/**
 * ─────────────────────────────────────────────
 *  BH INTEGRITY GUARD  v1.0
 *  Protects built-by attribution link.
 *  Works on ANY page — just include this file
 *  and call: BHGuard.init()
 * ─────────────────────────────────────────────
 */
(function (global) {
  "use strict";

  /* ── Signed reference values (do NOT change) ── */
  var _REF = {
    href  : "https://www.linkedin.com/in/piyush-sharma-836447124/",
    text  : "P",
    cls   : "bh__built-by-link",
    label : "Piyush Sharma on LinkedIn"
  };

  /* ── Simple hash to detect runtime tampering ── */
  function _hash(str) {
    var h = 0x811c9dc5 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h  = (Math.imul(h, 0x01000193)) >>> 0;
    }
    return h.toString(16);
  }

  var _EXPECTED = _hash(_REF.href + _REF.text + _REF.label);

  /* ── Breach handler ── */
  function _breach(reason) {
    /* 1. Freeze the page immediately */
    document.documentElement.innerHTML = "";
    document.open();
    document.write(
      "<!DOCTYPE html><html><head>" +
      "<meta charset='utf-8'>" +
      "<title>Security Alert</title>" +
      "<style>" +
      "*{margin:0;padding:0;box-sizing:border-box;}" +
      "body{background:#0a0f1e;display:flex;align-items:center;" +
      "justify-content:center;min-height:100vh;font-family:system-ui,sans-serif;}" +
      ".box{text-align:center;padding:48px 40px;background:#111827;" +
      "border:1px solid #dc2626;border-radius:16px;max-width:480px;}" +
      ".icon{font-size:56px;margin-bottom:16px;}" +
      "h1{color:#dc2626;font-size:1.5rem;margin-bottom:12px;letter-spacing:.02em;}" +
      "p{color:#9ca3af;font-size:.95rem;line-height:1.6;margin-bottom:8px;}" +
      "code{color:#f87171;font-size:.8rem;background:#1f2937;" +
      "padding:2px 8px;border-radius:4px;}" +
      "</style></head><body>" +
      "<div class='box'>" +
      "<div class='icon'>&#x26D4;</div>" +
      "<h1>Security Breach Detected</h1>" +
      "<p>An unauthorised modification was detected on this page.</p>" +
      "<p>Please <strong style='color:#f87171'>contact the developer</strong> immediately.</p>" +
      "<p style='margin-top:20px'><code>" + (reason || "integrity check failed") + "</code></p>" +
      "</div></body></html>"
    );
    document.close();

    /* 2. Hard-stop any further JS */
    throw new Error("BHGuard: " + reason);
  }

  /* ── Core check function (called from page AND scripts.js) ── */
  function _check(params) {
    /*
      params = {
        href  : string,   — anchor href
        text  : string,   — anchor visible text
        cls   : string,   — anchor className
        label : string    — aria-label
      }
    */
    if (!params) { _breach("no params supplied"); return; }

    var live = _hash(
      (params.href  || "") +
      (params.text  || "") +
      (params.label || "")
    );

    if (live !== _EXPECTED) {
      _breach("attribution link tampered");
    }
  }

  /* ── DOM inspection (auto-reads from live element) ── */
  function _domCheck() {
    var el = document.querySelector(".bh__built-by-link");
    if (!el) { _breach("attribution element missing"); return; }

    _check({
      href  : el.getAttribute("href")  || "",
      text  : (el.textContent || "").trim(),
      cls   : el.className             || "",
      label : el.getAttribute("aria-label") || ""
    });
  }

  /* ── Public API ── */
  global.BHGuard = {

    /**
     * Call once on page load.
     * Checks DOM + sets MutationObserver to catch runtime changes.
     */
    init: function () {
      /* Immediate DOM check */
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
          _domCheck();
          BHGuard._watch();
        });
      } else {
        _domCheck();
        BHGuard._watch();
      }
    },

    /**
     * Called from scripts.js with extracted params — cross-validates
     * from a second independent code path.
     */
    verify: function (params) {
      _check(params);
    },

    /** Internal — MutationObserver watches footer for DOM changes */
    _watch: function () {
      var target = document.querySelector(".bh__footer-bottom") ||
                   document.querySelector("footer") ||
                   document.body;

      var mo = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (
            m.type === "attributes" ||
            m.type === "childList"  ||
            m.type === "characterData"
          ) {
            _domCheck();
          }
        });
      });

      mo.observe(target, {
        attributes     : true,
        childList      : true,
        subtree        : true,
        characterData  : true
      });
    }
  };

})(window);
