/**
 * ACTIVE-NAV — подсвечивает пункт меню той секции,
 * которая сейчас на экране
 */
(function () {
  'use strict';

  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length === 0 || navLinks.length === 0) return;

  // Карта id → пункт меню
  const linkByHash = new Map();
  navLinks.forEach((link) => {
    const hash = link.getAttribute('href');
    if (hash && hash.startsWith('#')) {
      linkByHash.set(hash.slice(1), link);
    }
  });

  const setActive = (id) => {
    navLinks.forEach((l) => l.classList.remove('active'));
    const link = linkByHash.get(id);
    if (link) link.classList.add('active');
  };

  if (!('IntersectionObserver' in window)) return;

  // Секция считается активной, когда находится в средней зоне экрана
  const observer = new IntersectionObserver(
    (entries) => {
      // Выбираем секцию, у которой intersectionRatio наибольший
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length > 0) {
        setActive(visible[0].target.id);
      }
    },
    {
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    }
  );

  sections.forEach((s) => observer.observe(s));
})();
