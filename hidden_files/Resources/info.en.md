# Hidden folder

In the file `http://IP/robots.txt`, a hidden folder called `.hidden` was found. If we go inside it, we can see many similar subfolders with messages from the Darkly creators. The idea was to check what is written in each of these files: maybe one of them has a flag, or even several flags.

To do this, a script was written. It walks through the folders recursively, and if the content has the word `flag`, it saves the path and the flag itself in an array:

```bash
let foldersCount = 0;
let result = [];

// return text from the README file
const fetchREADME = async (url) => {
  const req = await fetch(`${url}/README`);
  if (!req.ok) return null;
  return await req.text();
};

const mapPage = async (url) => {
  // request the HTML of the page
  const req = await fetch(url);
  if (!req.ok) return;
  const html = await req.text(); // string

  // save all folder names in an array
  const hrefs = [...html.matchAll(/href="([a-z]+\/)"/g)].map((match) => match[1]);

  // filter so that we keep all folder names except "back" and "README"
  const links = hrefs.filter((href) => href !== "../" && href.endsWith("/"));

  // recursion is called while the page has a list of files
  for (const link of links) {
    foldersCount++;

    // build a new URL for the request
    const newUrl = `${url}/${link.replace(/\/$/, "")}`;

    // get the contents of the file
    const text = await fetchREADME(newUrl);

    // extra check
    if (text && text.includes("flag")) {
      result.push({ flag: text, url: newUrl });
    }

    await mapPage(newUrl);
  }
};

// start from the root of the folder
await mapPage("http://IP/.hidden");

console.log("result:", result);
```

In the end, the flag was found in this file:
`http://IP/.hidden/whtccjokayshttvxycsvykxcfm/igeemtxnvexvxezqwntmzjltkt/lmpanswobhwcozdqixbowvbrhw`

The main idea: do not store important information where it can be reached by others.