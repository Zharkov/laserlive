/**
 * REVIEWS — карусель отзывов.
 * Адаптируется: 3 карточки на десктопе, 2 на планшете, 1 на мобильном.
 * Поддерживает свайпы на тач-устройствах.
 */
(function () {
  'use strict';

  const wrap = document.querySelector('.reviews-wrap');
  if (!wrap) return;

  const track = wrap.querySelector('.reviews-track');
  const cards = track.querySelectorAll('.review-card');
  const prevBtn = wrap.querySelector('.reviews-arrow.prev');
  const nextBtn = wrap.querySelector('.reviews-arrow.next');
  const dotsWrap = wrap.querySelector('.reviews-dots');

  if (cards.length === 0) return;

  let currentIndex = 0;
  let visibleCount = 3;
  let totalPages = 1;

  // ===== Определяем сколько карточек видно =====
  const calcVisible = () => {
    const w = window.innerWidth;
    if (w <= 968) return 1;
    if (w <= 1100) return 2;
    return 3;
  };

  const updateMetrics = () => {
    visibleCount = calcVisible();
    totalPages = Math.max(1, cards.length - visibleCount + 1);
    currentIndex = Math.min(currentIndex, totalPages - 1);
    renderDots();
    moveTo(currentIndex);
  };

  // ===== Точки-индикаторы =====
  const renderDots = () => {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = 'reviews-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Отзыв ${i + 1}`);
      dot.addEventListener('click', () => moveTo(i));
      dotsWrap.appendChild(dot);
    }
  };

  // ===== Прокрутка =====
  const moveTo = (index) => {
    currentIndex = Math.max(0, Math.min(index, totalPages - 1));

    const card = cards[0];
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    const cardWidth = card.offsetWidth + gap;
    const offset = currentIndex * cardWidth;

    track.style.transform = `translateX(-${offset}px)`;

    // Обновить точки
    dotsWrap.querySelectorAll('.reviews-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });

    // Обновить стрелки
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= totalPages - 1;
  };

  prevBtn?.addEventListener('click', () => moveTo(currentIndex - 1));
  nextBtn?.addEventListener('click', () => moveTo(currentIndex + 1));

  // ===== Свайпы на мобильном =====
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  track.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        moveTo(currentIndex + (diff > 0 ? 1 : -1));
      }
    },
    { passive: true }
  );

  // ===== Реакция на ресайз окна =====
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateMetrics, 150);
  });

  // ===== Старт =====
  updateMetrics();
})();
