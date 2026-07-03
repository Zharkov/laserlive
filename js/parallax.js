/**
 * PARALLAX — блобы фона двигаются с разной скоростью
 * при скролле страницы и движении мыши
 */
(function () {
  'use strict';

  // Уважаем настройку «уменьшить движение»
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const blobs = [
    { el: document.querySelector('.bg-blob-wrap.a'), scrollSpeed: 0.15, mouseFactor: 30 },
    { el: document.querySelector('.bg-blob-wrap.b'), scrollSpeed: 0.25, mouseFactor: 50 },
    { el: document.querySelector('.bg-blob-wrap.c'), scrollSpeed: 0.1,  mouseFactor: 20 },
  ].filter((b) => b.el);

  if (blobs.length === 0) return;

  let scrollY = window.scrollY;
  let mouseX = 0;
  let mouseY = 0;
  let ticking = false;

  const update = () => {
    blobs.forEach((b) => {
      const tx = mouseX * b.mouseFactor;
      const ty = mouseY * b.mouseFactor - scrollY * b.scrollSpeed;
      b.el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
    ticking = false;
  };

  const onScroll = () => {
    scrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  const onMouseMove = (e) => {
    // Нормализуем координаты от -0.5 до 0.5
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('mousemove', onMouseMove, { passive: true });
})();
