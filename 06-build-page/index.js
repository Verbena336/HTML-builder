const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function copyHTML(input, projectDist) {
  await fs.promises.rm(projectDist, {recursive: true, force: true});
  await fs.promises.mkdir(projectDist, {recursive: true});

  await copyFolder(path.resolve(__dirname, 'assets'), path.resolve(__dirname, 'project-dist', 'assets'));
  await copyStyle(path.resolve(__dirname, 'styles'), path.resolve(__dirname, 'project-dist', 'style.css'));
  const htmlReadStream = fs.createReadStream(input);
  const htmlWriteStream = fs.createWriteStream(path.resolve(projectDist, 'index.html'));
  // let str = await new Promise((resolve) => htmlReadStream.on('data', (data) => {
  //   resolve(data.toString());
  // }));
  const stringify = readline.createInterface(htmlReadStream);
  for await (let str of stringify) {
    if(str.trim().startsWith('{{') && str.trim().endsWith('}}')) {
      const fileName = str.trim().slice(2, -2);
      let readStream;
      try {
        await fs.promises.access(path.resolve(__dirname, 'components', `${fileName}.html`), fs.constants.R_OK);
        readStream = fs.createReadStream(path.resolve(__dirname, 'components', `${fileName}.html`));
      } catch(err) {
        console.log(err.message);
        continue;
      }
      readStream.pipe(htmlWriteStream, {end: false});
      await new Promise(resolve => readStream.on('close', resolve));
      htmlWriteStream.write('\n');
    } else {
      htmlWriteStream.write(str + '\n');
    }
  }
}

async function copyStyle(input, bundle) {
  const output = fs.createWriteStream(bundle);
  let data;
  try {
    data = await fs.promises.readdir(input, {withFileTypes: true});
  } catch (err) {
    console.log(err.message);
    return;
  }
  for await (let file of data) {
    const filePath = path.resolve(input, file.name);
    if(file.isFile() && path.extname(filePath) === '.css') {
      const readStream = fs.createReadStream(path.resolve(input, file.name));
      readStream.pipe(output, {end: false});
      await new Promise(resolve => readStream.on('close', resolve));
      output.write('\n');
    }
  }
}

async function copyFolder(fromFolder, toFolder) {
  await fs.promises.mkdir(toFolder, {recursive: true}, (err) => {
    if (err) return console.log(err.message);
  });
  fs.readdir(fromFolder, {withFileTypes: true}, (err, files) => {
    if (err)
      console.log(err.message);
    else {
      files.forEach(file => {
        if(file.isFile()) {
          fs.copyFile(path.resolve(fromFolder, file.name), path.resolve(toFolder, file.name), (err) => {
            if(err) console.log(err.message);
          });
        } else if(file.isDirectory()) {
          try {
            copyFolder(path.resolve(fromFolder, file.name), path.resolve(toFolder, file.name));
          } catch(err) {
            console.log(err.message);
          }
        }
      });
    }
  });
}
 
try {
  copyHTML(path.resolve(__dirname, 'template.html'), path.resolve(__dirname, 'project-dist'));
} catch(err) {
  console.error(err.message);
}