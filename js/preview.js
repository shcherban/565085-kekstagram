'use strict';

(function () {
  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureImageElement = bigPictureElement.querySelector('.big-picture__img img');
  var bigPictureCommentsCountElement = bigPictureElement.querySelector('.comments-count');
  var bigPictureLikesCountElement = bigPictureElement.querySelector('.likes-count');
  var bigPictureComments = bigPictureElement.querySelector('.social__comments');
  var socialCaption = bigPictureElement.querySelector('.social__caption');
  var pictureLinks = document.querySelectorAll('.picture__link');
  var bigPictureCancelButton = bigPictureElement.querySelector('#picture-cancel');

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
      avatar.src = 'img/avatar-' + window.utils.getRandomValue(1, 6) + '.svg';
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

  var bigPictureCancelButtonClickHandler = function () {
    closeBigPictureOverlay();
  };

  var documentEscapeKeydownHandler = function (evt) {
    if (window.utils.isEscapeKeyCode(evt.keyCode)) {
      closeBigPictureOverlay();
    }
  };

  var addPictureEventListener = function (pictureLink, pictureIndex) {
    pictureLink.addEventListener('click', function (evt) {
      evt.preventDefault();
      renderBigPicture(window.data.pictures[pictureIndex]);
      bigPictureCancelButton.addEventListener('click', bigPictureCancelButtonClickHandler);
      document.addEventListener('keydown', documentEscapeKeydownHandler);
    });
  };

  for (var i = 0; i <= pictureLinks.length - 1; i++) {
    addPictureEventListener(pictureLinks[i], i);
  }

  var closeBigPictureOverlay = function () {
    bigPictureElement.classList.add('hidden');
    bigPictureCancelButton.removeEventListener('click', bigPictureCancelButtonClickHandler);
    document.removeEventListener('keydown', documentEscapeKeydownHandler);
  };
})();