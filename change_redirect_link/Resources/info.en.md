# Replacing the link

By walking around the site, we can find all requests that are used to go to other pages. In the app, we can see these values of the `page` parameter:

- `page=survey`
- `page=member`
- `page=upload`
- `page=searchimg`
- `page=media`
- `page=signin`
- `page=feedback`
- `page=redirect`
- `page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f`

Most of them only go to pages of the same website. The exception is the parameter with the value `redirect`, where a link to social media is used.

A full example of this URL:

```bash
index.php?page=redirect&site=instagram
```

Most likely, `instagram` is the value of the `site` variable.

We try to replace it with the address of any other website, for example:

<http://IP/index.php?page=redirect&site=https://web.telegram.org/>

As a result, the app makes the redirect and gives the flag.

## Possible server logic

Below is an psevdo code example of how this redirect handling could look on the backend.

```bash
const socialMedia = {
    facebook: url,
    twitter: url,
    instagram: url,
}; // If, of course, the addresses are stored in the code, not in env or on a proxy.

app.get('/', (req) => {
    if (req.params.page === 'redirect') {
        switch (req.params.site) {
            case "facebook":
                redirectTo(socialMedia["facebook"]);
            case "twitter":
                redirectTo(socialMedia["twitter"]);
            case "instagram":
                redirectTo(socialMedia["instagram"]);
            default:
                redirectTo(req.params.site);
                /*
                The problem is here: an unknown address that is not saved in the app
                as allowed should return a 404 error, or should not be handled at all,
                like in intra42. So it should be like this:


                default:
                    return; // do nothing
                */
        }
    }
})
```

The problem is that the app makes a redirect to a value controlled by the user. If the address is not in the allowed list, the request is still handled, and the user is sent to an external site.

## Possible results

The user thinks they will go to a social media site, but in fact they are sent to a malicious site that may look similar, or even exactly the same, as the real one. If the user is not careful, they may enter their login data on this fake site, and then it can be stolen. Also, the link may lead to an endpoint that downloads a malicious file.

Usually, when the user moves the cursor over a link, the browser shows a small hint in the lower-left corner with the real target of the link. If you watch this carefully, you may notice the replacement and protect yourself from it.

## Vulnerability classification

This kind of case is often used in phishing attacks. In OWASP, this vulnerability is related to category A01:2025. In CWE, it is classified as [CWE-601](https://cwe.mitre.org/data/definitions/601.html).
