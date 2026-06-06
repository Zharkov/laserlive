/**
 * GALLERY — лайтбокс для фото студии.
 * Клик по фото → открывает на весь экран, листание стрелками/свайпом.
 */
(function () {
  'use strict';

  const items = Array.from(document.querySelectorAll('.gallery-item[data-src], .creds-photo[data-src]'));
  if (items.length === 0) return;

  const sources = items.map((el) => el.dataset.src);
  let current = 0;

  // Создаём лайтбокс
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML =
    '<button class="lightbox-close" aria-label="Закрыть">&times;</button>' +
    '<button class="lightbox-nav prev" aria-label="Назад">&#8249;</button>' +
    '<img src="" alt="Фото студии LaserLive">' +
    '<button class="lightbox-nav next" aria-label="Вперёд">&#8250;</button>';
  document.body.appendChild(box);

  const imgEl = box.querySelector('img');
  const closeBtn = box.querySelector('.lightbox-close');
  const prevBtn = box.querySelector('.lightbox-nav.prev');
  const nextBtn = box.querySelector('.lightbox-nav.next');

  function show(i) {
    current = (i + sources.length) % sources.length;
    imgEl.src = sources[current];
  }

  function open(i) {
    show(i);
    box.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    box.classList.remove('visible');
    document.body.style.overflow = '';
  }

  items.forEach((el, i) => {
    el.addEventListener('click', () => open(i));
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
  box.addEventListener('click', (e) => { if (e.target === box) close(); });

  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('visible')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Свайпы
  let startX = 0;
  box.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].screenX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) show(current + (diff > 0 ? 1 : -1));
  }, { passive: true });
})();
