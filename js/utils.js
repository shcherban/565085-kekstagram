'use strict';

(function () {
  var ENTER_KEY_CODE = 13;
  var ESCAPE_KEY_CODE = 27;
  var compareRandom = function () {
    return Math.random() - 0.5;
  };
  window.utils = {
    getRandomElement: function (elements) {
      var randomIndex = Math.floor(Math.random() * elements.length);
      return elements[randomIndex];
    },
    // возвращает случайное целое число от from до to включительно
    getRandomValue: function (from, to) {
      return from + Math.floor(Math.random() * (to - from + 1));
    },
    isEnterKeyCode: function (keyCode) {
      return keyCode === ENTER_KEY_CODE;
    },
    isEscapeKeyCode: function (keyCode) {
      return keyCode === ESCAPE_KEY_CODE;
    },
    hideElement: function (element) {
      element.classList.add('visually-hidden');
    },
    shuffle: function (array) {
      array.sort(compareRandom);
    },
    sortByDesc: function (a, b) {
      return b - a;
    }
  };
})();
