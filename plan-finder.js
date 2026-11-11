/* Cabrera Elite — "Which plan fits?" helper for the Membership plans section (EN/ES).
   Only uses the real plan data already published on the page. It never charges or stores anything:
   it just points to the matching plan and links to registration with that plan preselected. */
(function(){
var grid=document.querySelector('#plans .plan-grid');
if(!grid||!grid.parentNode)return;

var PLANS=[
 {key:'Single Practice',idx:0,n:1,price:50,per:50,monthly:false},
 {key:'Plan 2 Days',idx:1,n:8,price:280,per:35,monthly:true},
 {key:'Plan 3 Days',idx:2,n:12,price:400,per:33,monthly:true},
 {key:'Plan 5 Days',idx:3,n:20,price:600,per:30,monthly:true}
];
var TXT={
 en:{title:'Not sure which plan fits?',sub:'Tell us how often your athlete will train.',
  chips:['Just trying it','2 days a week','3 days a week','5 days a week'],
  names:['Single Practice','Plan 2 Days','Plan 3 Days','Plan 5 Days'],
  sess:function(p){return p.monthly?p.n+' sessions per month · '+(p.price===400?'~':'')+'$'+p.per+' per session':'1 coached session · no monthly commitment';},
  price:function(p){return '$'+p.price+(p.monthly?' / month':' / session');},
  renew:'Monthly plans renew automatically every month until cancelled.',
  one:'One-time payment. It does not renew.',
  cta:'Choose this plan →',reg:'/register.html',label:'Choose a training frequency'},
 es:{title:'¿No sabes qué plan te conviene?',sub:'Dinos cuántas veces entrenará tu atleta.',
  chips:['Solo probar','2 días a la semana','3 días a la semana','5 días a la semana'],
  names:['Single Practice','Plan 2 Días','Plan 3 Días','Plan 5 Días'],
  sess:function(p){return p.monthly?p.n+' sesiones al mes · '+(p.price===400?'~':'')+'$'+p.per+' por sesión':'1 sesión coacheada · sin compromiso mensual';},
  price:function(p){return '$'+p.price+(p.monthly?' / mes':' / sesión');},
  renew:'Los planes mensuales se renuevan automáticamente cada mes hasta que se cancelen.',
  one:'Pago único. No se renueva.',
  cta:'Elegir este plan →',reg:'/es/register.html',label:'Elige la frecuencia de entrenamiento'}
};
function lang(){
  if(document.documentElement.lang==='es')return 'es';
  var l=null;try{l=localStorage.getItem('ce_lang');}catch(e){}
  return l==='es'?'es':'en';
}

var st=document.createElement('style');
st.textContent=
'.ce-pf{border:1.5px solid rgba(228,192,124,.45);border-radius:14px;padding:22px 24px;margin:0 0 30px;background:linear-gradient(160deg,rgba(91,58,150,.22),rgba(36,22,56,.7))}'+
'.ce-pf h3{font-family:"Bebas Neue",Impact,"Arial Narrow",sans-serif;font-weight:400;font-size:28px;letter-spacing:.5px;margin:0 0 2px;color:#E4C07C}'+
'.ce-pf .pf-sub{margin:0 0 14px;font-size:14px;color:rgba(241,238,228,.72)}'+
'.ce-pf .pf-chips{display:flex;flex-wrap:wrap;gap:10px}'+
'.ce-pf .pf-chip{font:600 14px Inter,sans-serif;color:#F1EEE4;background:rgba(241,238,228,.06);border:1.5px solid rgba(241,238,228,.22);border-radius:999px;padding:10px 18px;cursor:pointer;transition:background .18s,border-color .18s,transform .18s}'+
'.ce-pf .pf-chip:hover{border-color:#E4C07C;transform:translateY(-2px)}'+
'.ce-pf .pf-chip[aria-pressed="true"]{background:#C9A15A;color:#0B0A0F;border-color:#C9A15A}'+
'.ce-pf .pf-chip:focus-visible{outline:2px solid #E4C07C;outline-offset:2px}'+
'.ce-pf .pf-res{display:none;margin-top:18px;padding-top:16px;border-top:1px solid rgba(241,238,228,.14);gap:14px 24px;align-items:center;justify-content:space-between;flex-wrap:wrap;animation:cePfIn .3s ease both}'+
'.ce-pf .pf-res.on{display:flex}'+
'.ce-pf .pf-name{font-size:20px;font-weight:700}'+
'.ce-pf .pf-price{font-family:"Bebas Neue",Impact,sans-serif;font-size:34px;color:#E4C07C;line-height:1}'+
'.ce-pf .pf-line{font-size:14px;color:rgba(241,238,228,.75);margin-top:2px}'+
'.ce-pf .pf-note{font-size:12.5px;color:rgba(241,238,228,.6);margin-top:4px}'+
'.ce-pf .pf-go{display:inline-block;background:#C9A15A;color:#0B0A0F;font-weight:700;text-decoration:none;padding:13px 22px;border-radius:7px;transition:background .18s,transform .18s}'+
'.ce-pf .pf-go:hover{background:#E4C07C;transform:translateY(-2px)}'+
'.plan-grid .plan-card.ce-hl{border-color:#E4C07C!important;box-shadow:0 0 0 2px rgba(228,192,124,.55),0 18px 40px rgba(0,0,0,.45)!important;transform:translateY(-6px)}'+
'@keyframes cePfIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}'+
'@media (prefers-reduced-motion:reduce){.ce-pf .pf-res{animation:none}.ce-pf .pf-chip,.ce-pf .pf-go{transition:none}}';
document.head.appendChild(st);

var box=document.createElement('div');box.className='ce-pf';
var h=document.createElement('h3'),sub=document.createElement('p');sub.className='pf-sub';
var chips=document.createElement('div');chips.className='pf-chips';chips.setAttribute('role','group');
var res=document.createElement('div');res.className='pf-res';res.setAttribute('aria-live','polite');
var info=document.createElement('div'),nm=document.createElement('div'),pr=document.createElement('div'),ln=document.createElement('div'),nt=document.createElement('div');
nm.className='pf-name';pr.className='pf-price';ln.className='pf-line';nt.className='pf-note';
info.appendChild(nm);info.appendChild(pr);info.appendChild(ln);info.appendChild(nt);
var go=document.createElement('a');go.className='pf-go';
res.appendChild(info);res.appendChild(go);
var btns=PLANS.map(function(p,i){
  var b=document.createElement('button');b.type='button';b.className='pf-chip';b.setAttribute('aria-pressed','false');
  b.addEventListener('click',function(){pick(i);});chips.appendChild(b);return b;
});
box.appendChild(h);box.appendChild(sub);box.appendChild(chips);box.appendChild(res);
grid.parentNode.insertBefore(box,grid);

var cur=-1;
function paint(){
  var T=TXT[lang()];
  h.textContent=T.title;sub.textContent=T.sub;chips.setAttribute('aria-label',T.label);
  btns.forEach(function(b,i){b.textContent=T.chips[i];});
  if(cur<0)return;
  var p=PLANS[cur];
  nm.textContent=T.names[cur];pr.textContent=T.price(p);ln.textContent=T.sess(p);
  nt.textContent=p.monthly?T.renew:T.one;
  go.textContent=T.cta;go.href=T.reg+'?plan='+encodeURIComponent(p.key);
}
function pick(i){
  cur=i;
  btns.forEach(function(b,k){b.setAttribute('aria-pressed',k===i?'true':'false');});
  var cards=grid.querySelectorAll('.plan-card');
  cards.forEach(function(c,k){c.classList.toggle('ce-hl',k===PLANS[i].idx);});
  res.classList.add('on');paint();
}
paint();
window.addEventListener('langchange',paint);
})();
