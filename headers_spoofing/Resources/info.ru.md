# Запрос через curl

На странице  
`http://IP/?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f`  
мы видим очень длинный ответ сервера (полученная браузером страница). Пролистываем её полностью и находим комментарии:

```bash
<!--
You must come from : "https://www.nsa.gov/".
-->

<!--
Let's use this browser : "ft_bornToSec". It will help you a lot.
-->
```

Первый комментарий явно указывает на заголовок `Referer`, второй — на заголовок, содержащий информацию о браузере, `User-Agent`.  
Мы не можем просто так запросить страницу из обычного браузера с этими заголовками, но можем сделать запрос через `curl`:

```bash
curl -H "Referer: https://www.nsa.gov/" \
     -H "User-Agent: ft_bornToSec" \
     "http://IP/?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f"
```

В ответной странице мы получаем флаг.

Значение переменной `Referer` могут использовать для ограничения доступа к сайту с определенных адресов, а так же для ограничения количества запросов с одного адреса.

https://owasp.org/www-community/pages/attacks/ip_spoofing_via_http_headers

## Краткие пояснения

- **User-Agent** — заголовок, который используется для определения пользовательского агента.
- **Referer** — заголовок, который указывает, с какого адреса запрос.
- **curl** — команда для выполнения http/s запросов через терминал.


todo
Explain the basic functionning of the breach. Explain a method that 
could have avoided this kind of problem. Explain the benefit of this 
breach. Compare and demonstrate that both flags are identical. 