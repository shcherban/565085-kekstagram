'use strict';

var NUMBER_OF_PICTURES = 25;
var ENTER_KEY_CODE = 13;
var ESCAPE_KEY_CODE = 27;
var MAX_EFFECT_DEPTH = 100;
var DEFAUL_EFFECT_DEPTH = 100;
var MIN_RESIZE_VALUE = 25;
var MAX_RESIZE_VALUE = 100;
var RESIZE_VALUE_STEP = 25;
var DEFAUL_REZISE_VALUE = 100;

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
var effectDepth = DEFAUL_EFFECT_DEPTH;
var imgUploadPreview = imageUploadOverlay.querySelector('.img-upload__preview');
var resizeControlMinus = imageUploadOverlay.querySelector('.resize__control--minus');
var resizeControlPlus = imageUploadOverlay.querySelector('.resize__control--plus');
var resizeControlValueElement = imageUploadOverlay.querySelector('.resize__control--value');
var resizeValue;

var openImageUpload = function () {
  imageUploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', documentEscapeKeydownHandler);
  closeUploadButton.addEventListener('click', closeImageUpload);
  closeUploadButton.addEventListener('keydown', closeUploadButtonEnterKeydownHandler);
  scalePin.addEventListener('mouseup', scalePinMouseupHandler);
  resizeValue = DEFAUL_REZISE_VALUE;
  resizeControlValueElement.value = resizeValue + '%';
  resizeImagePreview(resizeValue);
  applyEffect(selectedEffect, effectDepth);
};

var closeImageUpload = function () {
  imageUploadOverlay.classList.add('hidden');
  uploadFileElement.value = '';
  document.removeEventListener('keydown', documentEscapeKeydownHandler);
  closeUploadButton.removeEventListener('click', closeImageUpload);
  closeUploadButton.removeEventListener('click', closeUploadButtonEnterKeydownHandler);
  scalePin.removeEventListener('mouseup', scalePinMouseupHandler);
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

var addEffectRadioClickListener = function (effectRadio) {
  effectRadio.addEventListener('click', function () {
    selectedEffect = effectRadio.value;
    effectDepth = DEFAUL_EFFECT_DEPTH;
    applyEffect(selectedEffect, effectDepth);
  });
};

for (var i = 0; i <= effectsRadio.length - 1; i++) {
  addEffectRadioClickListener(effectsRadio[i]);
}

var resizeImagePreview = function (resizeCoefficient) {
  imgUploadPreview.style.transform = 'scale(' + resizeCoefficient / MAX_RESIZE_VALUE + ')';
};

resizeControlMinus.addEventListener('click', function () {
  resizeValue -= RESIZE_VALUE_STEP;
  if (resizeValue < MIN_RESIZE_VALUE) {
    resizeValue = MIN_RESIZE_VALUE;
  }
  resizeImagePreview(resizeValue);
  resizeControlValueElement.value = resizeValue + '%';
});

resizeControlPlus.addEventListener('click', function () {
  resizeValue += RESIZE_VALUE_STEP;
  if (resizeValue > MAX_RESIZE_VALUE) {
    resizeValue = MAX_RESIZE_VALUE;
  }
  resizeImagePreview(resizeValue);
  resizeControlValueElement.value = resizeValue + '%';
});

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
