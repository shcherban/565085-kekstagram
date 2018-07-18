'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture')
    .content;

  var addPictureEventListener = function (pictureLink, picture) {
    pictureLink.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.preview(picture);
    });
  };

  var renderPictures = function (picturesArray) {
    var picturesElement = document.querySelector('.pictures');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i <= picturesArray.length - 1; i++) {
      var pictureElement = pictureTemplate.cloneNode(true);
      var imageElement = pictureElement.querySelector('.picture__img');
      var likesElement = pictureElement.querySelector('.picture__stat--likes');
      var commentsCountElement = pictureElement.querySelector('.picture__stat--comments');
      var pictureLink = pictureElement.querySelector('.picture__link');
      imageElement.src = picturesArray[i].url;
      likesElement.textContent = picturesArray[i].likes;
      commentsCountElement.textContent = picturesArray[i].comments.length;
      addPictureEventListener(pictureLink, picturesArray[i]);
      fragment.appendChild(pictureElement);
    }
    picturesElement.appendChild(fragment);
  };

  window.backend.download(renderPictures, window.error.openErrorMessage);

  var commentCountElement = document.querySelector('.social__comment-count');
  var loadmoreElement = document.querySelector('.social__loadmore');

  window.utils.hideElement(commentCountElement);
  window.utils.hideElement(loadmoreElement);
})();
