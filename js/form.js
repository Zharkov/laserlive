/**
 * FORM — обработка формы заявки.
 * При успешной отправке: запускает конфетти и открывает WhatsApp
 * с готовым сообщением.
 */
(function () {
  'use strict';

  // Номер для связи — меняй здесь
  const WHATSAPP_PHONE = '79206609470';

  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    if (!name || !phone) {
      alert('Пожалуйста, укажите имя и телефон');
      return;
    }

    // Конфетти из координат кнопки отправки
    if (window.LaserConfetti) {
      const button = form.querySelector('button[type="submit"]');
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      window.LaserConfetti.fire(x, y, 100);
    }

    const text =
      `Здравствуйте! Меня зовут ${name}, телефон ${phone}.` +
      (message ? ` ${message}` : '') +
      ' Хочу записаться на процедуру.';

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;

    // Небольшая задержка чтобы пользователь увидел конфетти
    setTimeout(() => {
      window.open(url, '_blank', 'noopener');
    }, 600);
  });
})();
