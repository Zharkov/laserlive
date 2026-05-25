/**
 * COUNTERS — анимация счётчиков при появлении в зоне видимости
 * Использует data-target атрибут с конечным числом
 */
(function () {
  'use strict';

  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length === 0) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000; // 2 секунды
    const startTime = performance.now();

    // Easing — плавное замедление в конце
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(tick);
  };

  // Запускаем только когда секция реально появилась на экране
  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((c) => observer.observe(c));
})();
