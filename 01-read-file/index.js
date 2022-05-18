const fs = require('fs');
const path = require('path');

const pathText = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(pathText, 'utf-8');
let res = '';
readStream.on('data', chunk => res += chunk);
readStream.on('end', () => console.log(res));
readStream.on('error', error => console.log(error.message));