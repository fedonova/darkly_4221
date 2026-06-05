# Cookie value change

In DevTools, we open the cookies and see a `key=value` pair:

```bash
I_am_admin 68934a3e9455fa72420237eb05902327
```

We try to decode the hashed value: we send it to an md5 decrypt service (for example, [https://md5decrypt.net/](https://md5decrypt.net/)) and get the string `"false"`. Then we hash the string `"true"` in the same way, put the new hash into the cookie, and we successfully get the flag.

## Explanations

### Hashing

Hashing is turning data into a fixed-length hex string using a hash function of a chosen algorithm.  
A hash is used to:
- compare data by this string (a quick check “same or not”);
- store data in a closed form (for example, passwords in a database as hashes);
- check data integrity (that a file was not changed on the way).

If needed, you can try to guess which hash algorithm was used with an online tool, for example:  
[hash-identifier](https://toolk.io/ru/tools/hash-identifier).

### Cookies

Cookies are text data that a site saves in the browser to store information about the user session: language, settings (theme), ad tags, cart, different options, session ID, and so on. While the cookie is stored in the browser, the site can use this data.

Cookies can become a source of problems if we do not use the security flags: `HttpOnly`, `Secure`, `SameSite`.

- **HttpOnly** – protects from reading the cookie via JavaScript (it cannot be read with `document.cookie`).
- **Secure** – allows sending the cookie only over HTTPS (data is not sent in clear text, but over an encrypted channel).
- **SameSite** – controls cross-site sending of cookies (helps protect from CSRF).

## Why we found the flag

1. The site trusts cookies. On the server there is no strong server-side storage and check of the `is_admin` flag (the role is effectively decided by a value on the client side).
2. The hash for checking the admin role is easy to predict: it is just `md5("false")` / `md5("true")`, with no secret on the server side.

This is similar to the **Web Parameter Tampering** vulnerability (changing parameters / cookies):  
[https://owasp.org/www-community/attacks/Web_Parameter_Tampering](https://owasp.org/www-community/attacks/Web_Parameter_Tampering).

## What harm can this manipulation cause?
If we take our case, where the user gets admin rights, the impact is very serious. The attacker basically gets full control over the site and can access users’ personal data, internal reports, statistics, payment data, and can also edit content and change application settings.