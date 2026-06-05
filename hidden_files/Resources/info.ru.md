# Скрытая папка

В файле `http://IP/robots.txt` была обнаружена скрытая папка `.hidden`. Если перейти внутрь, можно увидеть множество одинаковых подпапок с сообщениями от создателей Darkly. Появилась идея проверить, что написано в каждом из этих файлов: возможно, в одном из них находится флаг, а может, даже несколько. Для этого был написан скрипт, который рекурсивно обходит папки и, если в содержимом есть совпадение со строкой `flag`, записывает путь и сам флаг в массив:

```bash
let foldersCount = 0;
let result = [];

// возвращаем текст из файла README
const fetchREADME = async (url) => {
  const req = await fetch(`${url}/README`);
  if (!req.ok) return null;
  return await req.text();
};

const mapPage = async (url) => {
  // запрашиваем HTML страницы
  const req = await fetch(url);
  if (!req.ok) return;
  const html = await req.text(); // строка

  // записываем в массив все имена папок
  const hrefs = [...html.matchAll(/href="([a-z]+\/)"/g)].map((match) => match[1]);

  // фильтруем так, чтобы попали все имена папок, кроме папки "назад" и "README"
  const links = hrefs.filter((href) => href !== "../" && href.endsWith("/"));

  // рекурсия вызывается, пока на странице есть список файлов
  for (const link of links) {
    foldersCount++;

    // формируем новый URL для запроса
    const newUrl = `${url}/${link.replace(/\/$/, "")}`;

    // получаем содержимое файла
    const text = await fetchREADME(newUrl);

    // контрольная проверка
    if (text && text.includes("flag")) {
      result.push({ flag: text, url: newUrl });
    }

    await mapPage(newUrl);
  }
};

// начинаем с корня папки
await mapPage("http://IP/.hidden");

console.log("result:", result);
```

В результате флаг был найден в файле:

`http://IP/.hidden/whtccjokayshttvxycsvykxcfm/igeemtxnvexvxezqwntmzjltkt/lmpanswobhwcozdqixbowvbrhw`

Вывод: в файле robots.txt можно узнать, что хранится в проекте — это утечка информации. Каждый может просмотреть этот файл, поэтому следует защищать чувствительные места авторизацией, проверкой входящего IP или вовсе не давать доступ к этим ресурсам, а вместо этого обрабатывать доступ на стороне фронтенда.
