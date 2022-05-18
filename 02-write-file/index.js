const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = process;

const pathText = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathText);
stdout.write('Привет, введите данные для записи\n');
stdin.on('data', data => {
  const strData = data.toString().trim();
  if(strData !== 'exit') {
    output.write(data);
  } else {
    console.log('Ввод завершен');
    exit();
  }
});
process.on('SIGINT', () => {
  console.log('Ввод завершен');
  exit();
});