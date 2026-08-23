
(() => {
  const p = document.querySelector('.planet');
  const root = document.documentElement;
  if (!p || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('pointermove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    p.style.marginRight = `${x}px`;
    p.style.marginTop = `${y}px`;
  }, { passive:true });
})();
