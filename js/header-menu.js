/* Copyright (c) 2026 azangoo.com. All rights reserved.
   Copying, reuse, modification or redistribution of this code, or of its calculations,
   is prohibited without written permission. See the Terms and conditions page. */
/* Header icon buttons (language + theme).
   - Tooltips: the language icon always says "Languages" (every language); the theme icon says
     "Theme" in the language of the page.
   - On desktop (mouse) the dropdown is our own wide menu, because the native popup of a 42px round
     <select> is only 42px wide and cuts the names. On touch devices the native picker is kept.
   The <select> elements stay in the page and keep firing "change", so lang.js / theme.js are untouched. */
(function () {
  'use strict';
  var langSel = document.getElementById('langSelect');
  var themeSel = document.getElementById('themeSelect');
  var menu = null, owner = null;

  function tr(key, fallback) {
    try { var v = window.AzanLang && window.AzanLang.t(key); if (v && v !== key) return v; } catch (e) {}
    return fallback;
  }
  function labels() {
    if (langSel) { langSel.title = 'Languages'; langSel.setAttribute('aria-label', 'Languages'); }
    if (themeSel) {
      var s = tr('theme_title', 'Theme');
      themeSel.title = s; themeSel.setAttribute('aria-label', s);
    }
  }
  function finePointer() {
    return !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }

  function close(refocus) {
    if (!menu) return;
    document.removeEventListener('mousedown', onDoc, true);
    document.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', onAway);
    window.removeEventListener('scroll', onAway, true);
    menu.parentNode && menu.parentNode.removeChild(menu);
    if (owner) { owner.setAttribute('aria-expanded', 'false'); if (refocus) owner.focus(); }
    menu = null; owner = null;
  }
  function onDoc(e) { if (menu && !menu.contains(e.target) && e.target !== owner) close(false); }
  function onAway() { close(false); }
  function onKey(e) {
    if (!menu) return;
    var items = Array.prototype.slice.call(menu.querySelectorAll('button'));
    var i = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); close(true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === 'Tab') { close(false); }
  }

  function currentValue(sel) {
    if (sel === langSel) return (window.AzanLang && window.AzanLang.current && window.AzanLang.current()) || '';
    return sel.value;
  }

  function open(sel) {
    if (menu && owner === sel) { close(true); return; }
    close(false);
    var cur = currentValue(sel);
    menu = document.createElement('div');
    menu.className = 'hm-menu';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('dir', 'ltr');           /* the list itself is fixed; each name sits in its own script */
    var focusBtn = null;
    Array.prototype.forEach.call(sel.options, function (o) {
      if (!o.value) return;                    /* skip the empty "Languages" head option */
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'option');
      b.setAttribute('data-value', o.value);
      if (sel === langSel) b.setAttribute('lang', o.value);
      b.setAttribute('dir', 'auto');
      b.textContent = o.textContent;
      var on = o.value === cur;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) focusBtn = b;
      b.addEventListener('click', function () {
        var v = o.value;
        close(true);
        sel.value = v;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      });
      menu.appendChild(b);
    });
    document.body.appendChild(menu);
    var r = sel.getBoundingClientRect();
    var w = menu.offsetWidth;
    var left = (document.documentElement.dir === 'rtl') ? r.right - w : r.left;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    menu.style.left = left + 'px';
    menu.style.top = (r.bottom + 6) + 'px';
    owner = sel;
    sel.setAttribute('aria-expanded', 'true');
    document.addEventListener('mousedown', onDoc, true);
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', onAway);
    window.addEventListener('scroll', onAway, true);
    (focusBtn || menu.querySelector('button')).focus();
  }

  function wire(sel) {
    if (!sel) return;
    sel.setAttribute('aria-haspopup', 'listbox');
    sel.setAttribute('aria-expanded', 'false');
    sel.addEventListener('mousedown', function (e) {
      if (e.button !== 0 || !finePointer()) return;   /* touch: native picker */
      e.preventDefault(); sel.focus(); open(sel);
    });
    sel.addEventListener('keydown', function (e) {
      if (!finePointer()) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(sel); }
    });
  }

  labels();
  wire(langSel); wire(themeSel);
  window.addEventListener('azan:langchange', labels);
})();
