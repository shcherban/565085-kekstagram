'use strict';

(function () {
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';
  var DOWNDOAD_URL = 'https://js.dump.academy/kekstagram/data';
  var SUCCESS_CODE = 200;
  var REDIRECTION_CODE = 300;
  var CLIENT_ERROR_CODE = 400;

  function prepareXhr(onLoad, onError, isDownload) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status - xhr.status % 100) {
        case SUCCESS_CODE:
          if (isDownload) {
            onLoad(xhr.response);
          }
          else {
            onLoad();
          }
          break;
        case REDIRECTION_CODE:
          error = 'Ресурс переехал';
          break;
        case CLIENT_ERROR_CODE:
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
    return xhr;
  }

  window.backend = {
    upload: function (data, onLoad, onError) {
      var xhr = prepareXhr(onLoad, onError, false);
      xhr.open('POST', UPLOAD_URL);
      xhr.send(data);
    },
    download: function (onLoad, onError) {
      var xhr = prepareXhr(onLoad, onError, true);
      xhr.open('GET', DOWNDOAD_URL);
      xhr.send();
    }
  };
})();
