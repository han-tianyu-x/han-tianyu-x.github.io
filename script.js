
const root=document.documentElement;
window.addEventListener('pointermove',e=>{
  root.style.setProperty('--mx',`${e.clientX}px`);
  root.style.setProperty('--my',`${e.clientY}px`);
});

document.querySelectorAll('[data-magnetic]').forEach(el=>{
  el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect();
    const x=e.clientX-r.left-r.width/2;
    const y=e.clientY-r.top-r.height/2;
    el.style.transform=`translate(${x*.04}px,${y*.04}px)`;
  });
  el.addEventListener('pointerleave',()=>el.style.transform='');
});

const nav=document.querySelector('.nav');
window.addEventListener('scroll',()=>{
  if(nav) nav.classList.toggle('scrolled', window.scrollY>16);
});

/* simple reveal */
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

/* Full-screen animated universe background */
const heroCanvas=document.querySelector('#heroSpace');
if(heroCanvas){
  const ctx=heroCanvas.getContext('2d');
  let w=0,h=0,dpr=1,t=0,pointer={x:null,y:null};

  const stars=Array.from({length:230},()=>({
    x:Math.random(), y:Math.random(),
    r:Math.random()*1.8+.2,
    a:Math.random()*.8+.2,
    tw:Math.random()*0.03+0.004
  }));

  const dust=Array.from({length:90},()=>({
    x:Math.random(), y:Math.random(),
    r:Math.random()*1.4+.5,
    vx:(Math.random()-.5)*0.00004,
    vy:(Math.random()-.5)*0.00004
  }));

  function resize(){
    const r=heroCanvas.getBoundingClientRect();
    dpr=Math.min(window.devicePixelRatio||1,2);
    w=r.width; h=r.height;
    heroCanvas.width=w*dpr; heroCanvas.height=h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function drawBackground(){
    const g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#03060b');
    g.addColorStop(.38,'#08101a');
    g.addColorStop(.72,'#0b121b');
    g.addColorStop(1,'#05070a');
    ctx.fillStyle=g;
    ctx.fillRect(0,0,w,h);

    const neb1=ctx.createRadialGradient(w*.27,h*.18,0,w*.27,h*.18,w*.42);
    neb1.addColorStop(0,'rgba(95,132,255,.17)');
    neb1.addColorStop(.45,'rgba(95,132,255,.06)');
    neb1.addColorStop(1,'rgba(95,132,255,0)');
    ctx.fillStyle=neb1; ctx.fillRect(0,0,w,h);

    const neb2=ctx.createRadialGradient(w*.75,h*.26,0,w*.75,h*.26,w*.36);
    neb2.addColorStop(0,'rgba(214,178,106,.10)');
    neb2.addColorStop(.46,'rgba(214,178,106,.05)');
    neb2.addColorStop(1,'rgba(214,178,106,0)');
    ctx.fillStyle=neb2; ctx.fillRect(0,0,w,h);

    const neb3=ctx.createRadialGradient(w*.52,h*.62,0,w*.52,h*.62,w*.46);
    neb3.addColorStop(0,'rgba(110,166,255,.06)');
    neb3.addColorStop(1,'rgba(110,166,255,0)');
    ctx.fillStyle=neb3; ctx.fillRect(0,0,w,h);
  }

  function drawStars(){
    stars.forEach(s=>{
      const alpha=s.a*(0.72+0.28*Math.sin(t*s.tw*18));
      ctx.fillStyle=`rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x*w,s.y*h,s.r,0,Math.PI*2);
      ctx.fill();
    });
  }

  function drawDust(){
    dust.forEach(d=>{
      d.x+=d.vx; d.y+=d.vy;
      if(d.x<0)d.x=1;if(d.x>1)d.x=0;if(d.y<0)d.y=1;if(d.y>1)d.y=0;
      ctx.fillStyle='rgba(170,190,220,.08)';
      ctx.beginPath();
      ctx.arc(d.x*w,d.y*h,d.r,0,Math.PI*2);
      ctx.fill();
    });
  }

  function drawPlanet(cx,cy,r,mainColor){
    const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,r*2.8);
    glow.addColorStop(0,'rgba(100,145,255,.18)');
    glow.addColorStop(.42,'rgba(100,145,255,.06)');
    glow.addColorStop(1,'rgba(100,145,255,0)');
    ctx.fillStyle=glow;
    ctx.beginPath(); ctx.arc(cx,cy,r*2.8,0,Math.PI*2); ctx.fill();

    const g=ctx.createRadialGradient(cx-r*.3,cy-r*.38,r*.12,cx,cy,r);
    g.addColorStop(0,'rgba(255,255,255,.96)');
    g.addColorStop(.2,mainColor);
    g.addColorStop(1,'rgba(18,16,12,1)');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();

    ctx.fillStyle='rgba(0,0,0,.34)';
    ctx.beginPath(); ctx.arc(cx+r*.28,cy+r*.05,r*.92,-1.2,1.18); ctx.fill();
  }

  function drawSun(cx,cy,r){
    const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,r*4.4);
    glow.addColorStop(0,'rgba(255,230,165,.85)');
    glow.addColorStop(.16,'rgba(255,190,95,.42)');
    glow.addColorStop(.38,'rgba(255,180,90,.13)');
    glow.addColorStop(1,'rgba(255,180,90,0)');
    ctx.fillStyle=glow;
    ctx.beginPath(); ctx.arc(cx,cy,r*4.4,0,Math.PI*2); ctx.fill();

    const core=ctx.createRadialGradient(cx-r*.2,cy-r*.2,r*.08,cx,cy,r);
    core.addColorStop(0,'rgba(255,255,245,1)');
    core.addColorStop(.26,'rgba(255,230,160,1)');
    core.addColorStop(1,'rgba(255,140,45,1)');
    ctx.fillStyle=core;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  }

  function drawOrbitRings(px,py){
    ctx.strokeStyle='rgba(255,255,255,.12)';
    ctx.lineWidth=1;
    for(let i=1;i<=3;i++){
      ctx.beginPath();
      ctx.ellipse(px,py,120+60*i,34+14*i,0,0,Math.PI*2);
      ctx.stroke();
    }
  }

  function frame(){
    t+=0.65;
    drawBackground();
    drawDust();
    drawStars();

    const offX=pointer.x==null?0:(pointer.x-w/2)/w*18;
    const offY=pointer.y==null?0:(pointer.y-h/2)/h*14;

    const sx1 = w*0.76 + Math.sin(t*0.008)*20 + offX*.2;
    const sy1 = h*0.22 + Math.cos(t*0.006)*10 + offY*.15;
    const sx2 = w*0.62 + Math.cos(t*0.007+1.6)*26 + offX*.13;
    const sy2 = h*0.16 + Math.sin(t*0.009+1.6)*15 + offY*.1;
    const sx3 = w*0.84 + Math.sin(t*0.006+2.8)*18 + offX*.18;
    const sy3 = h*0.32 + Math.cos(t*0.008+2.8)*12 + offY*.1;

    drawSun(sx2,sy2,22);
    drawSun(sx3,sy3,28);
    drawSun(sx1,sy1,38);

    const px = w*0.36 + Math.sin(t*0.0035)*12 - offX*.08;
    const py = h*0.64 + Math.cos(t*0.0043)*10 - offY*.06;
    drawOrbitRings(px,py);
    drawPlanet(px,py,88,'rgba(71,93,128,1)');
    drawPlanet(px+168, py-102, 23,'rgba(184,137,82,1)');

    requestAnimationFrame(frame);
  }

  heroCanvas.addEventListener('pointermove',e=>{
    const r=heroCanvas.getBoundingClientRect();
    pointer.x=e.clientX-r.left; pointer.y=e.clientY-r.top;
  });
  heroCanvas.addEventListener('pointerleave',()=>pointer={x:null,y:null});
  window.addEventListener('resize',resize);
  resize(); frame();
}

/* command palette */
const overlay=document.querySelector('.command-overlay');
const input=document.querySelector('.command input');
const items=[...document.querySelectorAll('.command-item')];

function openCommand(){
  if(!overlay) return;
  overlay.classList.add('open');
  if(input){
    input.value='';
    items.forEach(i=>i.style.display='flex');
    setTimeout(()=>input.focus(),10);
  }
}
function closeCommand(){ if(overlay) overlay.classList.remove('open'); }

document.querySelectorAll('[data-command-open]').forEach(btn=>btn.addEventListener('click',openCommand));
if(overlay){
  overlay.addEventListener('click',e=>{ if(e.target===overlay) closeCommand(); });
}
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){
    e.preventDefault(); openCommand();
  }
  if(e.key==='Escape') closeCommand();
  if(e.key==='/' && document.activeElement?.tagName!=='INPUT'){
    e.preventDefault(); openCommand();
  }
});
if(input){
  input.addEventListener('input',()=>{
    const q=input.value.toLowerCase().trim();
    items.forEach(i=>{
      i.style.display=i.innerText.toLowerCase().includes(q)?'flex':'none';
    });
  });
}
items.forEach(i=>i.addEventListener('click',()=>{
  if(i.dataset.href) window.location.href=i.dataset.href;
}));

document.querySelectorAll('[data-copy]').forEach(btn=>{
  btn.addEventListener('click', async ()=>{
    const text=document.querySelector(btn.dataset.copy)?.innerText || '';
    try{
      await navigator.clipboard.writeText(text);
      const old=btn.textContent;
      btn.textContent='Copied';
      setTimeout(()=>btn.textContent=old,1200);
    }catch{
      btn.textContent='Copy failed';
    }
  });
});
