# Bruteforce

We try to brute force the login form `http://IP/?page=signin`. For this, we write a script that reads two files with the most common passwords and logins, loops over them, and sends a request to:

```text
http://${ip}/?page=signin&username=${login}&password=${password}&Login=Login#
```

This request returns the page HTML. If the pair is wrong, the page has an image called `WrongAnswer.gif`. If there is no such image, we save the pair to a file and try to log in with it. This way we get the flag. In the end, any login with the password "shadow" works.

## How to protect from bruteforce?

1. Add rules to block the account after a certain number of failed login tries, to stop guessing of credentials.
2. Use CAPTCHA (enter text from an image, click on pictures, solve a simple task, etc.) if blocking is not possible. The CAPTCHA that I hate so much makes bruteforce slow, hard, and very resource-heavy. 
3. Force users to change the password at the first login if a default password is used. This is needed when the account is created for you, for example on corporate platforms. In this case, at the start you only have a default password, which you must change at the first login. Another example is default passwords on devices, like `admin:admin` on a router.
4. Use multi-factor authentication, where the user must confirm the login with an extra device.

The benefit for an attacker here is to get access to a user account.

## Info

- <https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html>  
- <https://owasp.org/www-community/attacks/Password_Spraying_Attack>