const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = process;
const readline = require('readline');

process.on('SIGINT', () => {
  console.log('Ввод завершен');
  exit(0);
});
process.on('error', error => console.log(error.message));
const pathText = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathText);
stdout.write('Привет, введите данные для записи\n');
const readLine = readline.createInterface(stdin);
readLine.on('line', (data) => {
  if(data === 'exit') {
    process.emit('SIGINT');
  } else {
    output.write(data + '\n');
  }
});


// const pathText = path.join(__dirname, 'text.txt');
// const output = fs.createWriteStream(pathText);
// stdout.write('Привет, введите данные для записи\n');
// stdin.on('data', data => {
//   const strData = data.toString().trim();
//   if(strData !== 'exit') {
//     output.write(data);
//   } else {
//     console.log('Ввод завершен');
//     exit();
//   }
// });
// process.on('SIGINT', () => {
//   console.log('Ввод завершен');
//   exit();
// });
// process.on('error', error => console.log(error.message));
