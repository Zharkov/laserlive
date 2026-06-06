/**
 * CALCULATOR — плитки-карточки с иконками.
 * Клиент кликает по плиткам → видит итог справа → отправляется в MAX.
 */
(function () {
  'use strict';

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
  const planDescEl = document.getElementById('calcPlanDesc');
  planButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      planButtons.forEach((b) => b.classList.toggle('active', b === btn));
      if (planDescEl && btn.dataset.desc) {
        planDescEl.textContent = btn.dataset.desc;
      }
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

  // ===== Отправка заявки с расчётом =====
  const FORMSPREE_URL = 'https://formspree.io/f/mredyepk';

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

    // Формируем человекочитаемый текст для письма
    let body = genderLabel + ' эпиляция.\n\n';
    body += 'Выбранные зоны:\n';
    checked.forEach((cb) => {
      body += '• ' + cb.dataset.zone + ' — ' + cb.dataset.price + ' ₽\n';
    });
    body += '\nТариф: ' + planLabel + '\n';
    body += 'Сумма без скидки: ' + subtotal + ' ₽\n';
    if (discountAmount > 0) {
      body += 'Скидка ' + discountPercent + '%: −' + discountAmount + ' ₽\n';
    }
    body += 'ИТОГО: ' + final + ' ₽';

    openCalcModal({
      summary: body,
      finalPrice: final,
      gender: genderLabel,
      zones: checked.map((cb) => cb.dataset.zone),
      plan: planLabel,
    });
  });

  // ===== Модалка с формой контактов =====
  function openCalcModal(data) {
    const modal = document.createElement('div');
    modal.className = 'calc-modal';
    modal.innerHTML =
      '<div class="calc-modal-backdrop"></div>' +
      '<div class="calc-modal-card">' +
        '<button class="calc-modal-close" aria-label="Закрыть">×</button>' +
        '<div class="calc-modal-header">' +
          '<div class="calc-modal-label">записаться по расчёту</div>' +
          '<h3 class="calc-modal-title">Итого: <em>' + data.finalPrice.toLocaleString('ru-RU') + ' ₽</em></h3>' +
          '<p class="calc-modal-sub">Оставь имя и телефон — перезвоним за 15 минут и согласуем удобное время</p>' +
        '</div>' +
        '<form class="calc-modal-form" novalidate>' +
          '<input type="text" name="name" placeholder="Как тебя зовут?" required>' +
          '<input type="tel" name="phone" placeholder="Телефон для связи" required>' +
          '<button type="submit">Отправить заявку</button>' +
          '<p class="calc-modal-hint">Перезвоним в течение 15 минут</p>' +
        '</form>' +
      '</div>';
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.classList.add('visible'));

    const closeModal = () => {
      modal.classList.remove('visible');
      document.body.style.overflow = '';
      setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.calc-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.calc-modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', esc);
      }
    });

    const form = modal.querySelector('.calc-modal-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      if (!name || !phone) {
        alert('Укажи имя и телефон');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем…';

      try {
        const response = await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            calculation: data.summary,
            final_price: data.finalPrice + ' ₽',
            _subject: 'Заявка с калькулятора — ' + name + ' (' + data.finalPrice + ' ₽)',
            source: 'Калькулятор стоимости',
          }),
        });
        if (!response.ok) throw new Error('Server error');

        // Успех — заменяем содержимое модалки
        modal.querySelector('.calc-modal-card').innerHTML =
          '<button class="calc-modal-close" aria-label="Закрыть">×</button>' +
          '<div class="form-success">' +
            '<div class="form-success-icon">' +
              '<svg viewBox="0 0 60 60" width="60" height="60" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
                '<circle cx="30" cy="30" r="26"/>' +
                '<path d="M18 30 L26 38 L42 22"/>' +
              '</svg>' +
            '</div>' +
            '<h3 class="form-success-title">Спасибо, ' + escapeHtml(name) + '!</h3>' +
            '<p class="form-success-text">Заявка с расчётом отправлена. Перезвоним в течение 15 минут.</p>' +
            '<p class="form-success-hint">Если срочно — звони: <a href="tel:+79966292410">+7 (996) 629-24-10</a></p>' +
          '</div>';

        modal.querySelector('.calc-modal-close').addEventListener('click', closeModal);

        if (window.LaserConfetti) {
          const rect = modal.querySelector('.calc-modal-card').getBoundingClientRect();
          window.LaserConfetti.fire(rect.left + rect.width / 2, rect.top + rect.height / 3, 120);
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
        alert('Ошибка отправки. Позвони нам: +7 (996) 629-24-10');
      }
    });
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  update();
})();
