'use strict';

(function () {
  var ENTER_KEY_CODE = 13;
  var ESCAPE_KEY_CODE = 27;
  window.utils = {
    getRandomElement: function (elements) {
      var randomIndex = Math.round(Math.random() * (elements.length - 1));
      return elements[randomIndex];
    },
    // возвращает случайное целое число от from до to включительно
    getRandomValue: function (from, to) {
      return Math.round((to - from - 1) * Math.random() + 1);
    },
    isEnterKeyCode: function (keyCode) {
      return keyCode === ENTER_KEY_CODE;
    },
    isEscapeKeyCode: function (keyCode) {
      return keyCode === ESCAPE_KEY_CODE;
    },
    hideElement: function (element) {
      element.classList.add('visually-hidden');
    }
  };
})();
