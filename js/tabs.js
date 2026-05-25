/**
 * TABS — переключение между женской / мужской / комплексами
 */
(function () {
  'use strict';

  const tabs = document.querySelectorAll('.price-tab');
  const contents = document.querySelectorAll('.price-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      if (!target) return;

      tabs.forEach((t) => t.classList.remove('active'));
      contents.forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      const content = document.getElementById('tab-' + target);
      if (content) content.classList.add('active');
    });
  });
})();
