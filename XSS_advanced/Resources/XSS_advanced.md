Step:

1. Entry point: URL parameters. In the address bar we see:

http://10.171.61.48/?page=media&src=nsa

/?page=media&src=nsa - This is a request to the main controller (typically index.php) with two GET parameters:

- page=media – selects the media page/module, which is responsible for displaying media files.

- src=nsa – user‑controlled parameter that is later used inside media.php and ends up in the HTML as part of an <object> element.

2. Using DevTools we inspect generated HTML and find the vulnareble sink:

<object data="http://10.171.61.48/images/nsa_prism.jpg"></object>

This shows that the value of src is effectively inserted into the data attribute of an <object> tag with no meaningful validation. The browser treats this value as a URL and loads the referenced resource inside the page. If the URL points to:

- an image (jpg/png), the browser tries to render a picture,
- an HTML/PHP page, it will render an HTML document inside the <object>,
- a data: URL, it will parse the embedded HTML and execute any JavaScript it contains.

So src is not just a “file name”; it is an attacker‑controlled URL for <object data="...">.

3. We then try to exploit this by supplying a data: URL in the src parameter:

http://10.171.61.48/?page=media&src=data:text/html,<script>alert(1)</script>

In the HTML we now see:

<object data="data:text/html,<script>alert(1)</script>"></object>

The browser interprets this as an HTML document containing <script>alert(1)</script>, and the alert pops up. This already proves a cross‑site scripting vulnerability, even though this particular payload does not return the flag used by the challenge.

4. In practice, special characters like < and > inside URLs can cause problems (they need URL‑encoding and may be filtered by the application or intermediaries), so the safest way is to embed our HTML as base64 data. To do this, we take the HTML fragment we want to run, <script>alert(1)</script>, and encode it to base64:

sh-5.3$ echo -n '<script>alert(1)</script>' | base64
PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==

Then we build a data: URL where the payload is this base64 string:

http://10.171.61.48/?page=media&src=data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==

The application inserts this value directly into <object data="...">, the browser decodes the base64 back into <script>alert(1)</script>, executes it in the context of the site, and as a result the challenge returns the flag:
928d819fc19405ae09921a2b71227bd9aba106f9d2d37ac412e9e5a750f1506d
