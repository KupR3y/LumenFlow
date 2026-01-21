/* Minimal interactive behavior:
 - smooth anchor scrolling
 - portfolio modal
 - scenarios switcher
 - simple phone mask and form validation
 - modals for privacy & thanks
*/

const qs = (s, root=document)=>root.querySelector(s);
const qsa = (s, root=document)=>Array.from(root.querySelectorAll(s));

// smooth anchors
qsa('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href.startsWith('#')){
      const target = document.querySelector(href);
      if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
    }
  });
});

// reveal-on-scroll (simple)
const revealItems = qsa('.reveal, .card, .price-card, .proj-card, .testimonial, .faq-list details');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      en.target.classList.add('is-visible');
      io.unobserve(en.target);
    }
  });
},{threshold:0.12, rootMargin:'0px 0px -10% 0px'});

revealItems.forEach(el=>{
  el.classList.add('reveal-item');
  io.observe(el);
});

// Portfolio data (short descriptions)
const projects = [
  {title:'Квартира — Гостиная', tags:'скрытая подсветка, умные сценарии', imgs:[
    'assets/portfolio-1.jpg'
  ], desc:'Равномерный свет по зонам, мягкие вечерние сценарии.'},

  {title:'Квартира — Спальня', tags:'акцентный свет, сценарии', imgs:[
    'assets/portfolio-2.jpg'
  ], desc:'Тёплые сцены для отдыха и чтения.'},

  {title:'Коммерция — Ресторан', tags:'акценты, витрины', imgs:[
    'assets/portfolio-3.jpg'
  ], desc:'Контрастные акценты на столах и витринах.'},

  {title:'Коммерция — Офис', tags:'скрытая подсветка, комфорт', imgs:[
    'assets/portfolio-4.jpg'
  ], desc:'Фокус на эргономике и зональном освещении.'},

  {title:'Квартира — Кухня', tags:'подсветка, сценарии', imgs:[
    'assets/portfolio-5.jpg'
  ], desc:'Рабочие зоны с ярким светом и мягкие вечера.'},

  {title:'Коммерция — Витрина', tags:'акцентный свет, витрины', imgs:[
    'assets/portfolio-6.jpg'
  ], desc:'Выделение товаров с динамическими сценами.'}
];

// portfolio modal
const modal = qs('#proj-modal');
const modalGallery = qs('#modal-gallery');
const modalDesc = qs('#modal-desc');
const projCards = qsa('.proj-card');

projCards.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const idx = Number(btn.dataset.index) || 0;
    openProject(idx);
  });
});

qsa('.modal-close').forEach(b=>{
  b.addEventListener('click', ()=>closeAllModals());
});

function openProject(i){
  const p = projects[i];
  modalGallery.innerHTML = p.imgs.map(u=>`<img src="${u}" alt="${p.title}">`).join('');
  modalDesc.innerHTML = `<h3>${p.title}</h3><p class="muted">${p.tags}</p><p>${p.desc}</p>`;
  modal.setAttribute('aria-hidden','false');
}

// close modals on backdrop click
document.addEventListener('click', (e)=>{
  if(e.target.classList.contains('modal')) closeAllModals();
});
function closeAllModals(){
  qsa('.modal').forEach(m=>m.setAttribute('aria-hidden','true'));
}

// Scenarios switcher
const scenarioMedia = qs('#scenario-media');
const scenarioInfo = qs('#scenario-info');
const scenarioBtns = qsa('.scenario-btn');

const scenarios = {
  morning:{bg:'linear-gradient(180deg,#fff1e0,#2b2a29)', temp:'3000K', bright:'60%','zones':'Кухня, столовая'},
  evening:{bg:'linear-gradient(180deg,#2b190f,#0f0e0d)', temp:'2700K', bright:'40%','zones':'Гостиная, подсветки'},
  movie:{bg:'linear-gradient(180deg,#0b0c0d,#000000)', temp:'2400K', bright:'12%','zones':'Экран, акценты'},
  guests:{bg:'linear-gradient(180deg,#f7ecd7,#241f1a)', temp:'3000K', bright:'75%','zones':'Гостиная, стол'}
};

scenarioBtns.forEach(b=>{
  b.addEventListener('click', ()=>{
    scenarioBtns.forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const key = b.dataset.scenario;
    applyScenario(key);
  });
});

function applyScenario(key){
  const s = scenarios[key];
  scenarioMedia.style.background = s.bg;
  scenarioInfo.innerHTML = `<div><strong>Темп.</strong> ${s.temp}</div><div><strong>Яркость</strong> ${s.bright}</div><div><strong>Зоны</strong> ${s.zones}</div>`;
}

// init default
applyScenario('morning');

// Simple phone mask for RU-ish +7 (___) ___-__-__
const phone = qs('#phone');
if(phone){
  phone.addEventListener('input', onPhoneInput);
  function onPhoneInput(e){
    let d = e.target.value.replace(/\D/g,'');
    if(d.startsWith('8')) d = '7'+d.slice(1);
    if(!d.startsWith('7')) d = '7'+d;
    let out = '+';
    out += d[0]||'';
    if(d.length>1) out += ' ('+ (d.slice(1,4)) ;
    if(d.length>=4) out += ') '+(d.slice(4,7));
    if(d.length>=7) out += '-'+(d.slice(7,9));
    if(d.length>=9) out += '-'+(d.slice(9,11));
    e.target.value = out;
  }
}

// Form handling
const form = qs('#lead-form');
const thanks = qs('#thanks-modal');
form && form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = new FormData(form);
  if(!form.checkValidity()){
    form.reportValidity();
    return;
  }
  // simulate send
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';
  setTimeout(()=>{
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить';
    // show thanks
    thanks.setAttribute('aria-hidden','false');
    form.reset();
  }, 900);
});

// privacy modal
qs('#privacy-link').addEventListener('click', (e)=>{
  e.preventDefault();
  qs('#privacy-modal').setAttribute('aria-hidden','false');
});

// quick anchor CTAs open appropriate areas or form
qs('#cta-get-quote').addEventListener('click', ()=>qs('#contacts').scrollIntoView({behavior:'smooth'}));
qs('#get-quote').addEventListener('click', ()=>qs('#contacts').scrollIntoView({behavior:'smooth'}));
qs('#cta-watch-projects').addEventListener('click', ()=>qs('#portfolio').scrollIntoView({behavior:'smooth'}));
qs('#watch-projects').addEventListener('click', ()=>qs('#portfolio').scrollIntoView({behavior:'smooth'}));

// accessibility: focus trap on modal (basic)
document.addEventListener('keydown', (e)=>{
  if(e.key==='Escape') closeAllModals();
});