'use strict';

(function () {
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';
  var DOWNDOAD_URL = 'https://js.dump.academy/kekstagram/data';
  window.backend = {
    upload: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        var error;
        switch (xhr.status - xhr.status % 100) {
          case 200:
            onLoad();
            break;
          case 300:
            error = 'Ресурс переехал';
            break;
          case 400:
            error = 'Ошибка в запросе';
            break;
          default:
            error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
        }
        if (error) {
          onError(error);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Ошибка сервера');
      });
      xhr.addEventListener('timeout', function () {
        onError('Превышен лимит времени ожидания ответа');
      });
      xhr.open('POST', UPLOAD_URL);
      xhr.send(data);
    },
    download: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        var error;
        switch (xhr.status - xhr.status % 100) {
          case 200:
            onLoad(xhr.response);
            break;
          case 300:
            error = 'Ресурс переехал';
            break;
          case 400:
            error = 'Ошибка в запросе';
            break;
          default:
            error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
        }
        if (error) {
          onError(error);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Ошибка сервера');
      });
      xhr.addEventListener('timeout', function () {
        onError('Превышен лимит времени ожидания ответа');
      });
      xhr.open('GET', DOWNDOAD_URL);
      xhr.send();
    }
  };
})();
