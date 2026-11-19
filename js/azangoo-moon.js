/* Copyright (c) 2026 azangoo.com. All rights reserved.
   Azangoo moon-sighting widget (the "moon" type of js/azangoo-widget.js). It is loaded by azangoo-widget.js from the Azangoo
   site when a widget has data-type="moon"; do not load it by itself. Copying, hosting elsewhere, modifying or redistributing
   this code, or its calculations, is prohibited without written permission. See the Terms and conditions page.

   Use:
     <div class="azangoo-widget" data-type="moon" data-lat="43.65" data-lng="-79.38" data-timezone="America/Toronto" data-name="Toronto" data-lang="en"></div>
     <script src="https://www.azangoo.com/js/azangoo-widget.js" async></script>

   Extra options of the moon type (the look options of the prayer-times widget work too: lang, theme, width, accent, bg, color, radius, font, size, digits, clock):
     type     moon
     view     full | now | sight     full = the Moon now and the sky at sunset on the last day of the month (default);
                                     now = only the Moon now (picture, illumination, moonrise and moonset);
                                     sight = only the new crescent of the next month
   The result is an estimate by the Odeh V-criterion for the chosen place; it is not an official announcement. */
(function (root) {
  'use strict';
  var W = root.AzangooWidget;
  if (!W || W.moonReady) return;
  var X = W.x, MI = root.MoonInfo;
  if (!X || !MI) return;

  /* ---------- texts (from the site, js/lang.js) ---------- */
  var TXT = {"fa": {"moon_now": "درصد روشنایی هم اکنون", "moon_rise": "طلوع ماه", "moon_set": "غروب ماه", "moon_sunset": "درصد روشنایی هنگام غروب", "moon_odeh": "رؤیت هلال با معیار عودة (Odeh V-criterion) برآورد می‌شود؛ تخمینی است و اعلام رسمی نیست.", "moon_sight_when": "غروب {weekday} {gd} {gm}، روز {d} ماه {cur}", "moon_sight_best": "بهترین زمان", "moon_sight_pct": "درصد", "moon_sight_29": "طبق محاسبهٔ ما، ماه {cur} {n} روزه است.", "moon_sight_no29": "طبق محاسبهٔ ما، ماه {cur} {n} روزه نیست و {m} روزه می‌شود.", "moon_sight_30": "طبق محاسبهٔ ما، ماه {cur} {m} روزه است.", "moon_eye_yes": "با چشم غیرمسلح قابل مشاهده است.", "moon_eye_maybe": "ممکن است با چشم غیرمسلح دیده شود؛ با دوربین قطعاً دیده می‌شود.", "moon_eye_aid": "با چشم غیرمسلح دیده نمی‌شود؛ فقط با دوربین.", "moon_eye_no": "با چشم غیرمسلح دیده نمی‌شود و با دوربین هم قابل مشاهده نیست.", "moon_sight_none": "هلال قابل مشاهده نیست", "moon_sight_alt": "آسمان در بهترین زمان مشاهدهٔ هلال", "moon_alt": "ماه، {p} درصد روشن", "moon_sight": "رؤیت ماه {next}", "moon_start": "اول ماه {next} در این مکان روز {weekday} {gd} {gm} {gy} برابر {sd} {sm} {sy} می‌باشد.", "predicted_mark": "(پیش‌بینی)", "official_mark": "(اعلام رسمی)", "dir": "از جهت {card}، {deg} درجه به سمت {side}", "moon_sight_look_l": "جهت مشاهده", "moon_sight_look_alt": "حدود {alt} درجه بالای افق"}, "en": {"moon_now": "Illumination now", "moon_rise": "Moonrise", "moon_set": "Moonset", "moon_sunset": "Illumination at sunset", "moon_odeh": "Crescent visibility is estimated with the Odeh V-criterion; it is an estimate, not an official announcement.", "moon_sight_when": "Sunset on {weekday}, {gd} {gm}, day {d} of {cur}", "moon_sight_best": "Best time", "moon_sight_pct": "Illumination", "moon_sight_29": "By our calculation, {cur} has {n} days.", "moon_sight_no29": "By our calculation, {cur} does not have {n} days; it will have {m}.", "moon_sight_30": "By our calculation, {cur} has {m} days.", "moon_eye_yes": "Visible to the naked eye.", "moon_eye_maybe": "May be visible to the naked eye; certainly with binoculars or a telescope.", "moon_eye_aid": "Not visible to the naked eye; only with binoculars or a telescope.", "moon_eye_no": "Not visible to the naked eye, nor with binoculars.", "moon_sight_none": "Crescent not visible", "moon_sight_alt": "The sky at the best time to see the crescent", "moon_alt": "Moon, {p}% illuminated", "moon_sight": "{next} moon sighting", "moon_start": "The first day of {next} in this place is {weekday}, {gd} {gm} {gy}, which is {sd} {sm} {sy} (Solar Hijri).", "predicted_mark": "(predicted)", "official_mark": "(official)", "dir": "{deg}° {side} of {card}", "moon_sight_look_l": "Where to look", "moon_sight_look_alt": "About {alt}° above the horizon"}, "ur": {"moon_now": "ابھی روشنی کا فیصد", "moon_rise": "چاند کا طلوع", "moon_set": "چاند کا غروب", "moon_sunset": "غروب کے وقت روشنی کا فیصد", "moon_odeh": "ہلال کی رؤیت کا اندازہ معیارِ عودہ (Odeh V-criterion) سے لگایا جاتا ہے؛ یہ اندازہ ہے، سرکاری اعلان نہیں۔", "moon_sight_when": "غروب {weekday} {gd} {gm}، {cur} کا دن {d}", "moon_sight_best": "بہترین وقت", "moon_sight_pct": "فیصد", "moon_sight_29": "ہمارے حساب کے مطابق ماہ {cur} {n} دن کا ہے۔", "moon_sight_no29": "ہمارے حساب کے مطابق ماہ {cur} {n} دن کا نہیں ہے اور {m} دن کا ہوگا۔", "moon_sight_30": "ہمارے حساب کے مطابق ماہ {cur} {m} دن کا ہے۔", "moon_eye_yes": "ننگی آنکھ سے دکھائی دیتا ہے۔", "moon_eye_maybe": "ننگی آنکھ سے دکھائی دے سکتا ہے؛ دوربین سے یقیناً۔", "moon_eye_aid": "ننگی آنکھ سے دکھائی نہیں دیتا؛ صرف دوربین سے۔", "moon_eye_no": "ننگی آنکھ سے دکھائی نہیں دیتا اور دوربین سے بھی نہیں۔", "moon_sight_none": "ہلال دکھائی نہیں دیتا", "moon_sight_alt": "ہلال کی بہترین رؤیت کے وقت کا آسمان", "moon_alt": "چاند، {p} فیصد روشن", "moon_sight": "ماہِ {next} کی رؤیت", "moon_start": "{next} کا پہلا دن اس جگہ {weekday}، {gd} {gm} {gy} ہے، جو شمسی تاریخ {sd} {sm} {sy} ہے۔", "predicted_mark": "(پیش گوئی)", "official_mark": "(سرکاری اعلان)", "dir": "جہت {card}، {deg} درجہ {side} کی طرف", "moon_sight_look_l": "دیکھنے کی سمت", "moon_sight_look_alt": "افق سے تقریباً {alt} درجہ اوپر"}, "ar": {"moon_now": "نسبة الإضاءة الآن", "moon_rise": "طلوع القمر", "moon_set": "غروب القمر", "moon_sunset": "نسبة الإضاءة عند الغروب", "moon_odeh": "تُقدَّر رؤية الهلال بمعيار عودة (Odeh V-criterion)؛ وهو تقدير وليس إعلانًا رسميًا.", "moon_sight_when": "غروب {weekday} {gd} {gm}، يوم {d} من {cur}", "moon_sight_best": "أفضل وقت", "moon_sight_pct": "النسبة", "moon_sight_29": "بحسب حسابنا، شهر {cur} {n} يومًا.", "moon_sight_no29": "بحسب حسابنا، شهر {cur} ليس {n} يومًا بل يكون {m} يومًا.", "moon_sight_30": "بحسب حسابنا، شهر {cur} {m} يومًا.", "moon_eye_yes": "يُرى بالعين المجرّدة.", "moon_eye_maybe": "قد يُرى بالعين المجرّدة، ويُرى بالمنظار قطعًا.", "moon_eye_aid": "لا يُرى بالعين المجرّدة؛ بالمنظار فقط.", "moon_eye_no": "لا يُرى بالعين المجرّدة ولا بالمنظار.", "moon_sight_none": "الهلال غير مرئي", "moon_sight_alt": "السماء في أفضل وقت لرؤية الهلال", "moon_alt": "القمر، مضاء بنسبة {p}%", "moon_sight": "رؤية هلال {next}", "moon_start": "أول أيام {next} في هذا المكان هو {weekday}، {gd} {gm} {gy}، الموافق {sd} {sm} {sy} (التقويم الشمسي الهجري).", "predicted_mark": "(توقع)", "official_mark": "(إعلان رسمي)", "dir": "{deg}° {side} من {card}", "moon_sight_look_l": "جهة الرؤية", "moon_sight_look_alt": "على ارتفاع نحو {alt}° فوق الأفق"}};
  var NAMES = {"fa":{"weekdays":["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"],"greg":["ژانویه","فوریه","مارس","آوریل","مه","ژوئن","ژوئیه","اوت","سپتامبر","اکتبر","نوامبر","دسامبر"],"shamsi":["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"],"hijri":["محرم","صفر","ربیع‌الاول","ربیع‌الثانی","جمادی‌الاول","جمادی‌الثانی","رجب","شعبان","رمضان","شوال","ذی‌القعده","ذی‌الحجه"],"card":{"N":"شمال","E":"شرق","S":"جنوب","W":"غرب"},"side":{"N":"شمال","E":"شرق","S":"جنوب","W":"غرب"}},"en":{"weekdays":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"greg":["January","February","March","April","May","June","July","August","September","October","November","December"],"shamsi":["Farvardin","Ordibehesht","Khordad","Tir","Mordad","Shahrivar","Mehr","Aban","Azar","Dey","Bahman","Esfand"],"hijri":["Muharram","Safar","Rabi al-Awwal","Rabi al-Thani","Jumada al-Awwal","Jumada al-Thani","Rajab","Sha’ban","Ramadan","Shawwal","Dhu al-Qi’dah","Dhu al-Hijjah"],"card":{"N":"north","E":"east","S":"south","W":"west"},"side":{"N":"north","E":"east","S":"south","W":"west"}},"ur":{"weekdays":["اتوار","پیر","منگل","بدھ","جمعرات","جمعہ","ہفتہ"],"greg":["جنوری","فروری","مارچ","اپریل","مئی","جون","جولائی","اگست","ستمبر","اکتوبر","نومبر","دسمبر"],"shamsi":["فروردین","اردی بہشت","خرداد","تیر","مرداد","شہریور","مہر","آبان","آذر","دی","بہمن","اسفند"],"hijri":["محرم","صفر","ربیع الاول","ربیع الثانی","جمادی الاول","جمادی الثانی","رجب","شعبان","رمضان","شوال","ذوالقعدہ","ذوالحجہ"],"card":{"N":"شمال","E":"مشرق","S":"جنوب","W":"مغرب"},"side":{"N":"شمال","E":"مشرق","S":"جنوب","W":"مغرب"}},"ar":{"weekdays":["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"greg":["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],"shamsi":["فروردين","أرديبهشت","خرداد","تير","مرداد","شهريور","مهر","آبان","آذر","دي","بهمن","إسفند"],"hijri":["محرم","صفر","ربيع الأول","ربيع الآخر","جمادى الأولى","جمادى الآخرة","رجب","شعبان","رمضان","شوال","ذو القعدة","ذو الحجة"],"card":{"N":"شمال","E":"شرق","S":"جنوب","W":"غرب"},"side":{"N":"شمال","E":"شرق","S":"جنوب","W":"غرب"}}};
  var DIGITS = { fa: '۰۱۲۳۴۵۶۷۸۹', ur: '۰۱۲۳۴۵۶۷۸۹', ar: '٠١٢٣٤٥٦٧٨٩' };

  var CSS = [
    '.mw .hd{margin-bottom:2px}',
    '.mw .now{display:flex;align-items:center;gap:14px;margin-top:10px}',
    '.mw .pic{flex:none;width:84px;height:84px;border-radius:50%;object-fit:cover;display:block;box-shadow:0 0 0 1px rgba(240,213,138,.4),0 0 18px rgba(240,213,138,.3);background:#0a1530}',
    '.mw .rows{flex:1;min-width:0;display:grid;grid-template-columns:auto 1fr;gap:4px 10px;font-size:.88em}',
    '.mw .rows dt{color:var(--_mut)}',
    '.mw .rows dd{font-weight:700;text-align:end;font-variant-numeric:tabular-nums;unicode-bidi:isolate}',
    '.mw .sec{margin-top:12px;padding-top:10px;border-top:1px solid var(--_line)}',
    '.mw .st{font-weight:700;color:var(--acc);font-size:.95em}',
    '.mw .when{color:var(--_mut);font-size:.82em;margin:2px 0 8px}',
    '.mw .scene{position:relative;border-radius:12px;overflow:hidden;border:1px solid var(--_line);background:#0a1530;line-height:0}',
    '.mw .scene svg{display:block;width:100%;height:auto}',
    '.mw .lab{position:absolute;left:0;right:0;bottom:0;display:flex;flex-wrap:wrap;justify-content:center;gap:2px 14px;padding:0 8px 6px;font-weight:700;font-size:.78em;line-height:1.5;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.9)}',
    '.mw .lab b{color:#f3d98e}',
    '.mw .p{margin-top:8px;font-size:.88em;line-height:1.7}',
    '.mw .eye{display:flex;align-items:flex-start;gap:8px;font-weight:700}',
    '.mw .eye::before{content:"";flex:none;width:10px;height:10px;margin-top:.5em;border-radius:50%;background:#8a8a8a}',
    '.mw .eye.is-yes::before{background:#3fbf7a}.mw .eye.is-maybe::before{background:#e6c04a}.mw .eye.is-aid::before{background:#f0913a}.mw .eye.is-no::before{background:#e5585a}',
    '.mw .look{margin-top:8px;padding:8px 10px;border-radius:10px;border:1px solid var(--_line)}',
    '.mw .look .k{color:var(--acc);font-weight:700;font-size:.85em}',
    '.mw .look .v{font-weight:700;line-height:1.6}',
    '.mw .look .a{color:var(--_mut);font-size:.82em}',
    '.mw .start{font-weight:600}',
    '.mw .note{margin-top:10px;color:var(--_mut);font-size:.74em;line-height:1.7}'
  ].join('\n');

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function p2(n) { return n < 10 ? '0' + n : '' + n; }

  /* UTC offset (hours) of an IANA zone at an instant */
  function zoneOffset(zone, ms) {
    try {
      var f = new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
      var p = {}; f.formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = +x.value; });
      return (Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second) - Math.floor(ms / 1000) * 1000) / 3600000;
    } catch (e) { return 0; }
  }

  var uidN = 0;

  function render(el, o) {
    var lang = TXT[o.lang] ? o.lang : 'en', L0 = X.LANGS[lang], T = TXT[lang];
    var theme = /^(auto|light|night|dark|emerald|ocean|sand|rose)$/.test(o.theme) ? o.theme : 'auto';
    var view = /^(full|now|sight)$/.test(o.view) ? o.view : 'full';
    var clock = o.clock === '12' ? '12' : '24';
    var latin = o.digits === 'latin' || lang === 'en';
    var dset = DIGITS[lang];

    var host = el;
    var rootEl = el.attachShadow ? el.attachShadow({ mode: 'open' }) : el;
    X.applyLook(host, o);
    var style = document.createElement('style');
    style.textContent = X.CSS + '\n' + CSS;
    var box = document.createElement('div');
    box.className = 'w mw t-' + theme;
    box.setAttribute('dir', L0.rtl ? 'rtl' : 'ltr');
    box.setAttribute('lang', lang);
    rootEl.appendChild(style); rootEl.appendChild(box);

    /* the language provider the moon module (js/moon-info.js) asks for */
    function num(x) {
      var s = String(x);
      if (latin) return s;
      return s.replace(/\d/g, function (d) { return dset[+d]; }).replace(/\./g, '٫');
    }
    var L = {
      t: function (k, v) {
        var s = T[k]; if (typeof s !== 'string') return '';
        if (v) Object.keys(v).forEach(function (n) { s = s.split('{' + n + '}').join(v[n]); });
        return s;
      },
      num: num,
      percent: function (x) { return latin ? num(x) + '%' : '\u2066' + num(x) + '\u2069٪'; },
      names: function (k) { return NAMES[lang][k]; },
      current: function () { return lang; }
    };
    function tm(ms, off) {                                   /* a clock time in the place, in the chosen clock style and digits */
      var d = new Date(ms + off * 3600000);
      return X.fmtTime(p2(d.getUTCHours()) + ':' + p2(d.getUTCMinutes()), L0, clock, latin ? 'latin' : 'native');
    }
    var siteLink = X.BASE + lang + '/index.html';
    function head(name, place) {
      var a = document.createElement('a');
      a.className = 'hd'; a.target = '_blank'; a.rel = 'noopener';
      a.href = place ? siteLink + '?lat=' + place.lat + '&lng=' + place.lng + (name ? '&city=' + encodeURIComponent(name) : '') : siteLink;
      var img = document.createElement('img'); img.src = X.BASE + 'icons/icon-192.png'; img.alt = 'Azangoo'; img.width = 34; img.height = 34;
      var t = document.createElement('div'); t.className = 'ttl';
      var b = document.createElement('span'); b.className = 'brand'; b.textContent = L0.brand;
      t.appendChild(b);
      if (name) { var c = document.createElement('span'); c.className = 'city'; c.textContent = name; t.appendChild(c); }
      a.appendChild(img); a.appendChild(t);
      return a;
    }
    function foot() { return X.footer(lang, 'moon'); }
    function message(text) {
      box.innerHTML = '';
      box.appendChild(head('', null));
      var m = document.createElement('div'); m.className = 'msg'; m.textContent = text; box.appendChild(m);
      box.appendChild(foot());
    }

    function start(place) {
      var name = o.name || place.name || '', timer = null, uid = 'w' + (++uidN);
      function draw() {
        var now = Date.now(), off = zoneOffset(place.zone, now), out;
        try { out = MI.withLang(L, function () { return MI.compute(place.lat, place.lng, off, now); }); }
        catch (e) { message(L0.err); return; }
        var html = '';
        MI.setImageBase(X.BASE);
        if (view !== 'sight') {
          html += '<div class="now"><img class="pic" width="84" height="84" alt="' + esc(L.t('moon_alt', { p: num(out.illumNow.toFixed(1)) })) + '" src="' + esc(X.BASE + 'images/moon/' + out.img) + '">' +
            '<dl class="rows"><dt>' + esc(T.moon_now) + '</dt><dd>' + L.percent(out.illumNow.toFixed(2)) + '</dd>' +
            '<dt>' + esc(T.moon_rise) + '</dt><dd>' + (out.rise ? tm(out.rise.t, off) : '—') + '</dd>' +
            '<dt>' + esc(T.moon_set) + '</dt><dd>' + (out.set ? tm(out.set.t, off) : '—') + '</dd>' +
            '<dt>' + esc(T.moon_sunset) + '</dt><dd>' + (out.sunsetIllum !== null ? L.percent(out.sunsetIllum.toFixed(2)) : '—') + '</dd></dl></div>';
        }
        var sg = out.sight;
        if (view !== 'now' && sg) {
          var g = new Date(sg.t + off * 3600000), s = sg;
          var when = L.t('moon_sight_when', { weekday: NAMES[lang].weekdays[g.getUTCDay()], gd: num(g.getUTCDate()), gm: NAMES[lang].greg[g.getUTCMonth()], d: num(s.day), cur: out.cur });
          var label = s.bt !== null
            ? '<span>' + esc(T.moon_sight_best) + ': <b>' + tm(s.bt, off) + '</b></span><span>' + esc(T.moon_sight_pct) + ': <b>' + L.percent(s.illum.toFixed(2)) + '</b></span>'
            : '<span>' + esc(T.moon_sight_none) + '</span>';
          var len = L.t(s.day === 30 ? 'moon_sight_30' : (s.is29 ? 'moon_sight_29' : 'moon_sight_no29'), { cur: out.cur, n: num(29), m: num(30) });
          var svg = MI.withLang(L, function () { return MI.scene(s, uid, 44, T.moon_sight_alt); });
          var look = '';
          if (s.bt !== null) {
            look = '<div class="look"><div class="k">' + esc(T.moon_sight_look_l) + '</div><div class="v">' + esc(MI.withLang(L, function () { return MI.dirText(s.moonAz); })) + '</div>' +
              '<div class="a">' + esc(L.t('moon_sight_look_alt', { alt: num(Math.max(1, Math.round(s.moonAlt))) })) + '</div></div>';
          }
          html += '<div class="sec"><div class="st">' + esc(L.t('moon_sight', { next: out.next })) + '</div><div class="when">' + esc(when) + '</div>' +
            '<div class="scene">' + svg + '<div class="lab">' + label + '</div></div>' +
            '<p class="p">' + esc(len) + '</p><p class="p eye is-' + s.level + '">' + esc(T['moon_eye_' + s.level]) + '</p>' + look +
            (out.startText ? '<p class="p start">' + esc(out.startText) + '</p>' : '') + '</div>';
        }
        /* the estimate is never shown without saying so */
        html += '<p class="note">' + esc(T.moon_odeh) + '</p>';
        box.innerHTML = '';
        box.appendChild(head(name, place));
        var body = document.createElement('div'); body.innerHTML = html;
        while (body.firstChild) box.appendChild(body.firstChild);
        box.appendChild(foot());
      }
      draw();
      timer = setInterval(function () { if (!document.body.contains(host)) { clearInterval(timer); return; } draw(); }, 5 * 60 * 1000);
    }

    X.place(o, lang).then(start).catch(function (e) { message(e && e.code === 'nocity' ? L0.loc : L0.err); });
  }

  W.moon = render;
  W.moonReady = true;
  if (W.moonQueue) { var q = W.moonQueue; W.moonQueue = null; q.forEach(function (f) { f(); }); }
})(window);
