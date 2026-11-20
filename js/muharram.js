/* Copyright (c) 2026 azangoo.com. All rights reserved.
   Copying, reuse, modification or redistribution of this code, or of its calculations,
   is prohibited without written permission. See the Terms and conditions page. */
/* Muharram mood (css/muharram.css).
   - Automatic: on the first ten days of Muharram (the Hijri date of the place the visitor chose, from js/moon-info.js).
   - Preview any time: ?theme=muharram   (and ?theme=muharram&day=9 or 10 to see Tasu'a and Ashura). The preview always wins.
   The mood is the site's own design and has no switch for the visitor. */
(function () {
  'use strict';
  var root = document.documentElement, UNTIL = 'azMuharramUntil', DAY = 86400000;
  var AUTO_LANGS = { fa: 1, en: 1, ur: 1, ar: 1 };            /* the languages the automatic mood is on for; delete a line to leave a language out */
  var TXT = {
    fa: { line: 'ایام عزاداری <b>محرم الحرام</b> — السلام علیک یا اباعبدالله الحسین (ع)', day: '{d} محرم {y}', d9: 'تاسوعای حسینی — {d} محرم', d10: 'عاشورای حسینی — {d} محرم' },
    en: { line: 'Days of mourning — <b>Muharram</b> — Peace be upon you, O Aba ʿAbdillāh al-Ḥusayn', day: '{d} Muharram {y}', d9: 'Tasuʿa — {d} Muharram', d10: 'Ashura — {d} Muharram' },
    ur: { line: 'ایامِ عزا — <b>محرم الحرام</b> — السلام علیک یا ابا عبداللہ الحسین (ع)', day: '{d} محرم {y}', d9: 'تاسوعا — {d} محرم', d10: 'عاشورا — {d} محرم' },
    ar: { line: 'أيام العزاء — <b>محرّم الحرام</b> — السلام عليك يا أبا عبد الله الحسين (ع)', day: '{d} محرّم {y}', d9: 'تاسوعاء — {d} محرّم', d10: 'عاشوراء — {d} محرّم' }
  };
  var qs = location.search;
  var preview = /[?&]theme=muharram\b/.test(qs);
  var fakeDay = (/[?&]day=(\d+)/.exec(qs) || [])[1];
  fakeDay = fakeDay ? Math.min(10, Math.max(1, +fakeDay)) : 0;

  var bar = null, auto = false, info = null;                  /* info = { day, year } of the Hijri date, when known */
  function store(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lang() { return (window.AzanLang && window.AzanLang.current && window.AzanLang.current()) || root.lang || 'fa'; }
  function num(x) { return window.AzanLang && window.AzanLang.num ? window.AzanLang.num(x) : String(x); }

  function paint() {
    if (!bar) return;
    var lg = lang(), T = TXT[lg] || TXT.fa;
    var d = fakeDay || (info && info.day) || 0, y = info && info.year ? num(info.year) : '';
    bar.querySelector('.mh-line').innerHTML = T.line;
    var dayEl = bar.querySelector('.mh-day');
    dayEl.textContent = d ? (T[d === 9 ? 'd9' : d === 10 ? 'd10' : 'day'].replace('{d}', num(d)).replace('{y}', y)).trim() : '';
    dayEl.hidden = !d;
    bar.classList.toggle('is-big', d === 9 || d === 10);
  }
  function show() {
    if (bar) { bar.hidden = false; paint(); return; }
    root.setAttribute('data-season', 'muharram');
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', '#0c0506');
    bar = document.createElement('div');
    bar.className = 'mh-bar';
    bar.setAttribute('role', 'note');
    bar.innerHTML = '<span class="mh-line"></span><span class="mh-day" hidden></span>';
    document.body.insertBefore(bar, document.body.firstChild);
    paint();
  }
  function hide() {
    root.removeAttribute('data-season');
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', '#0b2530');
    if (bar) bar.hidden = true;
  }
  function on() { root.setAttribute('data-season', 'muharram'); show(); }

  /* the Hijri date of the chosen place: js/moon-info.js says so every time it updates */
  function read() {
    var o = window.MoonInfo && window.MoonInfo.current ? window.MoonInfo.current() : null;
    if (!o || !o.hijriDay) return;
    info = { day: o.hijriDay, year: o.hijriYear, month: o.hijriMonth };
    if (preview) { paint(); return; }
    var inDays = info.month === 1 && info.day >= 1 && info.day <= 10 && AUTO_LANGS[lang()];
    if (inDays) {
      auto = true; on();
      store(UNTIL, String(Date.now() + (11 - info.day) * DAY));   /* remembered, so the next page opens in the mood at once */
    } else if (!inDays) {
      store(UNTIL, null);
      if (auto || (bar && !bar.hidden)) hide();
      auto = false;
    }
  }

  function start() {
    if (preview) { on(); read(); }
    else if (+load(UNTIL) > Date.now() && AUTO_LANGS[lang()]) { auto = true; on(); }
    window.addEventListener('azan:hijri', read);
    window.addEventListener('azan:langchange', function () { paint(); if (!preview) read(); });
    read();
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
