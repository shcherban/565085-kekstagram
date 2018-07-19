'use strict';

(function () {
  var NUMBER_OF_NEW_PICTURES = 10;
  var DEBOUNCE_INTERVAL = 500;

  var pictureTemplate = document.querySelector('#picture')
    .content;

  var addPictureEventListener = function (pictureLink, picture) {
    pictureLink.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.preview(picture);
    });
  };

  var renderPictures = function (picturesArray) {
    var picturesContainer = document.querySelector('.pictures');
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
    do {
      var oldPictureLink = picturesContainer.querySelector('.picture__link');
      if (oldPictureLink) {
        picturesContainer.removeChild(oldPictureLink);
      }
    }
    while (oldPictureLink);
    picturesContainer.appendChild(fragment);
  };

  window.backend.download(renderPictures, window.error.openErrorMessage);

  var imgFiltersContainer = document.querySelector('.img-filters');
  var filterPopularButton = imgFiltersContainer.querySelector('#filter-popular');
  var filterNewButton = imgFiltersContainer.querySelector('#filter-new');
  var filterDiscussedButton = imgFiltersContainer.querySelector('#filter-discussed');

  var lastTimeout;
  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };

  var filterPopularButtonClickHandler = function () {
    filterPopularButton.classList.add('img-filters__button--active');
    filterNewButton.classList.remove('img-filters__button--active');
    filterDiscussedButton.classList.remove('img-filters__button--active');
    debounce(function () {
      window.backend.download(renderPictures, window.error.openErrorMessage);
    });
  };
  var filterNewButtonClickHandler = function () {
    filterPopularButton.classList.remove('img-filters__button--active');
    filterNewButton.classList.add('img-filters__button--active');
    filterDiscussedButton.classList.remove('img-filters__button--active');
    debounce(function () {
      window.backend.download(filterNewPictures, window.error.openErrorMessage);
    });
  };
  var filterDiscussedButtonClickHandler = function () {
    filterPopularButton.classList.remove('img-filters__button--active');
    filterNewButton.classList.remove('img-filters__button--active');
    filterDiscussedButton.classList.add('img-filters__button--active');
    debounce(function () {
      window.backend.download(filterDiscussedPictures, window.error.openErrorMessage);
    });
  };
  imgFiltersContainer.classList.remove('img-filters--inactive');
  var filterNewPictures = function (picturesArray) {
    while (picturesArray.length > NUMBER_OF_NEW_PICTURES) {
      var indexDelete = window.utils.getRandomValue(0, picturesArray.length - 1);
      picturesArray.splice(indexDelete, 1);
    }
    window.utils.shuffle(picturesArray);
    renderPictures(picturesArray);
  };
  var filterDiscussedPictures = function (picturesArray) {
    picturesArray.sort(function (picture1, picture2) {
      return picture2.comments.length - picture1.comments.length;
    });
    renderPictures(picturesArray);
  };

  filterPopularButton.addEventListener('click', filterPopularButtonClickHandler);
  filterNewButton.addEventListener('click', filterNewButtonClickHandler);
  filterDiscussedButton.addEventListener('click', filterDiscussedButtonClickHandler);

  var commentCountElement = document.querySelector('.social__comment-count');
  var loadmoreElement = document.querySelector('.social__loadmore');

  window.utils.hideElement(commentCountElement);
  window.utils.hideElement(loadmoreElement);
})();
