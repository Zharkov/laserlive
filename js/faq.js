/**
 * FAQ — аккордеон с вопросами и ответами
 */
(function () {
  'use strict';

  const questions = document.querySelectorAll('.faq-q');

  questions.forEach((q) => {
    q.addEventListener('click', () => {
      q.parentElement.classList.toggle('open');
    });
  });
})();
