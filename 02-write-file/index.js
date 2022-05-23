const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = process;
const readline = require('readline');

process.on('SIGINT', () => {
  console.log('Ввод завершен');
  exit(0);
});
process.on('error', error => console.log(error.message));
const readLine = readline.createInterface(stdin);
const pathText = path.resolve(__dirname, 'text.txt');
const output = fs.createWriteStream(pathText, {flags: 'a'});
stdout.write('Привет, введите данные для записи\n');
readLine.on('line', (data) => {
  if(data === 'exit') {
    process.emit('SIGINT');
  } else {
    output.write(data + '\n');
  }
});
