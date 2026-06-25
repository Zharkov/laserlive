(function () {
  'use strict';

  const eyebrow = document.querySelector('.hero .hero-eyebrow');
  if (!eyebrow) return;

  let clickCount = 0;
  let clickTimer = null;

  eyebrow.style.cursor = 'pointer';

  eyebrow.addEventListener('click', () => {
    clickCount++;
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 600);
    if (clickCount >= 3) {
      clickCount = 0;
      clearTimeout(clickTimer);
      showCat();
    }
  });

  function showCat() {
    if (document.querySelector('.easter-cat')) return;

    const el = document.createElement('div');
    el.className = 'easter-cat';
    el.innerHTML =
      '<div class="easter-cat-bubble">Мяу-мяу!</div>' +
      '<div class="easter-cat-emoji">😸</div>';
    document.body.appendChild(el);

    // Конфетти вдоль всего пути
    const confettiInterval = setInterval(() => {
      const rect = el.getBoundingClientRect();
      if (window.LaserConfetti) {
        window.LaserConfetti.fire(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
      }
    }, 320);

    el.addEventListener('animationend', () => {
      clearInterval(confettiInterval);
      el.remove();
    });
  }
})();
