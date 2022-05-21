const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');
async function read(pathFolder) {
  const data = await fs.promises.readdir(pathFolder, {withFileTypes: true});
  for(let file of data) {
    if(file.isFile()) {
      const fileName = file.name;
      const filePath = path.join(folderPath, fileName);
      fs.stat(filePath, function(err,stats) {
        if (err) return err.message;
        const name = path.basename(filePath);
        const ext = path.extname(filePath);
        console.log(`${name.split('.')[0]} - ${ext.slice(1)} - ${(stats.size / 1024).toFixed(3)}kb`);
      });
    }
  }
}

try {
  read(folderPath);
} catch (error) {
  console.log(error.message);
}