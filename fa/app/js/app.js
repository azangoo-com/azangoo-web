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

  /* reel: auto-advancing story showcase. Language-neutral: every visible string lives in the HTML (data-pause / data-play on the button). */
  (function(){
    var root=document.getElementById('rl'); if(!root)return;
    var S=[].slice.call(root.querySelectorAll('.rl-s')),C=[].slice.call(root.querySelectorAll('.rl-c')),
        B=[].slice.call(root.querySelectorAll('.rl-bar')),G=[].slice.call(root.querySelectorAll('.rl-g')),
        pp=root.querySelector('.rl-pp'),ppt=pp&&pp.querySelector('span');
    var N=S.length,DUR=4200,cur=0,el=0,last=0,raf=0,inView=!('IntersectionObserver' in window),hold=false,
        paused=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches);
    function label(){if(!pp)return;pp.setAttribute('aria-pressed',paused?'true':'false');if(ppt)ppt.textContent=paused?pp.dataset.play:pp.dataset.pause}
    function set(i){
      cur=(i%N+N)%N;el=0;last=0;
      S.forEach(function(s,k){s.classList.toggle('on',k===cur);s.setAttribute('aria-hidden',k===cur?'false':'true')});
      C.forEach(function(c,k){c.classList.toggle('on',k===cur);c.setAttribute('aria-hidden',k===cur?'false':'true')});
      B.forEach(function(b,k){b.style.setProperty('--p',k<cur||(k===cur&&paused)?1:0);b.setAttribute('aria-current',k===cur?'true':'false')});
      var gi=+S[cur].dataset.g;G.forEach(function(g,k){g.setAttribute('aria-current',k===gi?'true':'false')});
    }
    function running(){return inView&&!hold&&!paused&&!document.hidden}
    function frame(ts){
      raf=0;if(!running()){last=0;return}
      if(last)el+=ts-last;last=ts;
      var p=Math.min(el/DUR,1);B[cur].style.setProperty('--p',p);
      if(p>=1)set(cur+1);
      raf=requestAnimationFrame(frame);
    }
    function kick(){if(!raf&&running()){last=0;raf=requestAnimationFrame(frame)}}
    B.forEach(function(b){b.addEventListener('click',function(){set(+b.dataset.i);kick()})});
    G.forEach(function(g){g.addEventListener('click',function(){set(+g.dataset.go);kick()})});
    if(pp)pp.addEventListener('click',function(){paused=!paused;label();el=0;last=0;B[cur].style.setProperty('--p',paused?1:0);kick()});
    root.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')hold=true});
    root.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse'){hold=false;kick()}});
    document.addEventListener('visibilitychange',kick);
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){inView=es[es.length-1].isIntersecting;kick()}).observe(root.querySelector('.rl-stage')||root);
    set(0);label();
  })();

  /* reveal */
  var rv=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    rv.forEach(function(e){io.observe(e)});
    setTimeout(function(){rv.forEach(function(e){e.classList.add('in')})},4000);
  }else rv.forEach(function(e){e.classList.add('in')});

  /* tester signup: opens the visitor's own mail app with a ready message (nothing is stored or sent by this page) */
  var tf=document.getElementById('testerForm');
  if(tf){
    var ti=document.getElementById('testerEmail'),tm=document.getElementById('testerMsg'),ta=document.getElementById('testerMail');
    tf.addEventListener('submit',function(ev){
      ev.preventDefault();
      var v=(ti.value||'').trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){
        ti.setAttribute('aria-invalid','true'); tm.className='terr bad';
        tm.textContent='ایمیل را درست وارد کنید؛ مثلاً name@example.com'; ti.focus(); return;
      }
      ti.removeAttribute('aria-invalid');
      var body='سلام،\nمی‌خواهم در آزمایش برنامهٔ اندروید اذان گو شرکت کنم.\nایمیل حساب گوگل من: '+v+'\n';
      ta.href='mailto:app@azangoo.com?subject='+encodeURIComponent('درخواست پیوستن به آزمایش اذان گو')+'&body='+encodeURIComponent(body);
      tm.className='terr ok';
      tm.textContent='برنامهٔ ایمیل شما باید باز شده باشد؛ «ارسال» را بزنید. اگر باز نشد، ایمیل را مستقیم برای app@azangoo.com بفرستید.';
      ta.click();
    });
    ti.addEventListener('input',function(){ti.removeAttribute('aria-invalid')});
  }
})();
