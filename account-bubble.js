/* Cabrera Elite — floating bubble that sends parents to the "My Account" page (EN/ES).
   Interactive: it gently pulses to get noticed, lifts on hover/focus, and the "x" shrinks it into a small
   round button (tap it to open the bubble again) instead of making it disappear. */
(function(){
var TXT={
 en:{msg:'Create and manage your account here',sub:'Update your card, see receipts or cancel',href:'/account.html',min:'Minimize',open:'Show account help'},
 es:{msg:'Crea y maneja tu cuenta aquí',sub:'Cambia tu tarjeta, ve recibos o cancela',href:'/es/account.html',min:'Minimizar',open:'Mostrar ayuda de cuenta'}
};
function lang(){
  if(document.documentElement.lang==='es')return 'es';
  var l=null;try{l=localStorage.getItem('ce_lang');}catch(e){}
  return l==='es'?'es':'en';
}
function getMin(){try{return sessionStorage.getItem('ce_acc_bubble')==='min';}catch(e){return false;}}
function setMin(v){try{sessionStorage.setItem('ce_acc_bubble',v?'min':'');}catch(e){}}

var st=document.createElement('style');
st.textContent=
'#ceAcc{position:fixed;left:14px;bottom:58px;z-index:275;font:14px/1.35 Inter,sans-serif}'+
'#ceAcc .bub{position:relative;display:flex;align-items:flex-start;gap:4px;max-width:min(270px,calc(100vw - 100px));background:#14111C;color:#F1EEE4;'+
 'border:1.5px solid #C9A15A;border-radius:16px 16px 16px 4px;box-shadow:0 10px 28px rgba(0,0,0,.5);transform-origin:left bottom;'+
 'animation:ceAccIn .5s ease .8s both,ceAccNudge 7s ease-in-out 4s infinite;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}'+
'#ceAcc .bub:hover,#ceAcc .bub:focus-within{transform:translateY(-3px) scale(1.03);box-shadow:0 14px 34px rgba(201,161,90,.35);border-color:#E4C07C;animation-play-state:paused}'+
'#ceAcc .bub:active{transform:scale(.98)}'+
'#ceAcc .go{display:block;color:inherit;text-decoration:none;padding:11px 6px 11px 14px;border-radius:16px}'+
'#ceAcc .go:focus-visible{outline:2px solid #E4C07C;outline-offset:2px}'+
'#ceAcc b{display:block;font-weight:700;color:#E4C07C;font-size:14.5px}'+
'#ceAcc b i{display:inline-block;font-style:normal;margin-left:2px;transition:transform .18s ease}'+
'#ceAcc .bub:hover b i,#ceAcc .bub:focus-within b i{transform:translateX(4px)}'+
'#ceAcc span.sub{display:block;font-size:12px;color:rgba(241,238,228,.7);margin-top:2px}'+
'#ceAcc .x{background:none;border:none;color:rgba(241,238,228,.6);font-size:20px;line-height:1;cursor:pointer;padding:6px 10px 6px 4px}'+
'#ceAcc .x:hover{color:#F1EEE4}'+
'#ceAcc .dot{display:none;width:48px;height:48px;border-radius:50%;border:1.5px solid #C9A15A;background:#14111C;color:#E4C07C;cursor:pointer;'+
 'box-shadow:0 8px 22px rgba(0,0,0,.5);padding:0;place-items:center;position:relative;animation:ceAccPop .3s ease both}'+
'#ceAcc .dot svg{width:24px;height:24px}'+
'#ceAcc .dot::after{content:"";position:absolute;inset:-2px;border-radius:50%;border:2px solid #C9A15A;opacity:0;animation:ceAccRing 3.2s ease-out 1.5s infinite}'+
'#ceAcc .dot:hover{background:#241638}'+
'#ceAcc.min .bub{display:none}#ceAcc.min .dot{display:grid}'+
'@keyframes ceAccIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'+
'@keyframes ceAccNudge{0%,86%,100%{transform:none}90%{transform:translateY(-6px)}94%{transform:translateY(0)}97%{transform:translateY(-3px)}}'+
'@keyframes ceAccPop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}'+
'@keyframes ceAccRing{0%{opacity:.8;transform:scale(1)}70%,100%{opacity:0;transform:scale(1.6)}}'+
'@media (prefers-reduced-motion:reduce){#ceAcc .bub,#ceAcc .dot,#ceAcc .dot::after{animation:none}#ceAcc .bub,#ceAcc b i{transition:none}}'+
'@media (max-width:520px){#ceAcc{bottom:54px}#ceAcc .bub{max-width:calc(100vw - 130px)}}';
document.head.appendChild(st);

var box=document.createElement('div');box.id='ceAcc';
var bub=document.createElement('div');bub.className='bub';
var a=document.createElement('a');a.className='go';
var b=document.createElement('b'),arrow=document.createElement('i'),s=document.createElement('span');s.className='sub';
arrow.textContent='→';
var x=document.createElement('button');x.type='button';x.className='x';x.textContent='−';
var dot=document.createElement('button');dot.type='button';dot.className='dot';
dot.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>';
a.appendChild(b);a.appendChild(s);bub.appendChild(a);bub.appendChild(x);box.appendChild(bub);box.appendChild(dot);

function paint(){
  var T=TXT[lang()];
  b.textContent=T.msg+' ';b.appendChild(arrow);s.textContent=T.sub;a.href=T.href;
  x.setAttribute('aria-label',T.min);x.title=T.min;dot.setAttribute('aria-label',T.open);dot.title=T.open;
  // On the registration page keep the parent's form open: open the account page in a new tab.
  if(/register\.html$/.test(location.pathname)){a.target='_blank';a.rel='noopener';}
}
function apply(min){box.classList.toggle('min',min);}
x.addEventListener('click',function(){setMin(true);apply(true);});
dot.addEventListener('click',function(){setMin(false);apply(false);});
a.addEventListener('click',function(){ if(window.ceTrack) window.ceTrack('account_bubble'); });
paint();apply(getMin());
document.body.appendChild(box);
window.addEventListener('langchange',paint);
})();
