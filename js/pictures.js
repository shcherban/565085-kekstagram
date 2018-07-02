'use strict';

var NUMBER_OF_PICTURES = 25;
var ENTER_KEY_CODE = 13;
var ESCAPE_KEY_CODE = 27;
var MAX_EFFECT_DEPTH = 100;
var DEFAULT_EFFECT_DEPTH = 100;
var MIN_RESIZING_VALUE = 25;
var MAX_RESIZING_VALUE = 100;
var RESIZING_VALUE_STEP = 25;
var DEFAULT_REZISING_VALUE = 100;

var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var descriptions = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var getRandomElement = function (elements) {
  var randomIndex = Math.round(Math.random() * (elements.length - 1));
  return elements[randomIndex];
};

// возвращает случайное целое число от from до to включительно
var getRandomValue = function (from, to) {
  return Math.round((to - from - 1) * Math.random() + 1);
};

var generatePicture = function (index) {
  var picture = {};
  picture.url = 'photos/' + index + '.jpg';
  picture.likes = getRandomValue(15, 200);
  picture.comments = [];
  picture.comments[0] = getRandomElement(comments);
  if (getRandomValue(0, 1)) {
    do {
      picture.comments[1] = getRandomElement(comments);
    }
    while (picture.comments[1] === picture.comments[0]);
  }
  picture.description = getRandomElement(descriptions);
  return picture;
};

var generateAllPictures = function (numberOfPictures) {
  var pictures = [];
  for (var i = 1; i <= numberOfPictures; i++) {
    pictures.push(generatePicture(i));
  }
  return pictures;
};

var pictures = generateAllPictures(NUMBER_OF_PICTURES);

var pictureTemplate = document.querySelector('#picture')
  .content;

var renderPictures = function (picturesArray) {
  var picturesElement = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i <= picturesArray.length - 1; i++) {
    var pictureElement = pictureTemplate.cloneNode(true);
    var imageElement = pictureElement.querySelector('.picture__img');
    var likesElement = pictureElement.querySelector('.picture__stat--likes');
    var commentsCountElement = pictureElement.querySelector('.picture__stat--comments');
    imageElement.src = picturesArray[i].url;
    likesElement.textContent = picturesArray[i].likes;
    commentsCountElement.textContent = picturesArray[i].comments.length;
    fragment.appendChild(pictureElement);
  }
  picturesElement.appendChild(fragment);
};

var bigPictureElement = document.querySelector('.big-picture');
var bigPictureImageElement = bigPictureElement.querySelector('.big-picture__img img');
var bigPictureCommentsCountElement = bigPictureElement.querySelector('.comments-count');
var bigPictureLikesCountElement = bigPictureElement.querySelector('.likes-count');
var bigPictureComments = bigPictureElement.querySelector('.social__comments');
var socialCaption = bigPictureElement.querySelector('.social__caption');

var renderBigPicture = function (picture) {
  bigPictureElement.classList.remove('hidden');
  bigPictureImageElement.src = picture.url;
  bigPictureCommentsCountElement.textContent = picture.comments.length;
  bigPictureLikesCountElement.textContent = picture.likes;
  var fragment = document.createDocumentFragment();
  for (var i = 0; i <= picture.comments.length - 1; i++) {
    var comment = document.createElement('li');
    var avatar = document.createElement('img');
    var text = document.createElement('p');
    comment.classList.add('social__comment', 'social__comment--text');
    avatar.classList.add('social__picture');
    avatar.src = 'img/avatar-' + getRandomValue(1, 6) + '.svg';
    avatar.alt = 'Аватар комментатора фотографии';
    avatar.width = '35';
    avatar.height = '35';
    text.classList.add('social__text');
    text.textContent = picture.comments[i];
    comment.appendChild(avatar);
    comment.appendChild(text);
    fragment.appendChild(comment);
  }
  bigPictureComments.innerHTML = '';
  bigPictureComments.appendChild(fragment);
  socialCaption.textContent = picture.description;
};

renderPictures(pictures);

var hideElement = function (element) {
  element.classList.add('visually-hidden');
};

var commentCountElement = document.querySelector('.social__comment-count');
var loadmoreElement = document.querySelector('.social__loadmore');

hideElement(commentCountElement);
hideElement(loadmoreElement);

var uploadFileElement = document.querySelector('#upload-file');
var imageUploadOverlay = document.querySelector('.img-upload__overlay');
var closeUploadButton = imageUploadOverlay.querySelector('#upload-cancel');
var scalePin = imageUploadOverlay.querySelector('.scale__pin');
var scaleValueElement = imageUploadOverlay.querySelector('.scale__value');
var effectsRadio = imageUploadOverlay.querySelectorAll('.effects__radio');
var selectedEffect = imageUploadOverlay.querySelector('.effects__radio:checked').value;
var effectDepth = DEFAULT_EFFECT_DEPTH;
var imgUploadPreview = imageUploadOverlay.querySelector('.img-upload__preview');
var resizeControlMinus = imageUploadOverlay.querySelector('.resize__control--minus');
var resizeControlPlus = imageUploadOverlay.querySelector('.resize__control--plus');
var resizeControlValueElement = imageUploadOverlay.querySelector('.resize__control--value');
var resizingValue;
var textHashtagsInput = imageUploadOverlay.querySelector('.text__hashtags');
var textDescriptionInput = imageUploadOverlay.querySelector('.text__description');
var hashtags = [];

