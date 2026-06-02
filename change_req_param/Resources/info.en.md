# Changing a request parameter

On the page http://IP/index.php?page=survey# we see a voting table. We open DevTools and look at how it works. The table is wrapped in a form. `submit` is triggered on every change in the `select` element. In the `select` options, the `value` attribute is fixed in the HTML, we can see it and we can change it. We choose any option, change its `value` to a number > 10, and we get the flag.  

What is the problem here?  
The server trusts the data that comes from the client, and this data can be easily changed to something invalid. In our example, we can “cheat”: a normal user can only set a score from 1 to 10. But if we change the `value`, we can increase the maximum score.

This looks like a **Web Parameter Tampering** vulnerability (manipulation of parameters / cookies):  
[https://owasp.org/www-community/attacks/Web_Parameter_Tampering](https://owasp.org/www-community/attacks/Web_Parameter_Tampering).