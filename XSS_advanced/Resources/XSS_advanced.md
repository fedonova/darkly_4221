Step:

1. In a DevTools we discovered the vulnareble line:

<object data="http://10.80.182.92/images/nsa_prism.jpg"></object>

Here we can see, that source parameter adds directly in data attribute without any serious filtration. Then the browser takes data and downloads it as a resource inside the webpage.
If we got a jpeg or png, it tries to draw a picture. If it is an index.php, it will download a webpage right inside