Подмена ссылки

Прогулявшись по сайту, можно найти все запросы, связанные с переходами на другие страницы. Мы имеем:

page=survey
page=member
page=upload
page=searchimg
page=media
page=signin
page=feedback
page=redirect
page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f

Нас интересует запрос с параметром page=redirect. Вот так он выглядит полностью:

```bash
index.php?page=redirect&site=instagram
```
Вероятно, "instagram" — это переменная.
Пробуем подменить её на адрес любого другого сайта, например:
http://10.171.57.196/index.php?page=redirect&site=https://web.telegram.org/
и получаем флаг.


В OWASP эта уязвимость определена как Open Redirect (https://owasp.org/www-community/attacks/open_redirect). Она возникает, когда URL может перенаправить пользователя на адрес, заданный через непроверенный параметр.

Здесь также важно разобрать опасность такой подмены. 

