/**
 * FAQ — аккордеон с вопросами и ответами
 */
(function () {
  'use strict';

  const questions = document.querySelectorAll('.faq-q');

  questions.forEach((q) => {
    q.addEventListener('click', () => {
      const isOpen = q.parentElement.classList.toggle('open');
      q.setAttribute('aria-expanded', String(isOpen));
    });
  });
})();
