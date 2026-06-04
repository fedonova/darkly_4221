# Storing sensitive data in robots.txt

We go to `http://IP/robots.txt`. We see a list of directories that are blocked from search engine crawlers:

```text
User-agent: *
Disallow: /whatever
Disallow: /.hidden
```

We check what is inside `/whatever`, find a file called `htpasswd`, download it, and read it:

```text
root:437394baff5aa33daa618be47b75cb49
```

It is clear that this is a set of credentials. We check which hash algorithm was used for the password with [hash-identifier](https://toolk.io/ru/tools/hash-identifier), decode it, login with these credentials, and get the flag.

This is an example of information leakage. The lesson: you must not store such data in public files.

## Explanatory note

### What is a robots.txt file?

It is a text file that contains rules for web spiders, robots, or crawlers (for the difference between them, see: <https://www.robotstxt.org/faq/othernames.html>).
These are programs used by search engines (for example, Google). They automatically find and index web content.

The file defines rules: which paths on the site may be crawled and indexed, and which may not.
This set of rules is called the **Robots Exclusion Protocol** — a standard for giving instructions to robots on how to move through websites.

### How does a robot use robots.txt?

Before checking a site, a robot checks if there is a robots.txt file, for example:

`http://www.your_site.com/robots.txt`

The file usually contains ruls:

- `User-agent`: for what kind of robot this rule is.
- `Disallow`: a path that shouldn't be visited (not indexing).
- `Allow`: a path that is allowed.

Not all robots follow these rules: malicious robots can ignore robots.txt.

You cannot really stop such robots with robots.txt, because this protocol is only a recommendation. We need to block access in other ways — by IP, with authentication, or using other server settings. Also, the robots.txt file is public. You do not need to log in to view it. Any person can see which sections you are asking not to index.Because of this, robots.txt cannot be used as a real access control mechanism or a place to store or share sensitive content. It does not replace authentication and proper access control.

### How is robots.txt created?

To let the robot find it, the `robots.txt` file is placed in the site root, next to `index.html` or another entry file, so that it is available at:

`https://example.com/robots.txt`.

## Extra materials

You can read more details about robots and robots.txt [here](https://www.robotstxt.org/faq.html)

OWASP explains how to test a site for information leakage (including robots.txt) [here](https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/01-Information_Gathering/03-Review_Webserver_Metafiles_for_Information_Leakage)
