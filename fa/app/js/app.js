/* Azangoo Android app promo pages - shared script */
(function(){
  var root=document.documentElement; root.classList.add('js');
  var fa='۰۱۲۳۴۵۶۷۸۹';
  function pd(s){return String(s).replace(/\d/g,function(d){return fa[d]})}
  function two(n){return (n<10?'0':'')+n}

  /* countdown demo (loops) */
  var left=1*3600+45*60+12;
  var els=[].slice.call(document.querySelectorAll('.cd')).concat([document.getElementById('heroCount'),document.getElementById('wdCount'),document.getElementById('wdCount2')]);
  function tick(){
    var h=Math.floor(left/3600),m=Math.floor(left%3600/60),s=left%60;
    var t=pd(two(h)+':'+two(m)+':'+two(s));
    els.forEach(function(e){if(e)e.textContent=t});
    left=left<=0?1*3600+45*60+12:left-1;
  }
  tick(); setInterval(tick,1000);

  /* tickers */
  var words=['اوقات شرعی برای مکان شما','اذان سر وقت','پخش، اعلان یا خاموش','دعا قبل و بعد از اذان','دعاهای ویژهٔ رمضان','رؤیت ماه در لحظه','بهترین زمان رؤیت هلال','پیش‌بینی ماه قمری','شمارش معکوس اذان','ویجت اوقات شرعی و ماه','قبله‌نما','تسبیح و دعا'];
  var tk=document.getElementById('tick1');
  if(tk){var h='';for(var r=0;r<2;r++)words.forEach(function(w){h+='<span>'+w+'</span>'});tk.innerHTML=h}

  /* gallery */
  var shots=[['home','صفحهٔ اصلی'],['moon-live','ماه لحظه‌ای'],['adhan-settings','تنظیم اذان'],['qibla-sat','قبله'],['cal-week','تقویم هفتگی'],['events-day','وقایع تقویم'],['dua-around','دعا و اذان'],['tasbih','تسبیح'],['methods','روش محاسبه'],['dua-ramadan','رمضان'],['moon-predict','پیش‌بینی ماه'],['ayat','آیت‌الکرسی'],['location','مکان']];
  var gt=document.getElementById('galTrack');
  if(gt){var g='';for(var k=0;k<2;k++)shots.forEach(function(s){g+='<div class="phone"'+(k?' aria-hidden="true"':'')+'><img src="img/'+s[0]+'.webp" alt="'+(k?'':s[1])+'" width="500" height="1083" loading="lazy"></div>'});gt.innerHTML=g}

  /* adhan modes */
  var modes=[['play','پخش اذان','i-play'],['notif','فقط اعلان','i-bell'],['off','خاموش','i-bell-off']];
  var init={'صبح':'play','ظهر':'notif','مغرب':'play'};
  var out=document.getElementById('mout'),oT=document.getElementById('moutT'),oS=document.getElementById('moutS');
  function show(p,t,m){
    out.setAttribute('data-state',m);
    var use=out.querySelector('use');
    if(m==='play'){oT.textContent='اذان '+p+' · '+t;oS.textContent='صدای اذان پخش می‌شود، حتی با بسته بودن برنامه.';use.setAttribute('href','#i-bell')}
    if(m==='notif'){oT.textContent='اذان '+p+' · '+t;oS.textContent='فقط یک اعلان نمایش داده می‌شود، بدون صدا.';use.setAttribute('href','#i-bell')}
    if(m==='off'){oT.textContent='اذان '+p;oS.textContent='خاموش است؛ نه صدایی هست و نه اعلانی.';use.setAttribute('href','#i-bell-off')}
  }
  document.querySelectorAll('#modes .mrow').forEach(function(row){
    var p=row.dataset.p,t=row.dataset.t,seg=row.querySelector('.seg'),cur=init[p];
    modes.forEach(function(m){
      var b=document.createElement('button');b.type='button';b.setAttribute('role','radio');
      b.setAttribute('aria-checked',m[0]===cur?'true':'false');
      b.innerHTML='<svg class="ico"><use href="#'+m[2]+'"/></svg><span>'+m[1]+'</span>';
      b.addEventListener('click',function(){
        seg.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-checked','false')});
        b.setAttribute('aria-checked','true');show(p,t,m[0]);
      });
      seg.appendChild(b);
    });
  });
  if(out)show('ظهر','۱۲:۰۴','notif');

  /* tabs */
  document.querySelectorAll('[data-tabs]').forEach(function(box){
    var btns=box.querySelectorAll('[role=tab]');
    function set(id){
      btns.forEach(function(b){b.setAttribute('aria-selected',b.dataset.tab===id?'true':'false')});
      box.querySelectorAll('[data-for]').forEach(function(e){e.hidden=e.dataset.for!==id});
    }
    btns.forEach(function(b){b.addEventListener('click',function(){set(b.dataset.tab)})});
    var hh=(location.hash||'').slice(1);
    if(hh&&box.querySelector('[data-tab="'+hh+'"]')){set(hh);setTimeout(function(){box.scrollIntoView({block:'start'})},60)}
  });

  /* methods */
  var ml=document.querySelectorAll('#methodList .method');
  ml.forEach(function(b){b.addEventListener('click',function(){ml.forEach(function(x){x.setAttribute('aria-checked','false')});b.setAttribute('aria-checked','true')})});

  /* theme + clock demo */
  var tb=document.getElementById('tbox');
  if(tb){
    var to=document.querySelectorAll('[data-theme-opt]');
    to.forEach(function(b){b.addEventListener('click',function(){
      to.forEach(function(x){x.setAttribute('aria-checked','false')});b.setAttribute('aria-checked','true');
      var t=b.dataset.themeOpt;
      if(t==='auto'){t=(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark'}
      tb.setAttribute('data-t',t);
    })});
    var co=document.querySelectorAll('[data-clock]');
    co.forEach(function(b){b.addEventListener('click',function(){
      co.forEach(function(x){x.setAttribute('aria-checked','false')});b.setAttribute('aria-checked','true');
      tb.querySelectorAll('time').forEach(function(e){e.textContent=b.dataset.clock==='12'?e.dataset.t12:e.dataset.t24});
    })});
  }

  /* reveal */
  var rv=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    rv.forEach(function(e){io.observe(e)});
    setTimeout(function(){rv.forEach(function(e){e.classList.add('in')})},4000);
  }else rv.forEach(function(e){e.classList.add('in')});
})();
