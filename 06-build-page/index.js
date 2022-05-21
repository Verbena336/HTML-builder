const fs = require('fs');
const path = require('path');

async function copyHTML() {
  await fs.promises.rm(path.resolve(__dirname, 'project-dist', 'index.html'), {recursive: true, force: true});
  fs.mkdir(path.resolve(__dirname, 'project-dist'), {recursive: true}, (err) => {
    if (err) return console.error(err);
  });
  const htmlReadStream = fs.createReadStream(path.resolve(__dirname, 'template.html'));
  const htmlWriteStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'index.html'));
  let str = await stringifyTemplate(htmlReadStream);
  const htmlArray = str.split('\n');
  for(let str of htmlArray) {
    if(str.trim().startsWith('{{') && str.trim().endsWith('}}')) {
      console.log(str.trim().slice(2, -2));
      const fileName = str.trim().slice(2, -2);
      await asyncPipe(fs.createReadStream(path.resolve(__dirname, 'components', `${fileName}.html`)), htmlWriteStream);
      htmlWriteStream.write('\n');
    } else {
      htmlWriteStream.write(str);
    }
  }
}

const stringifyTemplate = async (htmlStream) => {
  return new Promise((resolve) => htmlStream.on('data', (data) => {
    resolve(data.toString());
  }));
};

async function copyStyle() {
  await fs.promises.rm(path.resolve(__dirname, 'project-dist', 'style.css'), {recursive: true, force: true});
  const outputPath = path.resolve(__dirname, 'project-dist', 'style.css');
  const output = fs.createWriteStream(outputPath);
  const inputPath = path.resolve(__dirname, 'styles');
  const data = await fs.promises.readdir(inputPath, {withFileTypes: true});
  for(let file of data) {
    const filePath = path.resolve(inputPath, file.name);
    if(file.isFile() && path.extname(filePath) === '.css') {
      await asyncPipe(fs.createReadStream(path.resolve(inputPath, file.name)), output);
      output.write('\n');
    }
  }
}

const asyncPipe = (rs, ws) => {
  rs.pipe(ws, {end: false});
  return new Promise(resolve => rs.on('end', resolve));
};

async function copyFolder(fromFolder, toFolder) {
  await fs.promises.rm(toFolder, {recursive: true, force: true});
  fs.mkdir(toFolder, {recursive: true}, (err) => {
    if (err) return console.error(err);
  });
  fs.readdir(fromFolder, {withFileTypes: true}, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if(file.isFile()) {
          fs.createReadStream(path.resolve(fromFolder, file.name)).pipe(fs.createWriteStream(path.resolve(toFolder, file.name)));
        } else if(file.isDirectory()) {
          try {
            copyFolder(path.join(fromFolder, file.name), path.join(toFolder, file.name));
          } catch(err) {
            console.error(err);
          }
        }
      });
    }
  });
}
 
try {
  copyHTML();
  copyFolder(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
  copyStyle();
} catch(err) {
  console.error(err);
}