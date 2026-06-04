let foldersCount = 0;
let result = [];

// return text from the README file
const fetchREADME = async (url) => {
  const req = await fetch(`${url}/README`);
  if (!req.ok) return null;
  return await req.text();
};

const mapPage = async (url) => {
  // fetch the HTML of the page
  const req = await fetch(url);
  if (!req.ok) return;
  const html = await req.text();
  // save all folder names in an array
  const hrefs = [...html.matchAll(/href="([a-z]+\/)"/g)].map(
    (match) => match[1],
  );

  // filter so that we keep all folder names except "back" and "README"
  const links = hrefs.filter(
    (href) => href && href !== "../" && href.endsWith("/"),
  );

  // recursion is called while the page has a list of files
  for (const link of links) {
    foldersCount++;
    const newUrl = `${url}/${link.replace(/\/$/, "")}`;
    const text = await fetchREADME(newUrl);

    if (text && text.includes("flag")) {
      result.push({ flag: text, url: newUrl });
    }

    await mapPage(newUrl);
  }
};

//we starts from root folder
await mapPage("http://10.171.57.196/.hidden");
console.log("result: ", result);
console.log("foldersCount: ", foldersCount);
