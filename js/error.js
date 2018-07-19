'use strict';

(function () {
  var errorElement = document.createElement('div');
  var errorMessageElement = document.createElement('span');
  var closeErrorMessageButton = document.createElement('button');
  closeErrorMessageButton.textContent = 'X';
  closeErrorMessageButton.style.backgroundColor = 'white';
  closeErrorMessageButton.style.color = 'black';
  closeErrorMessageButton.style.position = 'absolute';
  closeErrorMessageButton.style.top = '5px';
  closeErrorMessageButton.style.right = '5px';
  errorElement.style.width = '500px';
  errorElement.style.height = '150px';
  errorElement.style.backgroundColor = '#ee5555';
  errorElement.style.border = '3px solid #f0f0f0';
  errorElement.style.color = 'white';
  errorElement.style.position = 'fixed';
  errorElement.style.left = '50%';
  errorElement.style.marginLeft = '-250px';
  errorElement.style.top = '100px';
  errorElement.style.padding = '30px 30px';
  errorMessageElement.textContent = 'Ошибка';
  errorMessageElement.style.display = 'block';
  errorMessageElement.style.margin = '5px';
  errorElement.style.zIndex = '10';
  errorElement.appendChild(errorMessageElement);
  errorElement.appendChild(closeErrorMessageButton);
  document.body.appendChild(errorElement);
  errorElement.width = '100 %';
  errorElement.height = '100 %';
  errorElement.classList.add('hidden');
  window.error = {
    openErrorMessage: function (message) {
      errorMessageElement.textContent = message;
      errorElement.classList.remove('hidden');
      closeErrorMessageButton.addEventListener('click', closeErrorMessageButtonClickHandler);
      document.addEventListener('keydown', documentEscapeKeydownHandler);
    }
  };
  var closeErrorMessage = function () {
    errorElement.classList.add('hidden');
    closeErrorMessageButton.removeEventListener('click', closeErrorMessageButtonClickHandler);
    document.removeEventListener('keydown', documentEscapeKeydownHandler);
  };
  var closeErrorMessageButtonClickHandler = function () {
    closeErrorMessage();
  };
  var documentEscapeKeydownHandler = function (evt) {
    if (window.utils.isEscapeKeyCode(evt.keyCode)) {
      closeErrorMessage();
    }
  };
})();
