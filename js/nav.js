/**
 * NAV — мобильное меню и эффект тени при скролле
 */
(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const toggle = document.getElementById('mobileToggle');
  const links = document.getElementById('navLinks');

  const closeMenu = () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Закрываем меню при клике по ссылке
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', closeMenu);
    });

    // Закрываем при клике вне меню
    document.addEventListener('click', (e) => {
      if (links.classList.contains('open') && !nav.contains(e.target)) {
        closeMenu();
      }
    });

    // Закрываем по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
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
