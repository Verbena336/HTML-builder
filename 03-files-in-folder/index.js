const fs = require('fs');
const path = require('path');

async function read(pathFolder) {
  let data;
  try {
    data = await fs.promises.readdir(pathFolder, {withFileTypes: true});
  } catch (err) {
    console.log(err.message);
    return;
  }
  for(let file of data) {
    if(file.isFile()) {
      const fileName = file.name;
      const filePath = path.resolve(pathFolder, fileName);
      fs.stat(filePath, function(err,stats) {
        if (err) return err.message;
        const ext = path.extname(filePath);
        const size = (stats.size / 1024).toFixed(3);
        console.log(`${fileName.split('.')[0]} - ${ext.slice(1)} - ${size}kb`);
      });
    }
  }
}

try {
  read(path.resolve(__dirname, 'secret-folder'));
} catch (error) {
  console.log(error.message);
}