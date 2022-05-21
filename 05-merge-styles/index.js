const fs = require('fs');
const path = require('path');

async function copyStyle() {
  await fs.promises.rm(path.resolve(__dirname, 'project-dist', 'bundle.css'), {recursive: true, force: true});
  const outputPath = path.resolve(__dirname, 'project-dist', 'bundle.css');
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

try {
  copyStyle();
} catch(err) {
  console.error(err);
}
