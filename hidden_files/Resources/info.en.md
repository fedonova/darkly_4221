# Hidden folder

There is one more braches in the file `http://IP/robots.txt`-  a hidden folder . If we go inside it, we can see many similar subfolders with messages from the Darkly creators. The idea was to check what is written in each of these files: maybe one of them has a flag, or even several flags.

To do this,I wrote a script. It walks through the folders recursively, and if the content has the word `flag`, it saves the path and the flag in an array:

```bash
let result = [];

const fetchREADME = async (url) => {
  const req = await fetch(`${url}/README`);
  if (!req.ok) return null;
  return await req.text();
};

const mapPage = async (url) => {
  const req = await fetch(url);
  if (!req.ok) return;
  const html = await req.text();

  const hrefs = [...html.matchAll(/href="([a-z]+\/)"/g)].map((match) => match[1]);
  const links = hrefs.filter((href) => href !== "../" && href.endsWith("/"));

  for (const link of links) {
    const newUrl = `${url}/${link.replace(/\/$/, "")}`;
    const text = await fetchREADME(newUrl);

    if (text && text.includes("flag")) {
      result.push({ flag: text, url: newUrl });
    }

    await mapPage(newUrl);
  }
};

await mapPage("http://IP/.hidden");
console.log("result:", result);
```

In the end, the flag was found in this file:
`http://IP/.hidden/whtccjokayshttvxycsvykxcfm/igeemtxnvexvxezqwntmzjltkt/lmpanswobhwcozdqixbowvbrhw`

## The main idea
The robots.txt file can show what is stored in the project, and this is information leakage. Anyone can view this file, so sensitive parts should be protected with authentication, with checks on the client IP, or by not giving direct access to these resources at all and handling access on the frontend side, for example.