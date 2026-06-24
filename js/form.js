/**
 * FORM — обработка формы заявки.
 * Отправляет данные в Formspree → приходит на почту студии.
 * При успехе показывает экран благодарности с конфетти.
 */
(function () {
  'use strict';

  const { FORMSPREE_URL, escapeHtml, applyPhoneMask } = window.LaserUtils;

  const form = document.getElementById('contactForm');
  if (!form) return;

  const card = form.closest('.contact-card');

  const phoneInput = form.querySelector('input[name="phone"]');
  if (phoneInput) applyPhoneMask(phoneInput);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    const digits = phone.replace(/\D/g, '');
    if (!name || digits.length < 10) {
      alert('Пожалуйста, укажите имя и телефон');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Отправляем…';

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          message: message || '(не указано)',
          _subject: 'Новая заявка с сайта LaserLive — ' + name,
          source: 'Форма «Записаться онлайн»',
        }),
      });

      if (!response.ok) throw new Error('Server error: ' + response.status);

      showSuccess(card, name);

      if (window.LaserConfetti && card) {
        const rect = card.getBoundingClientRect();
        window.LaserConfetti.fire(
          rect.left + rect.width / 2,
          rect.top + rect.height / 3,
          120
        );
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      if (window.LaserToast) {
        window.LaserToast.show(
          'Ой, не получилось отправить',
          'Проверь интернет или просто позвони нам — +7 (996) 629-24-10',
          7000
        );
      } else {
        alert('Ошибка отправки. Позвоните нам: +7 (996) 629-24-10');
      }
    }
  });

  function showSuccess(container, name) {
    if (!container) return;
    container.innerHTML =
      '<div class="form-success">' +
        '<div class="form-success-icon">' +
          '<svg viewBox="0 0 60 60" width="60" height="60" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="30" cy="30" r="26"/>' +
            '<path d="M18 30 L26 38 L42 22"/>' +
          '</svg>' +
        '</div>' +
        '<h3 class="form-success-title">Спасибо, ' + escapeHtml(name) + '!</h3>' +
        '<p class="form-success-text">Заявка принята. Перезвоним в течение 15 минут на указанный номер.</p>' +
        '<p class="form-success-hint">А если торопишься — позвони сама: <a href="tel:+79966292410">+7 (996) 629-24-10</a></p>' +
      '</div>';
  }
})();
