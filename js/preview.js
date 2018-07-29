'use strict';

(function () {
  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureImageElement = bigPictureElement.querySelector('.big-picture__img img');
  var bigPictureCommentsCountElement = bigPictureElement.querySelector('.comments-count');
  var bigPictureLikesCountElement = bigPictureElement.querySelector('.likes-count');
  var bigPictureComments = bigPictureElement.querySelector('.social__comments');
  var bigPictureCancelButton = bigPictureElement.querySelector('#picture-cancel');

  function createComment(picture, comment, fragment) {
    var commentElement = document.createElement('li');
    var avatar = document.createElement('img');
    var text = document.createElement('p');
    commentElement.classList.add('social__comment', 'social__comment--text');
    avatar.classList.add('social__picture');
    avatar.src = 'img/avatar-' + window.utils.getRandomValue(1, 6) + '.svg';
    avatar.alt = 'Аватар комментатора фотографии';
    avatar.width = '35';
    avatar.height = '35';
    text.classList.add('social__text');
    text.textContent = comment;
    commentElement.appendChild(avatar);
    commentElement.appendChild(text);
    fragment.appendChild(commentElement);
  }

  window.preview = function (picture) {
    bigPictureCancelButton.addEventListener('click', bigPictureCancelButtonClickHandler);
    document.addEventListener('keydown', documentEscapeKeydownHandler);
    bigPictureElement.classList.remove('hidden');
    bigPictureImageElement.src = picture.url;
    bigPictureCommentsCountElement.textContent = picture.comments.length;
    bigPictureLikesCountElement.textContent = picture.likes;
    var fragment = document.createDocumentFragment();
    picture.comments.forEach(function (comment) {
      createComment(picture, comment, fragment);
    });
    bigPictureComments.innerHTML = '';
    bigPictureComments.appendChild(fragment);
  };

  var bigPictureCancelButtonClickHandler = function () {
    closeBigPictureOverlay();
  };

  var documentEscapeKeydownHandler = function (evt) {
    if (window.utils.isEscapeKeyCode(evt.keyCode)) {
      closeBigPictureOverlay();
    }
  };

  var closeBigPictureOverlay = function () {
    bigPictureElement.classList.add('hidden');
    bigPictureCancelButton.removeEventListener('click', bigPictureCancelButtonClickHandler);
    document.removeEventListener('keydown', documentEscapeKeydownHandler);
  };
})();
