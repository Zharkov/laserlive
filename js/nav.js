/**
 * NAV — мобильное меню и эффект тени при скролле
 */
(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const toggle = document.getElementById('mobileToggle');
  const links = document.getElementById('navLinks');

  // Переключение мобильного меню
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });

    // Закрываем меню при клике по ссылке
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Тень навигации при скролле
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
