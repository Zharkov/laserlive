/**
 * CALCULATOR — клиент выбирает зоны, видит итог со скидками,
 * отправляет в WhatsApp с подробным описанием.
 *
 * Скидки: 30% на первое посещение (можно выбрать),
 *         10% за абонемент на 3 процедуры,
 *         15% за абонемент на 5 процедур.
 */
(function () {
  'use strict';

  const WHATSAPP_PHONE = '79206609470';

  // Прайс — берём цены из data-атрибутов чекбоксов в HTML
  const calc = document.getElementById('calculator');
  if (!calc) return;

  const genderButtons = calc.querySelectorAll('.calc-gender button');
  const selectedList = calc.querySelector('.calc-selected-list');
  const subtotalEl = calc.querySelector('[data-summary="subtotal"]');
  const discountEl = calc.querySelector('[data-summary="discount"]');
  const discountRow = calc.querySelector('[data-summary="discount-row"]');
  const finalEl = calc.querySelector('[data-summary="final"]');
  const ctaBtn = calc.querySelector('.calc-cta');
  const planSelect = calc.querySelector('[data-summary="plan"]');

  // ===== Переключатель пола =====
  genderButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const gender = btn.dataset.gender;
      genderButtons.forEach((b) => b.classList.toggle('active', b === btn));
      calc.querySelectorAll('[data-gender-block]').forEach((block) => {
        block.style.display = block.dataset.genderBlock === gender ? 'block' : 'none';
      });
      update();
    });
  });

  // ===== Чекбоксы зон =====
  calc.querySelectorAll('input[type="checkbox"][data-zone]').forEach((cb) => {
    cb.addEventListener('change', update);
  });

  // ===== Тариф (одиночная процедура / абонемент) =====
  if (planSelect) {
    planSelect.querySelectorAll('button').forEach((b) => {
      b.addEventListener('click', () => {
        planSelect.querySelectorAll('button').forEach((x) => x.classList.toggle('active', x === b));
        update();
      });
    });
  }

  // ===== Пересчёт =====
  function update() {
    const checked = Array.from(
      calc.querySelectorAll('input[type="checkbox"][data-zone]:checked')
    ).filter((cb) => {
      // Берём только из видимого блока (по полу)
      const block = cb.closest('[data-gender-block]');
      return !block || block.style.display !== 'none';
    });

    // Список выбранных
    selectedList.innerHTML = '';
    if (checked.length === 0) {
      selectedList.innerHTML = '<div class="calc-empty">Выберите зоны слева, чтобы увидеть итог</div>';
    } else {
      checked.forEach((cb) => {
        const item = document.createElement('div');
        item.className = 'calc-selected-item';
        item.innerHTML = `
          <span class="calc-selected-name">${cb.dataset.zone}</span>
          <span class="calc-selected-price">${cb.dataset.price} ₽</span>
        `;
        selectedList.appendChild(item);
      });
    }

    const subtotal = checked.reduce((s, cb) => s + parseInt(cb.dataset.price, 10), 0);

    // Скидка по выбранному тарифу
    const activePlan = planSelect?.querySelector('button.active');
    const discountPercent = activePlan ? parseInt(activePlan.dataset.discount, 10) : 0;
    const discountLabel = activePlan ? activePlan.dataset.label : '';

    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    const final = subtotal - discountAmount;

    subtotalEl.textContent = subtotal.toLocaleString('ru-RU') + ' ₽';

    if (discountAmount > 0 && checked.length > 0) {
      discountRow.style.display = 'flex';
      discountRow.querySelector('.calc-total-label').textContent =
        `Скидка ${discountPercent}% (${discountLabel})`;
      discountEl.textContent = '−' + discountAmount.toLocaleString('ru-RU') + ' ₽';
    } else {
      discountRow.style.display = 'none';
    }

    finalEl.textContent = final.toLocaleString('ru-RU') + ' ₽';

    ctaBtn.disabled = checked.length === 0;
  }

  // ===== Отправка в WhatsApp =====
  ctaBtn.addEventListener('click', () => {
    const checked = Array.from(
      calc.querySelectorAll('input[type="checkbox"][data-zone]:checked')
    ).filter((cb) => {
      const block = cb.closest('[data-gender-block]');
      return !block || block.style.display !== 'none';
    });

    if (checked.length === 0) return;

    const gender = calc.querySelector('.calc-gender button.active').dataset.gender;
    const genderLabel = gender === 'women' ? 'Женская' : 'Мужская';

    const subtotal = checked.reduce((s, cb) => s + parseInt(cb.dataset.price, 10), 0);
    const activePlan = planSelect?.querySelector('button.active');
    const discountPercent = activePlan ? parseInt(activePlan.dataset.discount, 10) : 0;
    const planLabel = activePlan?.dataset.label || 'обычная цена';

    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    const final = subtotal - discountAmount;

    let text = `Здравствуйте! Хочу записаться на лазерную эпиляцию.\n\n`;
    text += `*${genderLabel} эпиляция*\n`;
    text += `Выбранные зоны:\n`;
    checked.forEach((cb) => {
      text += `• ${cb.dataset.zone} — ${cb.dataset.price} ₽\n`;
    });
    text += `\nТариф: ${planLabel}\n`;
    text += `Сумма: ${subtotal} ₽\n`;
    if (discountAmount > 0) {
      text += `Скидка ${discountPercent}%: −${discountAmount} ₽\n`;
    }
    text += `*Итого: ${final} ₽*\n\nКогда можно записаться?`;

    // Конфетти на радость
    if (window.LaserConfetti) {
      const rect = ctaBtn.getBoundingClientRect();
      window.LaserConfetti.fire(rect.left + rect.width / 2, rect.top + rect.height / 2, 80);
    }

    setTimeout(() => {
      window.open(
        `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`,
        '_blank',
        'noopener'
      );
    }, 500);
  });

  // Первичный рендер
  update();
})();
