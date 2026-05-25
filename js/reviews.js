/**
 * REVIEWS — карусель отзывов с автопрокруткой.
 *
 * Поведение:
 *  - 3 карточки на десктопе, 2 на планшете, 1 на мобильном.
 *  - Свайпы на тач-устройствах.
 *  - Автоскролл каждые 5 секунд.
 *  - Пауза при наведении мыши.
 *  - Сброс таймера при ручном действии (клик стрелки/точки/свайп).
 */
(function () {
  'use strict';

  const AUTOPLAY_DELAY = 5000;   // период автопрокрутки, мс
  const RESUME_DELAY  = 3000;    // через сколько возобновлять после ручного действия

  const wrap = document.querySelector('.reviews-wrap');
  if (!wrap) return;

  const track     = wrap.querySelector('.reviews-track');
  const cards     = track.querySelectorAll('.review-card');
  const prevBtn   = wrap.querySelector('.reviews-arrow.prev');
  const nextBtn   = wrap.querySelector('.reviews-arrow.next');
  const dotsWrap  = wrap.querySelector('.reviews-dots');

  if (cards.length === 0) return;

  let currentIndex = 0;
  let visibleCount = 3;
  let totalPages   = 1;

  let autoTimer    = null;
  let resumeTimer  = null;
  let isPaused     = false;

  // ===== Сколько карточек видно =====
  const calcVisible = () => {
    const w = window.innerWidth;
    if (w <= 968)  return 1;
    if (w <= 1100) return 2;
    return 3;
  };

  // ===== Пересчёт метрик =====
  const updateMetrics = () => {
    visibleCount = calcVisible();
    totalPages   = Math.max(1, cards.length - visibleCount + 1);
    currentIndex = Math.min(currentIndex, totalPages - 1);
    renderDots();
    moveTo(currentIndex);
  };

  // ===== Точки =====
  const renderDots = () => {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = 'reviews-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', 'Отзыв ' + (i + 1));
      dot.addEventListener('click', () => {
        moveTo(i);
        resetAutoplay();
      });
      dotsWrap.appendChild(dot);
    }
  };

  // ===== Прокрутка =====
  const moveTo = (index) => {
    // Зацикливание: если вышли за пределы — возвращаемся к началу/концу
    if (index < 0) index = totalPages - 1;
    if (index >= totalPages) index = 0;

    currentIndex = index;

    const card = cards[0];
    const gap  = parseFloat(getComputedStyle(track).gap) || 24;
    const cardWidth = card.offsetWidth + gap;
    const offset = currentIndex * cardWidth;

    track.style.transform = 'translateX(-' + offset + 'px)';

    dotsWrap.querySelectorAll('.reviews-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
  };

  // ===== Автопрокрутка =====
  const startAutoplay = () => {
    stopAutoplay();
    if (totalPages <= 1) return;        // нечего листать
    autoTimer = setInterval(() => {
      if (!isPaused) moveTo(currentIndex + 1);
    }, AUTOPLAY_DELAY);
  };

  const stopAutoplay = () => {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  // После ручного действия — пауза, потом возобновление
  const resetAutoplay = () => {
    stopAutoplay();
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAutoplay, RESUME_DELAY);
  };

  // ===== Стрелки =====
  prevBtn?.addEventListener('click', () => {
    moveTo(currentIndex - 1);
    resetAutoplay();
  });
  nextBtn?.addEventListener('click', () => {
    moveTo(currentIndex + 1);
    resetAutoplay();
  });

  // ===== Пауза при наведении =====
  wrap.addEventListener('mouseenter', () => { isPaused = true; });
  wrap.addEventListener('mouseleave', () => { isPaused = false; });

  // Когда вкладка неактивна — тоже стоп (экономим ресурсы)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  // ===== Свайпы =====
  let touchStartX = 0;
  let touchEndX   = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    isPaused = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      moveTo(currentIndex + (diff > 0 ? 1 : -1));
    }
    isPaused = false;
    resetAutoplay();
  }, { passive: true });

  // ===== Ресайз =====
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateMetrics, 150);
  });

  // ===== Старт =====
  updateMetrics();
  startAutoplay();
})();
