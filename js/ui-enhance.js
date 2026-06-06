/**
 * UI-ENHANCEMENTS
 *  1. blur-up — картинки плавно проявляются из размытия по мере загрузки
 *  2. to-top — кнопка «наверх», появляется при прокрутке вниз
 */
(function () {
  'use strict';

  // ===== 1. Blur-up загрузка картинок =====
  // Берём все картинки с loading="lazy" (галерея, сертификат, и т.п.)
  const imgs = document.querySelectorAll('img[loading="lazy"]');

  imgs.forEach((img) => {
    img.classList.add('lazy-img');

    const reveal = () => img.classList.add('loaded');

    if (img.complete && img.naturalWidth > 0) {
      // Картинка уже в кеше — показываем сразу (но через кадр, чтобы анимация сработала)
      requestAnimationFrame(reveal);
    } else {
      img.addEventListener('load', reveal, { once: true });
      // На случай ошибки — всё равно показываем, чтоб не осталась невидимой
      img.addEventListener('error', reveal, { once: true });
    }
  });

  // ===== 2. Кнопка «наверх» =====
  const btn = document.createElement('button');
  btn.className = 'to-top';
  btn.setAttribute('aria-label', 'Наверх');
  btn.innerHTML = '&#8593;';
  document.body.appendChild(btn);

  let ticking = false;
  const SHOW_AFTER = 600; // px прокрутки

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > SHOW_AFTER);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
