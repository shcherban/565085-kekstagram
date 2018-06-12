'use strict';

var NUMBER_OF_PICTURES = 25;

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

var generatePicture = function (i) {
  var picture = {};
  picture.url = 'photos/' + i + '.jpg';
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

var pictures = [];

for (var i = 1; i <= NUMBER_OF_PICTURES; i++) {
  pictures.push(generatePicture(i));
}

var pictureTemplate = document.querySelector('#picture')
  .content;

var renderPictures = function (picturesArray) {
  var picturesElement = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  for (i = 0; i <= picturesArray.length - 1; i++) {
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
var bigPictureImageElement = bigPictureElement.querySelector('.big-picture__img');
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
  for (i = 0; i <= picture.comments.length - 1; i++) {
    var comment = document.createElement('li');
    var avatar = document.createElement('img');
    var text = document.createElement('span');
    comment.classList.add('social__comment', 'social__comment--text');
    avatar.classList.add('social__picture');
    avatar.src = 'img/avatar-' + getRandomValue(1, 6) + '.svg';
    avatar.alt = 'Аватар комментатора фотографии';
    avatar.width = '35';
    avatar.height = '35';
    text.textContent = picture.comments[i];
    comment.appendChild(avatar);
    comment.appendChild(text);
    fragment.appendChild(comment);
  }
  bigPictureComments.appendChild(fragment);
  socialCaption.textContent = picture.description;
};

renderPictures(pictures);

renderBigPicture(pictures[0]);

var hideElement = function (element) {
  element.classList.add('visually-hidden');
};

var commentCountElement = document.querySelector('.social__comment-count');
var loadmoreElement = document.querySelector('.social__loadmore');

hideElement(commentCountElement);
hideElement(loadmoreElement);
