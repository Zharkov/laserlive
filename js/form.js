/**
 * FORM — обработка формы заявки.
 * Открывает WhatsApp с готовым сообщением.
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

    const text =
      `Здравствуйте! Меня зовут ${name}, телефон ${phone}.` +
      (message ? ` ${message}` : '') +
      ' Хочу записаться на процедуру.';

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  });
})();
