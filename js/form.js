'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var MAX_NUMBER_OF_HASHTAGS = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var MAX_EFFECT_DEPTH = 100;
  var DEFAULT_EFFECT_DEPTH = 100;
  var MIN_RESIZING_VALUE = 25;
  var MAX_RESIZING_VALUE = 100;
  var RESIZING_VALUE_STEP = 25;
  var DEFAULT_RESIZING_VALUE = 100;
  var uploadFileElement = document.querySelector('#upload-file');
  var imageUploadOverlay = document.querySelector('.img-upload__overlay');
  var closeUploadButton = imageUploadOverlay.querySelector('#upload-cancel');
  var scale = imageUploadOverlay.querySelector('.scale');
  var scaleLine = scale.querySelector('.scale__line');
  var scaleLevel = scaleLine.querySelector('.scale__level');
  var scalePin = scaleLine.querySelector('.scale__pin');
  var scaleValueElement = imageUploadOverlay.querySelector('.scale__value');
  var selectedEffect = imageUploadOverlay.querySelector('.effects__radio:checked').value;
  var imgUploadPreview = imageUploadOverlay.querySelector('.img-upload__preview');
  var preview = imgUploadPreview.querySelector('img');
  var resizeControlMinus = imageUploadOverlay.querySelector('.resize__control--minus');
  var resizeControlPlus = imageUploadOverlay.querySelector('.resize__control--plus');
  var resizeControlValueElement = imageUploadOverlay.querySelector('.resize__control--value');
  var resizingValue;
  var textHashtagsInput = imageUploadOverlay.querySelector('.text__hashtags');
  var textDescriptionInput = imageUploadOverlay.querySelector('.text__description');
  var hashtags = [];
  var formElement = document.querySelector('.img-upload__form');

  var formElementSubmitHandler = function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(formElement), closeImageUpload, window.error.openErrorMessage);
  };

  var setDefaultEffectDepth = function () {
    scaleValueElement.value = DEFAULT_EFFECT_DEPTH;
    scaleLevel.style.width = scaleValueElement.value + '%';
    scalePin.style.left = scaleValueElement.value * scaleLine.offsetWidth / 100 + 'px';
    applyEffect(selectedEffect, scaleValueElement.value);
  };

  var scalePinMousedownHandler = function (downEvt) {
    downEvt.preventDefault();
    var documentMousemoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = moveEvt.clientX - startX;
      scalePin.style.left = (scalePin.offsetLeft + shift < 0 || scalePin.offsetLeft + shift > scaleLine.offsetWidth) ?
        (scalePin.offsetLeft + 'px') : (scalePin.offsetLeft + shift + 'px');
      scaleValueElement.value = 100 * scalePin.offsetLeft / scaleLine.offsetWidth;
      scaleLevel.style.width = scaleValueElement.value + '%';
      applyEffect(selectedEffect, scaleValueElement.value);
      startX = moveEvt.clientX;
    };
    var documentMouseupHandler = function (upEvt) {
      upEvt.preventDefault();
      scaleValueElement.value = Math.round(100 * scalePin.offsetLeft / scaleLine.offsetWidth);
      scaleLevel.style.width = scaleValueElement.value + '%';
      applyEffect(selectedEffect, scaleValueElement.value);
      document.removeEventListener('mouseup', documentMouseupHandler);
      document.removeEventListener('mousemove', documentMousemoveHandler);
    };
    var startX = downEvt.clientX;
    document.addEventListener('mousemove', documentMousemoveHandler);
    document.addEventListener('mouseup', documentMouseupHandler);
  };

  var openImageUpload = function () {
    imageUploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', documentEscapeKeydownHandler);
    closeUploadButton.addEventListener('click', closeImageUpload);
    closeUploadButton.addEventListener('keydown', closeUploadButtonEnterKeydownHandler);
    scalePin.addEventListener('mousedown', scalePinMousedownHandler);
    effectsListElement.addEventListener('click', effectsListElementClickHandler);
    resizeControlMinus.addEventListener('click', resizeControlMinusClickHandler);
    resizeControlPlus.addEventListener('click', resizeControlPlusClickHandler);
    resizingValue = DEFAULT_RESIZING_VALUE;
    resizeControlValueElement.value = resizingValue + '%';
    resizeImagePreview(resizingValue);
    setDefaultEffectDepth();
    textHashtagsInput.value = '';
    textDescriptionInput.value = '';
    textHashtagsInput.addEventListener('focus', textHashtagsInputFocusHandler);
    textHashtagsInput.addEventListener('blur', textHashtagsInputBlurHandler);
    textDescriptionInput.addEventListener('focus', textDescriptionInputFocusHandler);
    textDescriptionInput.addEventListener('blur', textDescriptionInputBlurHandler);
    textDescriptionInput.addEventListener('invalid', textDescriptionInputInvalidHandler);
    textHashtagsInput.addEventListener('invalid', textHashtagsInputInvalidHandler);
    textHashtagsInput.addEventListener('keydown', textHashtagsInputKeydownHandler);
    textDescriptionInput.addEventListener('keydown', textDescriptionInputKeydownHandler);
    formElement.addEventListener('submit', formElementSubmitHandler);
  };

  var closeImageUpload = function () {
    imageUploadOverlay.classList.add('hidden');
    uploadFileElement.value = '';
    document.removeEventListener('keydown', documentEscapeKeydownHandler);
    closeUploadButton.removeEventListener('click', closeImageUpload);
    closeUploadButton.removeEventListener('click', closeUploadButtonEnterKeydownHandler);
    scalePin.removeEventListener('mousedown', scalePinMousedownHandler);
    effectsListElement.removeEventListener('click', effectsListElementClickHandler);
    resizeControlMinus.removeEventListener('click', resizeControlMinusClickHandler);
    resizeControlPlus.removeEventListener('click', resizeControlPlusClickHandler);
    textHashtagsInput.removeEventListener('focus', textHashtagsInputFocusHandler);
    textHashtagsInput.removeEventListener('blur', textHashtagsInputBlurHandler);
    textDescriptionInput.removeEventListener('focus', textDescriptionInputFocusHandler);
    textDescriptionInput.removeEventListener('blur', textDescriptionInputBlurHandler);
    textDescriptionInput.removeEventListener('invalid', textDescriptionInputInvalidHandler);
    textHashtagsInput.removeEventListener('invalid', textHashtagsInputInvalidHandler);
    textHashtagsInput.removeEventListener('keydown', textHashtagsInputKeydownHandler);
    textDescriptionInput.removeEventListener('keydown', textDescriptionInputKeydownHandler);
    textHashtagsInput.classList.remove('invalid-field');
    textDescriptionInput.classList.remove('invalid-field');
    formElement.removeEventListener('submit', formElementSubmitHandler);
  };

  var documentEscapeKeydownHandler = function (evt) {
    if (window.utils.isEscapeKeyCode(evt.keyCode)) {
      closeImageUpload();
    }
  };

  var closeUploadButtonEnterKeydownHandler = function (evt) {
    if (window.utils.isEnterKeyCode(evt.keyCode)) {
      closeImageUpload();
    }
  };

  var applyEffect = function (effect, depth) {
    var isValidEffect = true;
    var scaleDepth = function (maxValue) {
      return maxValue * depth / MAX_EFFECT_DEPTH;
    };
    if (!effect) {
      effect = 'none';
    }
    switch (effect) {
      case 'none':
        imgUploadPreview.style.filter = 'none';
        break;
      case 'chrome':
        imgUploadPreview.style.filter = 'grayscale(' + scaleDepth(1) + ')';
        break;
      case 'sepia':
        imgUploadPreview.style.filter = 'sepia(' + scaleDepth(1) + ')';
        break;
      case 'marvin':
        imgUploadPreview.style.filter = 'invert(' + scaleDepth(100) + '%)';
        break;
      case 'phobos':
        imgUploadPreview.style.filter = 'blur(' + scaleDepth(3) + 'px)';
        break;
      case 'heat':
        imgUploadPreview.style.filter = 'brightness(' + scaleDepth(3) + ')';
        break;
      default:
        isValidEffect = false;
    }
    if (isValidEffect) {
      imgUploadPreview.classList.add('effects__preview--' + effect);
    }
  };

  uploadFileElement.addEventListener('change', function () {
    var file = uploadFileElement.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        preview.src = reader.result;
        openImageUpload();
      });
      reader.readAsDataURL(file);
    }
  });

  var effectsListElement = document.querySelector('.effects__list');
  var effectsListElementClickHandler = function (evt) {
    var target = evt.target;
    if (target.tagName === 'INPUT') {
      selectedEffect = target.value;
    }
    if (selectedEffect === 'none') {
      scale.classList.add('hidden');
    } else {
      scale.classList.remove('hidden');
    }
    setDefaultEffectDepth();
  };

  var resizeImagePreview = function (scaleFactor) {
    imgUploadPreview.style.transform = 'scale(' + scaleFactor / MAX_RESIZING_VALUE + ')';
  };

  var resizeControlMinusClickHandler = function () {
    resizingValue -= RESIZING_VALUE_STEP;
    if (resizingValue < MIN_RESIZING_VALUE) {
      resizingValue = MIN_RESIZING_VALUE;
    }
    resizeImagePreview(resizingValue);
    resizeControlValueElement.value = resizingValue + '%';
  };

  var resizeControlPlusClickHandler = function () {
    resizingValue += RESIZING_VALUE_STEP;
    if (resizingValue > MAX_RESIZING_VALUE) {
      resizingValue = MAX_RESIZING_VALUE;
    }
    resizeImagePreview(resizingValue);
    resizeControlValueElement.value = resizingValue + '%';
  };

  var checkHashtags = function () {
    textHashtagsInput.setCustomValidity('');
    if (hashtags.length === 0) {
      return;
    }
    // удаление пустых хэш-тегов
    for (var i = 0; i <= hashtags.length - 1; i++) {
      if (hashtags[i] === '') {
        hashtags.splice(i--, 1);
      }
    }
    if (hashtags.length > MAX_NUMBER_OF_HASHTAGS) {
      textHashtagsInput.setCustomValidity('Задайте не более пяти хэш-тегов.');
      return;
    }
    for (i = 0; i <= hashtags.length - 1; i++) {
      if (hashtags[i].charAt(0) !== '#') {
        textHashtagsInput.setCustomValidity('Хэш-тег должен начинаться с символа #.');
      } else if (hashtags[i].length < 2) {
        textHashtagsInput.setCustomValidity('Хэш-тег не может состоять из одного символа #.');
      } else {
        if (hashtags[i].length > MAX_HASHTAG_LENGTH) {
          textHashtagsInput.setCustomValidity('Хэш-тег не может быть длиннее 20 символов.');
        } else {
          for (var j = i + 1; j <= hashtags.length - 1; j++) {
            if (hashtags[j].toLowerCase() === hashtags[i].toLowerCase()) {
              textHashtagsInput.setCustomValidity('Хэш-теги не должны повторяться.');
              return;
            }
          }
        }
      }
    }
  };

  var textHashtagsInputFocusHandler = function () {
    document.removeEventListener('keydown', documentEscapeKeydownHandler);
  };

  var textHashtagsInputKeydownHandler = function () {
    textHashtagsInput.classList.remove('invalid-field');
  };

  var textHashtagsInputBlurHandler = function () {
    document.addEventListener('keydown', documentEscapeKeydownHandler);
    hashtags = textHashtagsInput.value.split(' ');
    checkHashtags();
  };

  var textDescriptionInputFocusHandler = function () {
    document.removeEventListener('keydown', documentEscapeKeydownHandler);
  };

  var textDescriptionInputKeydownHandler = function () {
    textDescriptionInput.classList.remove('invalid-field');
  };

  var textDescriptionInputBlurHandler = function () {
    document.addEventListener('keydown', documentEscapeKeydownHandler);
  };

  var textDescriptionInputInvalidHandler = function () {
    if (textDescriptionInput.validity.tooLong) {
      textDescriptionInput.setCustomValidity('Слишком длинное описание. Введите не более 140 символов.');
    }
    textDescriptionInput.classList.add('invalid-field');
  };

  var textHashtagsInputInvalidHandler = function () {
    textHashtagsInput.classList.add('invalid-field');
  };
})();
