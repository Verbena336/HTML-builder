const fs = require('fs');
const path = require('path');

async function copyStyle(input, bundle) {
  await fs.promises.rm(bundle, {recursive: true, force: true});
  const output = fs.createWriteStream(bundle);
  let data;
  try {
    data = await fs.promises.readdir(input, {withFileTypes: true});
  } catch (err) {
    console.log(err.message);
    return;
  }
  for(let file of data) {
    const filePath = path.resolve(input, file.name);
    if(file.isFile() && path.extname(filePath) === '.css') {
      const readStream = fs.createReadStream(path.resolve(input, file.name));
      readStream.pipe(output, {end: false});
      await new Promise(resolve => readStream.on('close', resolve));
      output.write('\n');
    }
  }
}

try {
  copyStyle(path.resolve(__dirname, 'styles'), path.resolve(__dirname, 'project-dist', 'bundle.css'));
} catch(err) {
  console.error(err.message);
}
