const fs = require('fs');
const path = require('path');

const pathText = path.resolve(__dirname, 'text.txt');
const readStream = fs.createReadStream(pathText);
let res = '';
readStream.on('data', chunk => res += chunk);
readStream.on('end', () => console.log(res.trim()));
readStream.on('error', error => console.log(error.message));