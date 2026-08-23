
(() => {
  const canvas = document.getElementById('spaceCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let w = 0, h = 0, dpr = 1;
  let stars = [], dust = [], shooters = [];
  let last = performance.now();
  let time = 0;

  const rand = (a,b) => a + Math.random()*(b-a);

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w*dpr);
    canvas.height = Math.floor(h*dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);

    const starCount = Math.max(240, Math.floor(w*h/5500));
    stars = Array.from({length:starCount},()=>({
      x:Math.random()*w,
      y:Math.random()*h,
      z:rand(.25,1),
      r:rand(.35,1.65),
      a:rand(.35,1),
      tw:rand(.7,2.4)
    }));

    dust = Array.from({length:80},()=>({
      x:Math.random()*w,
      y:Math.random()*h,
      vx:rand(-.05,.05),
      vy:rand(-.03,.03),
      r:rand(8,28),
      a:rand(.015,.055)
    }));
  }

  function background(){
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#020711');
    g.addColorStop(.42,'#071326');
    g.addColorStop(1,'#08162c');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    // Blue nebula
    let n = ctx.createRadialGradient(w*.82,h*.16,0,w*.82,h*.16,Math.max(w,h)*.46);
    n.addColorStop(0,'rgba(78,134,255,.24)');
    n.addColorStop(.42,'rgba(81,125,245,.10)');
    n.addColorStop(1,'rgba(80,120,255,0)');
    ctx.fillStyle=n; ctx.fillRect(0,0,w,h);

    // Violet nebula slowly drifting
    const nx = w*.16 + Math.sin(time*.00009)*70;
    const ny = h*.72 + Math.cos(time*.00007)*55;
    n = ctx.createRadialGradient(nx,ny,0,nx,ny,Math.max(w,h)*.38);
    n.addColorStop(0,'rgba(157,92,255,.16)');
    n.addColorStop(.48,'rgba(118,91,255,.07)');
    n.addColorStop(1,'rgba(110,90,255,0)');
    ctx.fillStyle=n; ctx.fillRect(0,0,w,h);

    // Cyan cloud
    const cx = w*.7 + Math.sin(time*.000065)*90;
    const cy = h*.84 + Math.cos(time*.000075)*45;
    n = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(w,h)*.32);
    n.addColorStop(0,'rgba(67,207,255,.12)');
    n.addColorStop(1,'rgba(67,207,255,0)');
    ctx.fillStyle=n; ctx.fillRect(0,0,w,h);
  }

  function drawDust(dt){
    dust.forEach(d=>{
      d.x += d.vx*dt;
      d.y += d.vy*dt;
      if(d.x < -30) d.x = w+30;
      if(d.x > w+30) d.x = -30;
      if(d.y < -30) d.y = h+30;
      if(d.y > h+30) d.y = -30;
      const grd = ctx.createRadialGradient(d.x,d.y,0,d.x,d.y,d.r);
      grd.addColorStop(0,`rgba(154,187,255,${d.a})`);
      grd.addColorStop(1,'rgba(154,187,255,0)');
      ctx.fillStyle=grd;
      ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fill();
    });
  }

  function drawStars(dt){
    stars.forEach(s=>{
      // obvious slow drift: nearer stars move faster
      s.x -= (0.012 + s.z*0.035) * dt;
      s.y += (0.003 + s.z*0.008) * dt;

      if(s.x < -4){ s.x = w+4; s.y=Math.random()*h; }
      if(s.y > h+4){ s.y=-4; s.x=Math.random()*w; }

      const twinkle = .72 + .28*Math.sin(time*.0018*s.tw + s.x*.015);
      ctx.fillStyle = `rgba(245,250,255,${s.a*twinkle})`;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r*(.75+s.z*.5),0,Math.PI*2);
      ctx.fill();
    });
  }

  function drawPlanet(){
    const px = w*.78 + Math.sin(time*.00018)*26;
    const py = h*.20 + Math.cos(time*.00016)*18;
    const r = Math.max(84, Math.min(128, w*.085));

    const glow = ctx.createRadialGradient(px,py,0,px,py,r*2.5);
    glow.addColorStop(0,'rgba(138,179,255,.24)');
    glow.addColorStop(1,'rgba(138,179,255,0)');
    ctx.fillStyle=glow;
    ctx.beginPath(); ctx.arc(px,py,r*2.5,0,Math.PI*2); ctx.fill();

    const pg = ctx.createRadialGradient(px-r*.28,py-r*.28,r*.12,px,py,r);
    pg.addColorStop(0,'#fff3d7');
    pg.addColorStop(.28,'#cfe2ff');
    pg.addColorStop(.62,'#89a9da');
    pg.addColorStop(1,'#4e6d9f');
    ctx.fillStyle=pg;
    ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2); ctx.fill();

    ctx.save();
    ctx.translate(px,py);
    ctx.rotate(-0.14 + Math.sin(time*.00008)*.025);
    ctx.strokeStyle='rgba(240,247,255,.72)';
    ctx.lineWidth=6;
    ctx.beginPath(); ctx.ellipse(0,0,r*1.55,r*.34,0,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle='rgba(204,224,255,.34)';
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.ellipse(0,0,r*1.78,r*.42,0,0,Math.PI*2); ctx.stroke();
    ctx.restore();
  }

  function maybeShooter(){
    if(shooters.length < 2 && Math.random() < 0.0028){
      shooters.push({
        x:rand(w*.15,w*.85),
        y:rand(0,h*.35),
        vx:rand(-.58,-.42),
        vy:rand(.28,.42),
        life:0,
        max:rand(850,1300)
      });
    }
  }

  function drawShooters(dt){
    maybeShooter();
    shooters.forEach(s=>{
      s.life += dt;
      s.x += s.vx*dt;
      s.y += s.vy*dt;

      const p = Math.max(0,1-s.life/s.max);
      ctx.strokeStyle=`rgba(225,241,255,${p*.78})`;
      ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(s.x,s.y);
      ctx.lineTo(s.x - s.vx*120, s.y - s.vy*120);
      ctx.stroke();

      ctx.fillStyle=`rgba(255,255,255,${p})`;
      ctx.beginPath(); ctx.arc(s.x,s.y,1.7,0,Math.PI*2); ctx.fill();
    });
    shooters = shooters.filter(s=>s.life<s.max && s.x>-150 && s.y<h+150);
  }

  function frame(now){
    const dt = Math.min(32, now-last);
    last = now;
    time = now;

    background();
    drawDust(dt);
    drawStars(dt);
    drawPlanet();
    drawShooters(dt);

    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);
})();