var openImageUpload = function () {
  imageUploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', documentEscapeKeydownHandler);
  closeUploadButton.addEventListener('click', closeImageUpload);
  closeUploadButton.addEventListener('keydown', closeUploadButtonEnterKeydownHandler);
  scalePin.addEventListener('mouseup', scalePinMouseupHandler);
  for (var i = 0; i <= effectsRadio.length - 1; i++) {
    effectsRadio[i].addEventListener('click', effectRadioClickHandlers[i]);
  }
  resizeControlMinus.addEventListener('click', resizeControlMinusClickHandler);
  resizeControlPlus.addEventListener('click', resizeControlPlusClickHandler);
  resizingValue = DEFAULT_REZISING_VALUE;
  resizeControlValueElement.value = resizingValue + '%';
  resizeImagePreview(resizingValue);
  applyEffect(selectedEffect, effectDepth);
  textHashtagsInput.addEventListener('focus', textHashtagsInputFocusHandler);
  textHashtagsInput.addEventListener('blur', textHashtagsInputBlurHandler);
  textDescriptionInput.addEventListener('focus', textDescriptionInputFocusHandler);
  textDescriptionInput.addEventListener('blur', textDescriptionInputBlurHandler);
  textDescriptionInput.addEventListener('invalid', textDescriptionInputInvalidHandler);
  textHashtagsInput.addEventListener('invalid', textHashtagsInputInvalidHandler);
  textHashtagsInput.addEventListener('keydown', textHashtagsInputKeydownHandler);
  textDescriptionInput.addEventListener('keydown', textDescriptionInputKeydownHandler);
};

var closeImageUpload = function () {
  imageUploadOverlay.classList.add('hidden');
  uploadFileElement.value = '';
  document.removeEventListener('keydown', documentEscapeKeydownHandler);
  closeUploadButton.removeEventListener('click', closeImageUpload);
  closeUploadButton.removeEventListener('click', closeUploadButtonEnterKeydownHandler);
  scalePin.removeEventListener('mouseup', scalePinMouseupHandler);
  for (var i = 0; i <= effectsRadio.length - 1; i++) {
    effectsRadio[i].removeEventListener('click', effectRadioClickHandlers[i]);
  }
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
};

var documentEscapeKeydownHandler = function (evt) {
  if (evt.keyCode === ESCAPE_KEY_CODE) {
    if (!imageUploadOverlay.classList.contains('hidden')) {
      closeImageUpload();
    }
    if (!bigPictureElement.classList.contains('hidden')) {
      closeBigPictureOverlay();
    }
  }
};

var closeUploadButtonEnterKeydownHandler = function (evt) {
  if (evt.keyCode === ENTER_KEY_CODE) {
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

var scalePinMouseupHandler = function () {
  effectDepth = scaleValueElement.value;
  applyEffect(selectedEffect, effectDepth);
};

uploadFileElement.addEventListener('change', function () {
  openImageUpload();
});

var effectRadioClickHandlers = [];
for (var i = 0; i <= effectsRadio.length - 1; i++) {
  (function (effectRadioValue) {
    var effectRadioClickHandler = function () {
      selectedEffect = effectRadioValue;
      effectDepth = DEFAULT_EFFECT_DEPTH;
      applyEffect(selectedEffect, effectDepth);
    };
    effectRadioClickHandlers.push(effectRadioClickHandler);
  })(effectsRadio[i].value);
}

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

var pictureLinks = document.querySelectorAll('.picture__link');
var bigPictureCancelButton = bigPictureElement.querySelector('#picture-cancel');
var bigPictureCancelButtonClickHandler = function () {
  closeBigPictureOverlay();
};

var addPictureEventListener = function (pictureLink, pictureIndex) {
  pictureLink.addEventListener('click', function (evt) {
    evt.preventDefault();
    renderBigPicture(pictures[pictureIndex]);
    bigPictureCancelButton.addEventListener('click', bigPictureCancelButtonClickHandler);
    document.addEventListener('keydown', documentEscapeKeydownHandler);
  });
};

for (i = 0; i <= pictureLinks.length - 1; i++) {
  addPictureEventListener(pictureLinks[i], i);
}

var closeBigPictureOverlay = function () {
  bigPictureElement.classList.add('hidden');
  bigPictureCancelButton.removeEventListener('click', bigPictureCancelButtonClickHandler);
  document.removeEventListener('keydown', documentEscapeKeydownHandler);
};

var checkHashtags = function () {
  textHashtagsInput.setCustomValidity('');
  if (hashtags.length === 0) {
    return;
  }
  // удаление пустых хэш-тегов
  for (i = 0; i <= hashtags.length - 1; i++) {
    if (hashtags[i] === '') {
      hashtags.splice(i--, 1);
    }
  }
  if (hashtags.length > 5) {
    textHashtagsInput.setCustomValidity('Задайте не более пяти хэш-тегов.');
    return;
  }
  for (i = 0; i <= hashtags.length - 1; i++) {
    if (hashtags[i].charAt(0) !== '#') {
      textHashtagsInput.setCustomValidity('Хэш-тег должен начинаться с символа #.');
    } else if (hashtags[i].length < 2) {
      textHashtagsInput.setCustomValidity('Хэш-тег не может состоять из одного символа #.');
    } else if (hashtags[i].length > 20) {
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
