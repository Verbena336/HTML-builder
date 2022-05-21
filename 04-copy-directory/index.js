const fs = require('fs');
const path = require('path');

async function copyFolder() {
  await fs.promises.rm(path.join(__dirname, 'files-copy'), {recursive: true, force: true});
  fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, (err) => {
    if (err) return console.error(err);
  });
  const inputPath = path.join(__dirname, 'files');
  fs.readdir(inputPath, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        fs.createReadStream(path.resolve(__dirname, 'files', file)).pipe(fs.createWriteStream(path.resolve(__dirname, 'files-copy', file)));
      });
    }
  });
}

try {
  copyFolder();
} catch(err) {
  console.error(err);
}