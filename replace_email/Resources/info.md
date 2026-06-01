# Replacing the email address

On the page <http://IP/?page=signin>, there is a link **"I forgot my password"**. It redirects to <http://IP/?page=recover>. Here, the only active element is the **"Submit"** button. We look at how this button looks in the DOM. We see this:

```bash
<form action="#" method="POST">
    <input type="hidden" name="mail" value="webmaster@borntosec.com" maxlength="15">
    <input type="submit" name="Submit" value="Submit">
</form>
```

When the button is pressed, a POST request is sent to `webmaster@borntosec.com`. We change this value to any other email address and get the flag.
