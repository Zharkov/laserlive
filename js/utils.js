/**
 * UTILS — общие утилиты для calculator.js
 * Загружается раньше остальных скриптов (порядок в index.html важен).
 */
(function (w) {
  'use strict';

  w.LaserUtils = {
    FORMSPREE_URL: 'https://formspree.io/f/mredyepk',

    escapeHtml: function (s) {
      const div = document.createElement('div');
      div.textContent = s;
      return div.innerHTML;
    },

    applyPhoneMask: function (input) {
      input.addEventListener('input', function (e) {
        let digits = e.target.value.replace(/\D/g, '');
        if (digits.startsWith('8')) digits = '7' + digits.slice(1);
        if (digits.startsWith('7')) digits = digits.slice(0, 11);
        else digits = digits.slice(0, 10);

        let masked = '';
        if (digits.length === 0) {
          masked = '';
        } else if (digits.startsWith('7')) {
          const d = digits.slice(1);
          masked = '+7';
          if (d.length > 0) masked += ' (' + d.slice(0, 3);
          if (d.length >= 3) masked += ') ' + d.slice(3, 6);
          if (d.length >= 6) masked += '-' + d.slice(6, 8);
          if (d.length >= 8) masked += '-' + d.slice(8, 10);
        } else {
          masked = digits;
        }
        e.target.value = masked;
      });
    },
  };
})(window);
