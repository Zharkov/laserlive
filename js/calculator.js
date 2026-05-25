/**
 * CALCULATOR — плитки-карточки с иконками.
 * Клиент кликает по плиткам → видит итог справа → отправляет в WhatsApp.
 */
(function () {
  'use strict';

  const WHATSAPP_PHONE = '79206609470';

  const root = document.getElementById('calculator');
  if (!root) return;

  const genderButtons = root.querySelectorAll('[data-role="gender"] button');
  const genderBlocks = root.querySelectorAll('[data-gender-block]');
  const planButtons = root.querySelectorAll('[data-role="plan"] button');
  const listEl = document.getElementById('calcSelectedList');
  const subtotalEl = root.querySelector('[data-summary="subtotal"]');
  const discountEl = root.querySelector('[data-summary="discount"]');
  const discountRow = root.querySelector('[data-summary="discount-row"]');
  const finalEl = root.querySelector('[data-summary="final"]');
  const ctaBtn = root.querySelector('.calc-cta');

  let currentGender = 'women';

  // ===== Переключатель пола =====
  genderButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      genderButtons.forEach((b) => b.classList.toggle('active', b === btn));
      currentGender = btn.dataset.gender;
      genderBlocks.forEach((block) => {
        block.style.display = block.dataset.genderBlock === currentGender ? 'block' : 'none';
      });
      update();
    });
  });

  // ===== Тариф =====
  planButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      planButtons.forEach((b) => b.classList.toggle('active', b === btn));
      update();
    });
  });

  // ===== Чекбоксы =====
  root.querySelectorAll('input[type="checkbox"][data-zone]').forEach((cb) => {
    cb.addEventListener('change', update);
  });

  // ===== Пересчёт =====
  function update() {
    const checked = Array.from(
      root.querySelectorAll('input[type="checkbox"][data-zone]:checked')
    ).filter((cb) => {
      const block = cb.closest('[data-gender-block]');
      return !block || block.style.display !== 'none';
    });

    listEl.innerHTML = '';
    if (checked.length === 0) {
      listEl.innerHTML = '<div class="calc-empty">Выбери зоны слева</div>';
    } else {
      checked.forEach((cb) => {
        const row = document.createElement('div');
        row.className = 'calc-selected-item';
        const priceFmt = parseInt(cb.dataset.price, 10).toLocaleString('ru-RU');
        row.innerHTML =
          '<span class="calc-selected-name">' + cb.dataset.zone + '</span>' +
          '<span class="calc-selected-price">' + priceFmt + ' ₽</span>' +
          '<button class="calc-selected-remove" aria-label="Убрать">×</button>';
        row.querySelector('.calc-selected-remove').addEventListener('click', () => {
          cb.checked = false;
          update();
        });
        listEl.appendChild(row);
      });
    }

    const subtotal = checked.reduce((s, cb) => s + parseInt(cb.dataset.price, 10), 0);
    const activePlan = root.querySelector('[data-role="plan"] button.active');
    const discountPercent = activePlan ? parseInt(activePlan.dataset.discount, 10) : 0;
    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    const final = subtotal - discountAmount;

    subtotalEl.textContent = subtotal.toLocaleString('ru-RU') + ' ₽';

    if (discountAmount > 0 && checked.length > 0) {
      discountRow.style.display = 'flex';
      discountRow.querySelector('.calc-total-label').textContent = 'Скидка ' + discountPercent + '%';
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
      root.querySelectorAll('input[type="checkbox"][data-zone]:checked')
    ).filter((cb) => {
      const block = cb.closest('[data-gender-block]');
      return !block || block.style.display !== 'none';
    });

    if (checked.length === 0) return;

    const subtotal = checked.reduce((s, cb) => s + parseInt(cb.dataset.price, 10), 0);
    const activePlan = root.querySelector('[data-role="plan"] button.active');
    const discountPercent = activePlan ? parseInt(activePlan.dataset.discount, 10) : 0;
    const planLabel = (activePlan && activePlan.dataset.label) || 'обычная цена';
    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    const final = subtotal - discountAmount;
    const genderLabel = currentGender === 'women' ? 'Женская' : 'Мужская';

    let text = 'Здравствуйте! Хочу записаться на лазерную эпиляцию.\n\n';
    text += '*' + genderLabel + ' эпиляция*\n';
    text += 'Выбранные зоны:\n';
    checked.forEach((cb) => {
      text += '• ' + cb.dataset.zone + ' — ' + cb.dataset.price + ' ₽\n';
    });
    text += '\nТариф: ' + planLabel + '\n';
    text += 'Сумма: ' + subtotal + ' ₽\n';
    if (discountAmount > 0) {
      text += 'Скидка ' + discountPercent + '%: −' + discountAmount + ' ₽\n';
    }
    text += '*Итого: ' + final + ' ₽*\n\nКогда можно записаться?';

    if (window.LaserConfetti) {
      const rect = ctaBtn.getBoundingClientRect();
      window.LaserConfetti.fire(rect.left + rect.width / 2, rect.top + rect.height / 2, 80);
    }

    setTimeout(() => {
      window.open(
        'https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(text),
        '_blank',
        'noopener'
      );
    }, 500);
  });

  update();
})();
