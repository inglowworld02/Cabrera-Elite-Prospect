/* Renders optional content from site-config.js. Anything left empty in the config stays hidden. */
(function(){
  var C = window.CE_CONFIG || {};
  function lang(){
    if(document.documentElement.lang==='es') return 'es';
    var l=null; try{ l=new URLSearchParams(location.search).get('lang')||localStorage.getItem('ce_lang'); }catch(e){}
    return l==='es'?'es':'en';
  }
  function pick(o, base){ var l=lang(); return o[base+'_'+l] || o[base+'_en'] || o[base+'_es'] || ''; }
  function el(tag, cls, txt){ var e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e; }
  function safeUrl(u){ return /^https:\/\//i.test(u||''); }
  function safeImg(u){ return /^(images\/[\w\-\/.]+|https:\/\/[^\s"'<>]+)$/i.test(u||''); }
  function show(id, on){ var s=document.getElementById(id); if(s) s.hidden = !on; }
  function safeVid(u){ return /^images\/[\w\-\/.]+\.(mp4|webm)$/i.test(u||''); }

  function render(){
    // Google review + social links
    document.querySelectorAll('[data-ce="review"]').forEach(function(a){
      if(safeUrl(C.googleReviewUrl)){ a.href=C.googleReviewUrl; a.hidden=false; } else a.hidden=true;
    });
    document.querySelectorAll('[data-ce="facebook"]').forEach(function(a){
      if(safeUrl(C.facebookUrl)){ a.href=C.facebookUrl; a.hidden=false; } else a.hidden=true;
    });
    document.querySelectorAll('[data-ce="youtube"]').forEach(function(a){
      if(safeUrl(C.youtubeUrl)){ a.href=C.youtubeUrl; a.hidden=false; } else a.hidden=true;
    });

    // Athletes per coach (adds a card to the safety grid)
    var grid = document.querySelector('#safety .safe-grid');
    if(grid){
      var old = document.getElementById('ceCoachCard'); if(old) old.remove();
      var n = parseInt(C.athletesPerCoach, 10);
      if(n > 0){
        var es = lang()==='es', card = el('div','safe-card'); card.id='ceCoachCard';
        card.appendChild(el('h3','', es?'Atención personalizada':'Personal attention'));
        card.appendChild(el('p','', es?('Máximo '+n+' atletas por entrenador en cada sesión.'):('Up to '+n+' athletes per coach in each session.')));
        grid.appendChild(card);
      }
    }

    // Testimonials
    var t = (C.testimonials||[]).filter(function(x){ return pick(x,'text'); });
    var tw = document.getElementById('ceTestimonialsList');
    if(tw){ tw.textContent=''; t.forEach(function(x){
      var q=el('figure','ce-quote'); q.appendChild(el('blockquote','', '“'+pick(x,'text')+'”'));
      var cap=el('figcaption'); cap.appendChild(el('b','',x.name||'')); var r=pick(x,'role'); if(r) cap.appendChild(el('span','',' · '+r));
      q.appendChild(cap); tw.appendChild(q); }); }
    show('testimonials', t.length>0);

    // Gallery
    var g = (C.gallery||[]).filter(function(x){ return safeImg(x.src); });
    var gw = document.getElementById('ceGalleryList');
    if(gw){ gw.textContent=''; g.forEach(function(x){
      var i=el('img'); i.src=x.src; i.alt=pick(x,'alt'); i.loading='lazy'; gw.appendChild(i); }); }
    show('gallery', g.length>0);

    // Featured athletes
    var f = (C.featuredAthletes||[]).filter(function(x){ return x.name; });
    var fw = document.getElementById('ceFeaturedList');
    if(fw){ fw.textContent=''; f.forEach(function(x){
      var c=el('div','ce-ath'); if(safeImg(x.photo)){ var i=el('img'); i.src=x.photo; i.alt=x.name; i.loading='lazy'; c.appendChild(i); }
      c.appendChild(el('b','',x.name)); var d=pick(x,'detail'); if(d) c.appendChild(el('span','',d)); fw.appendChild(c); }); }
    show('featured', f.length>0);

    // Offers (referrals, siblings, camps...)
    var o = (C.offers||[]).filter(function(x){ return pick(x,'title'); });
    var ow = document.getElementById('ceOffersList');
    if(ow){ ow.textContent=''; o.forEach(function(x){
      var c=el('div','safe-card'); c.appendChild(el('h3','',pick(x,'title'))); var tx=pick(x,'text'); if(tx) c.appendChild(el('p','',tx)); ow.appendChild(c); }); }
    show('offers', o.length>0);
  }

  // ---------- Video: a short clip here, the rest on Instagram ----------
  function renderVideo(){
    var box=document.getElementById('ceVideoBox'); if(!box) return;
    box.textContent='';
    if(!safeUrl(C.videoUrl)){ show('video', false); return; }
    show('video', true);
    var es=lang()==='es';
    function cta(cls){
      var a=el('a', cls||'btn btn-gold', es?'Ver el video completo en Instagram →':'Watch the full video on Instagram →');
      a.href=C.videoUrl; a.target='_blank'; a.rel='noopener';
      a.addEventListener('click', function(){ if(window.ceTrack) window.ceTrack('video_to_instagram'); });
      return a;
    }
    var stage=el('div','vid-stage');
    if(!safeVid(C.videoTeaser)){
      // No clip uploaded yet: a poster card that opens the reel on Instagram.
      var a=cta('vid-poster');
      a.textContent='';
      if(safeImg(C.videoPoster)){ var im=el('img'); im.src=C.videoPoster; im.alt=''; im.loading='lazy'; a.appendChild(im); }
      a.appendChild(el('span','vid-play'));
      a.appendChild(el('b','', es?'Cabrera Elite en acción':'Cabrera Elite in action'));
      a.appendChild(el('span','vid-sub', es?'Ver en Instagram →':'Watch on Instagram →'));
      stage.appendChild(a); box.appendChild(stage); return;
    }
    var v=document.createElement('video');
    v.muted=true; v.defaultMuted=true; v.playsInline=true; v.setAttribute('playsinline',''); v.preload='metadata';
    v.src=C.videoTeaser; if(safeImg(C.videoPoster)) v.poster=C.videoPoster;
    v.setAttribute('aria-label', es?'Avance del video de Cabrera Elite':'Cabrera Elite video preview');
    var limit=Math.max(3, parseInt(C.videoSeconds,10)||10);
    var over=el('div','vid-over'); over.hidden=true;
    over.appendChild(el('p','', es?'¿Quieres ver el resto?':'Want to see the rest?'));
    over.appendChild(cta());
    var rep=el('button','vid-replay', es?'Ver otra vez':'Replay'); rep.type='button';
    over.appendChild(rep);
    var play=el('button','vid-bigplay'); play.type='button'; play.setAttribute('aria-label', es?'Reproducir':'Play');
    var snd=el('button','vid-sound', es?'Activar sonido':'Sound on'); snd.type='button';
    function stop(){ v.pause(); over.hidden=false; play.hidden=true; }
    v.addEventListener('timeupdate', function(){ if(v.currentTime>=limit) stop(); });
    v.addEventListener('ended', stop);
    v.addEventListener('play', function(){ play.hidden=true; });
    v.addEventListener('pause', function(){ if(over.hidden) play.hidden=false; });
    function start(){ over.hidden=true; if(v.currentTime>=limit-0.2) v.currentTime=0; var p=v.play(); if(p&&p.catch) p.catch(function(){ play.hidden=false; }); }
    rep.addEventListener('click', start);
    play.addEventListener('click', start);
    v.addEventListener('click', function(){ if(v.paused) start(); else v.pause(); });
    snd.addEventListener('click', function(){ v.muted=!v.muted; snd.textContent = v.muted ? (es?'Activar sonido':'Sound on') : (es?'Silenciar':'Mute'); });
    stage.appendChild(v); stage.appendChild(play); stage.appendChild(snd); stage.appendChild(over); box.appendChild(stage);
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!calm && 'IntersectionObserver' in window){
      var seen=false;
      new IntersectionObserver(function(en){ en.forEach(function(x){
        if(x.isIntersecting && !seen){ seen=true; start(); } else if(!x.isIntersecting && !v.paused){ v.pause(); }
      }); }, {threshold:0.6}).observe(stage);
    }
  }

  // ---------- Weekly schedule + booking button ----------
  function renderSchedule(){
    var rows=(C.schedule||[]).filter(function(x){ return pick(x,'day'); });
    var list=document.getElementById('ceScheduleList'), hrs=document.getElementById('ceBookHours');
    var times=rows.map(function(x){ return x.time||''; });
    var same=rows.length>1 && times.every(function(t){ return t===times[0]; }) && !rows.some(function(x){ return pick(x,'note'); });
    if(list){ list.textContent=''; list.classList.toggle('chips',same);
      rows.forEach(function(x){
        if(same){ list.appendChild(el('span','sched-chip',pick(x,'day'))); return; }
        var r=el('div','sched-row'); r.appendChild(el('b','',pick(x,'day')));
        r.appendChild(el('span','sched-time',x.time||''));
        var n=pick(x,'note'); if(n) r.appendChild(el('span','sched-note',n));
        list.appendChild(r); });
      list.hidden = rows.length===0; }
    if(hrs){ hrs.hidden=!same; if(same) hrs.textContent=(lang()==='es'?'Horario: ':'Hours: ')+times[0]; }
    var ok=safeUrl(C.bookingUrl);
    document.querySelectorAll('[data-ce="booking"]').forEach(function(a){
      if(ok){ a.href=C.bookingUrl; a.hidden=false; } else a.hidden=true;
    });
    show('schedule', rows.length>0 || ok);
  }

  // ---------- Store (uniforms and accessories) ----------
  function priceOk(x){ return /^\d{1,4}(\.\d{1,2})?$/.test(String(x.price||'')); }
  function renderStore(){
    var items=(C.products||[]).filter(function(x){ return pick(x,'name') && priceOk(x); });
    document.querySelectorAll('[data-ce="store"]').forEach(function(a){ a.hidden = items.length===0; });
    var g=document.getElementById('ceStoreGrid'); if(!g) return;
    var es=lang()==='es';
    g.textContent='';
    items.forEach(function(x){
      var c=el('article','store-card');
      var imgEl=null;
      if(safeImg(x.photo)){ imgEl=el('img'); imgEl.src=x.photo; imgEl.alt=pick(x,'name'); imgEl.loading='lazy'; c.appendChild(imgEl); }
      var b=el('div','store-body');
      b.appendChild(el('h3','',pick(x,'name')));
      var d=pick(x,'desc'); if(d) b.appendChild(el('p','',d));
      b.appendChild(el('div','store-price','$'+x.price));

      // Color options (each color can have its own photo and its own Stripe payment link)
      var colors=Array.isArray(x.colors)?x.colors.filter(function(k){ return k && pick(k,'name'); }).slice(0,12):[];
      var cur=colors.length?colors[0]:null;
      var a=el('a','btn btn-gold','');
      var sel=null;
      var anyBuy=safeUrl(x.buyUrl)||colors.some(function(k){ return safeUrl(k.buyUrl); });
      function buyUrl(){ return (cur&&safeUrl(cur.buyUrl))?cur.buyUrl:(safeUrl(x.buyUrl)?x.buyUrl:''); }
      function setLink(){
        var u=buyUrl();
        if(u){ a.textContent=es?'Comprar':'Buy now'; a.href=u; return; }
        a.textContent=es?'Pedir por WhatsApp':'Order on WhatsApp';
        var t=(es?'Hola, quiero pedir: ':'Hi, I would like to order: ')+pick(x,'name')
          +(cur?(es?', color ':', color ')+pick(cur,'name'):'')
          +(sel?(es?', talla ':', size ')+sel.value:'');
        a.href='https://wa.me/18632689210?text='+encodeURIComponent(t);
      }
      if(colors.length){
        var cw=el('div','store-colors'); cw.setAttribute('role','radiogroup'); cw.setAttribute('aria-label','Color');
        var cl=el('span','store-color-label','Color: '+pick(cur,'name'));
        var row=el('div','store-swatches'); var all=[];
        colors.forEach(function(k,idx){
          var bt=el('button','store-swatch'); bt.type='button'; bt.setAttribute('role','radio');
          bt.setAttribute('aria-label',pick(k,'name')); bt.title=pick(k,'name');
          bt.setAttribute('aria-checked', idx===0?'true':'false');
          if(/^#[0-9a-f]{6}$/i.test(k.hex||'')) bt.style.background=k.hex; else bt.textContent=pick(k,'name').slice(0,3);
          bt.addEventListener('click', function(){
            cur=k; all.forEach(function(z){ z.setAttribute('aria-checked','false'); }); bt.setAttribute('aria-checked','true');
            cl.textContent='Color: '+pick(k,'name');
            if(imgEl && safeImg(k.photo)){ imgEl.src=k.photo; imgEl.alt=pick(x,'name')+' — '+pick(k,'name'); }
            setLink();
          });
          all.push(bt); row.appendChild(bt);
        });
        cw.appendChild(cl); cw.appendChild(row); b.appendChild(cw);
        if(imgEl && safeImg(cur.photo)) imgEl.src=cur.photo;
      }

      var sizes=Array.isArray(x.sizes)?x.sizes.filter(function(z){ return typeof z==='string' && z.length<=12; }):[];
      if(sizes.length){
        if(anyBuy){ b.appendChild(el('p','store-sizes',(es?'Tallas: ':'Sizes: ')+sizes.join(' · '))); }
        else {
          sel=el('select','store-size'); sel.setAttribute('aria-label', es?'Talla':'Size');
          sizes.forEach(function(z){ var o=el('option','',z); o.value=z; sel.appendChild(o); });
          sel.addEventListener('change', setLink);
          b.appendChild(sel);
        }
      }
      a.target='_blank'; a.rel='noopener'; setLink();
      a.addEventListener('click', function(){ if(window.ceTrack) window.ceTrack('store_click', { item: pick(x,'name'), color: cur?pick(cur,'name'):'' }); });
      b.appendChild(a); c.appendChild(b); g.appendChild(c);
    });
    var empty=document.getElementById('ceStoreEmpty'); if(empty) empty.hidden = items.length>0;
  }

  window.addEventListener('langchange', function(){ render(); renderVideo(); renderSchedule(); renderStore(); });
  render(); renderVideo(); renderSchedule(); renderStore();
})();

/* ---------- Conversión: reserva tras enviar, WhatsApp por plan, sugerencia de español ----------
   Solo agrega enlaces y avisos. No cambia precios, textos legales ni el formulario. */
(function(){
  var C = window.CE_CONFIG || {};
  var WA = '18632689210';
  function isEs(){ return document.documentElement.lang==='es' || /^\/es(\/|$)/.test(location.pathname); }
  function safeUrl(u){ return /^https:\/\//i.test(u||''); }
  function waUrl(text){ return 'https://api.whatsapp.com/send?phone='+WA+'&text='+encodeURIComponent(text); }

  // 1) WhatsApp en cada plan, con el nombre del plan en el mensaje
  function planWa(){
    document.querySelectorAll('.plan-card').forEach(function(card){
      var cta=card.querySelector('.plan-cta'); if(!cta || card.querySelector('.plan-wa')) return;
      var a=document.createElement('a'); a.className='plan-wa'; a.target='_blank'; a.rel='noopener';
      cta.insertAdjacentElement('afterend', a);
    });
    refreshPlanWa();
  }
  function refreshPlanWa(){
    var es=isEs();
    document.querySelectorAll('.plan-wa').forEach(function(a){
      var n=a.closest('.plan-card').querySelector('.plan-name'); var p=n?n.textContent.trim():'';
      a.textContent = es ? '¿Dudas? Pregunta por WhatsApp' : 'Questions? Ask on WhatsApp';
      a.href = waUrl(es ? 'Hola, me interesa el plan "'+p+'". ¿Me pueden dar más información?'
                        : 'Hi, I am interested in the "'+p+'" plan. Can you share more details?');
    });
  }

  // 2) Después de enviar la evaluación: elegir día/hora o confirmar por WhatsApp
  window.ceAfterEval = function(msgEl){
    if(!msgEl || !msgEl.parentNode) return;
    var old=document.getElementById('evNext'); if(old) old.remove();
    var es=isEs(), box=document.createElement('div'); box.id='evNext'; box.className='eval-next';
    var p=document.createElement('p'); p.textContent = es ? '¿Quieres reservar un día ahora mismo?' : 'Want to lock in a day right now?';
    box.appendChild(p);
    var row=document.createElement('div'); row.className='eval-next-row';
    if(safeUrl(C.bookingUrl)){
      var b=document.createElement('a'); b.className='btn btn-gold'; b.href=C.bookingUrl; b.target='_blank'; b.rel='noopener';
      b.textContent = es ? 'Elegir día y hora →' : 'Pick a day and time →'; row.appendChild(b);
    }
    var w=document.createElement('a'); w.className='btn btn-outline'; w.target='_blank'; w.rel='noopener';
    w.href = waUrl(es ? 'Hola, acabo de pedir la evaluación gratis en la página. Quiero confirmar el horario.'
                      : 'Hi, I just requested the free evaluation on the website. I would like to confirm a time.');
    w.textContent = es ? 'Confirmar por WhatsApp' : 'Confirm on WhatsApp'; row.appendChild(w);
    box.appendChild(row); msgEl.insertAdjacentElement('afterend', box);
  };

  // 3) Sugerir español (sin redirigir) si el navegador está en español y la persona aún no eligió idioma
  function esHint(){
    if(isEs()) return;
    var nav=(navigator.languages&&navigator.languages[0])||navigator.language||''; if(!/^es(\b|-)/i.test(nav)) return;
    try{ if(localStorage.getItem('ce_lang')||localStorage.getItem('ce_es_hint')) return; }catch(e){ return; }
    var tries=0, t=setInterval(function(){
      tries++;
      var ck=document.getElementById('ceCookie');
      var cookie=ck && ck.offsetParent!==null ? ck : null;   // solo cuenta si se ve
      if(cookie && tries<40) return;                       // espera a que decida las cookies
      clearInterval(t); if(cookie) return;
      var toggle=[].slice.call(document.querySelectorAll('button')).filter(function(b){ return b.textContent.trim()==='ES'; })[0];
      if(!toggle || document.getElementById('esHint')) return;
      var d=document.createElement('div'); d.id='esHint'; d.className='es-hint'; d.setAttribute('role','region'); d.setAttribute('aria-label','Idioma'); d.lang='es';
      var s=document.createElement('span'); s.textContent='¿Prefieres ver el sitio en español?';
      var y=document.createElement('button'); y.type='button'; y.className='es-hint-yes'; y.textContent='Ver en español';
      var n=document.createElement('button'); n.type='button'; n.className='es-hint-no'; n.textContent='No, gracias';
      var nv=document.querySelector('nav.top'); d.style.top=((nv?Math.round(nv.getBoundingClientRect().bottom):110)+10)+'px';   // debajo de la barra de navegación
      y.addEventListener('click', function(){ toggle.click(); });
      n.addEventListener('click', function(){ try{ localStorage.setItem('ce_es_hint','1'); }catch(e){} d.remove(); });
      d.appendChild(s); d.appendChild(y); d.appendChild(n); document.body.appendChild(d);
    }, 1500);
  }

  window.addEventListener('langchange', refreshPlanWa);
  planWa(); esHint();
})();
