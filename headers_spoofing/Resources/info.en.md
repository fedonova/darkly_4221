# Headers spoofing

On the page  
`http://IP/?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f`  
we see a very long server response (the page that the browser gets). We scroll it to the end and find comments:

```bash
<!--
You must come from : "https://www.nsa.gov/".
-->

<!--
Let's use this browser : "ft_bornToSec". It will help you a lot.
-->
```

The first comment clearly points to the `Referer` header, the second one to the header with browser info, `User-Agent`.  
We cannot easily send such headers from a normal browser, but we can send the request with `curl`:

```bash
curl -H "Referer: https://www.nsa.gov/" -H "User-Agent: ft_bornToSec" "http://IP/?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f"
```

In the response page we get the flag.

## Impact
IP spoofing can write false information in log about users activity. 
It makes history data wrong and poisons the logs.
Attackers can change what the logs show, so it is hard to see which actions were normal and which were not.

## How to avoid
1. Use strict validation for headers.
2. Add access rules and limits for IP addresses.
3. Log all activity from untrusted or unknown IPs to find problems and react to them.
4. Review these logs regularly.

## Info
[https://owasp.org/www-community/pages/attacks/ip_spoofing_via_http_headers](https://owasp.org/www-community/pages/attacks/ip_spoofing_via_http_headers)

## Short notes

- **User-Agent** — a header used to show which client (browser, tool) is making the request.
- **Referer** — a header that shows from which address the request came.
- **curl** — a command-line tool to send HTTP/HTTPS requests from the terminal.
