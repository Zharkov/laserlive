/**
 * TOAST — всплывающее уведомление в углу.
 * Используется в форме и калькуляторе после копирования текста в буфер.
 */
(function () {
  'use strict';

  let toastEl = null;
  let hideTimer = null;

  function ensureElement() {
    if (toastEl) return toastEl;
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.innerHTML =
      '<div class="toast-title">Текст скопирован</div>' +
      '<div class="toast-desc">Открываем MAX… просто вставь сообщение в чат и отправь</div>';
    document.body.appendChild(toastEl);
    return toastEl;
  }

  window.LaserToast = {
    show(title, desc, duration) {
      const el = ensureElement();
      el.querySelector('.toast-title').textContent = title || 'Готово';
      el.querySelector('.toast-desc').textContent = desc || '';
      // следующая «строка» — чтобы анимация сработала после смены текста
      requestAnimationFrame(() => el.classList.add('visible'));

      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => el.classList.remove('visible'), duration || 4000);
    },
  };
})();
