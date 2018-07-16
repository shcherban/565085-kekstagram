'use strict';

(function () {
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

  var generatePicture = function (index) {
    var picture = {};
    picture.url = 'photos/' + index + '.jpg';
    picture.likes = window.utils.getRandomValue(15, 200);
    picture.comments = [];
    picture.comments[0] = window.utils.getRandomElement(comments);
    if (window.utils.getRandomValue(0, 1)) {
      do {
        picture.comments[1] = window.utils.getRandomElement(comments);
      }
      while (picture.comments[1] === picture.comments[0]);
    }
    picture.description = window.utils.getRandomElement(descriptions);
    return picture;
  };

  var generateAllPictures = function (numberOfPictures) {
    var pictures = [];
    for (var i = 1; i <= numberOfPictures; i++) {
      pictures.push(generatePicture(i));
    }
    return pictures;
  };

  window.data = {
    pictures: generateAllPictures(NUMBER_OF_PICTURES)
  };
})();
