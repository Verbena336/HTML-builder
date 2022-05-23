const fs = require('fs');
const path = require('path');

async function copyFolder(fromFolder, toFolder) {
  await fs.promises.rm(toFolder, {recursive: true, force: true});
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
            copyFolder(path.join(fromFolder, file.name), path.join(toFolder, file.name));
          } catch(err) {
            console.log(err.message);
          }
        }
      });
    }
  });
}

try {
  copyFolder(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
} catch(err) {
  console.log(err.message);
}