/* Cabrera Elite — floating bubble that sends parents to the "My Account" page (EN/ES).
   Self-contained, like chat.js: the text switches with the page language. */
(function(){
var TXT={
 en:{msg:'Create and manage your account here',sub:'Update your card, see receipts or cancel',href:'/account.html',close:'Close'},
 es:{msg:'Crea y maneja tu cuenta aquí',sub:'Cambia tu tarjeta, ve recibos o cancela',href:'/es/account.html',close:'Cerrar'}
};
function lang(){
  if(document.documentElement.lang==='es')return 'es';
  var l=null;try{l=localStorage.getItem('ce_lang');}catch(e){}
  return l==='es'?'es':'en';
}
try{ if(sessionStorage.getItem('ce_acc_bubble')==='x') return; }catch(e){}

var st=document.createElement('style');
st.textContent=
'#ceAccBubble{position:fixed;left:14px;bottom:58px;z-index:275;max-width:min(270px,calc(100vw - 100px));display:flex;align-items:flex-start;gap:4px;'+
 'background:#14111C;color:#F1EEE4;border:1.5px solid #C9A15A;border-radius:16px 16px 16px 4px;box-shadow:0 10px 28px rgba(0,0,0,.5);font:14px/1.35 Inter,sans-serif;animation:ceAccIn .5s ease .8s both}'+
'#ceAccBubble a{display:block;color:inherit;text-decoration:none;padding:11px 6px 11px 14px}'+
'#ceAccBubble a:hover b{color:#fff}'+
'#ceAccBubble b{display:block;font-weight:700;color:#E4C07C;font-size:14.5px}'+
'#ceAccBubble span{display:block;font-size:12px;color:rgba(241,238,228,.7);margin-top:2px}'+
'#ceAccBubble button{background:none;border:none;color:rgba(241,238,228,.6);font-size:20px;line-height:1;cursor:pointer;padding:6px 10px 6px 4px}'+
'#ceAccBubble button:hover{color:#F1EEE4}'+
'@keyframes ceAccIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'+
'@media (prefers-reduced-motion:reduce){#ceAccBubble{animation:none}}'+
'@media (max-width:520px){#ceAccBubble{bottom:54px;max-width:calc(100vw - 130px)}}';
document.head.appendChild(st);

var box=document.createElement('div');box.id='ceAccBubble';
var a=document.createElement('a'),b=document.createElement('b'),s=document.createElement('span'),x=document.createElement('button');
x.type='button';x.textContent='×';
a.appendChild(b);a.appendChild(s);box.appendChild(a);box.appendChild(x);

function paint(){
  var T=TXT[lang()];
  b.textContent=T.msg+' →';s.textContent=T.sub;a.href=T.href;x.setAttribute('aria-label',T.close);
  // On the registration page keep the parent's form open: open the account page in a new tab.
  if(/register\.html$/.test(location.pathname)){a.target='_blank';a.rel='noopener';}
}
x.addEventListener('click',function(){
  box.remove();
  try{sessionStorage.setItem('ce_acc_bubble','x');}catch(e){}
});
a.addEventListener('click',function(){ if(window.ceTrack) window.ceTrack('account_bubble'); });
paint();
document.body.appendChild(box);
window.addEventListener('langchange',paint);
})();
