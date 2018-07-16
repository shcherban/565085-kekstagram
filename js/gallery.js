'use strict';

(function () {

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

  renderPictures(window.data.pictures);

  var commentCountElement = document.querySelector('.social__comment-count');
  var loadmoreElement = document.querySelector('.social__loadmore');

  window.utils.hideElement(commentCountElement);
  window.utils.hideElement(loadmoreElement);

})();
