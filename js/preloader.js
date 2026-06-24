/**
 * PRELOADER — заставка с логотипом при первом заходе.
 * Прячется когда страница загружена + минимум 800ms показа,
 * чтобы анимация не «мигала».
 */
(function () {
  'use strict';

  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  document.body.classList.add('loading');

  const MIN_TIME = 800;
  const startTime = performance.now();
  let called = false;

  const hide = () => {
    if (called) return;
    called = true;

    const elapsed = performance.now() - startTime;
    const wait = Math.max(0, MIN_TIME - elapsed);

    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.remove('loading');
      setTimeout(() => preloader.remove(), 800);
    }, wait);
  };

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide);
    setTimeout(hide, 4000);
  }
})();
