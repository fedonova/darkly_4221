const fetchREADME = async (url) => {
  try {
    const req = await fetch(`${url}/README`);
    const res = await req.text();
    // console.log(typeof res);
    console.log(res);
  } catch (err) {
    console.error(err);
  }
};

const mapPage = async (url) => {
  try {
    const req = await fetch(url);
    const html = await req.text();
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(
      (match) => match[1],
    );

    const links = hrefs.filter(
      (href) => href !== "../" && href.endsWith("/") && href !== "README",
    );

    if (links.length) {
      links.map((link) => {
        fetchREADME(`http://10.171.57.196/.hidden/${link}`);
        //what url???
        mapPage(`url`)
      });
    }
  } catch (err) {
    console.error(err);
  }
};

mapPage();

/*
function sum(arr, index = 0) {
  if (index >= arr.length) {
    return 0;                  // base case
  }
  return arr[index] + sum(arr, index + 1);  // recursive step
}

console.log(sum([1, 2, 3, 4])); // 10
*/
//REcURSION
