Step:

1. First of all we should look at the address bar. We can see here:

http://10.171.61.48/?page=media&src=nsa

/?page=media&src=nsa - is the request to the main index.php, in which we have got 2 GET parameters:

- page=media
So, the chosen page is 'media', where the media files can be processed.

- src=nsa
There is a source (src) parameter that is used somewhere in the media.php, and can be initialised by any type of data.

2. In a DevTools we discovered the vulnareble line:

<object data="http://10.171.61.48/images/nsa_prism.jpg"></object>

Here we can see, that source parameter is added directly in data attribute without any serious filtration. Then the browser takes data and downloads it as a resource inside the webpage.
If we got a jpeg or png, it tries to draw a picture. If it is an index.php, it will download a webpage right inside.And if we got a script, ot will be executed.

3. We should try to exploit it by inserting a script in the source parameter:

http://10.171.61.48/?page=media&src=data:text/html,<script>alert(1)</script>

In a DevTools we see that the script was successfully inserted, and we got an alert as well, but there is no flag.

4. In the OWASP tutorials we found that sometimes the web-apps could be sanitized, so the symbols like "<>" could be parsed, so the solution is to encode the script into base64. To do so, we encode our scrypt into base64:

sh-5.3$ echo -n '<script>alert(1)</script>' | base64
PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==

The result line:

http://10.171.61.48/?page=media&src=data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==

And we get the flag:
928d819fc19405ae09921a2b71227bd9aba106f9d2d37ac412e9e5a750f1506d
