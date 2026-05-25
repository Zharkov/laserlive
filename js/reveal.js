/**
 * REVEAL — анимация появления секций при скролле
 */
(function () {
  'use strict';

  const elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;

  // Если IntersectionObserver не поддерживается — просто показываем всё
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((el) => observer.observe(el));
})();
