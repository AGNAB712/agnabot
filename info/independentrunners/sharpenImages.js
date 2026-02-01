const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFolder = './images/fishing/artifacts';
const outputFolder = './images/fishing/artifacts1';

fs.readdirSync(inputFolder).forEach((file) => {
  if (file.endsWith('.jpg') || file.endsWith('.png')) {
    const inputPath = path.join(inputFolder, file);
    const outputPath = path.join(outputFolder, file);

    sharp(inputPath)
      .resize(100, 100, { kernel: sharp.kernel.nearest })
      .toFile(outputPath, (err, info) => {
        if (err) {
          console.error(`Error processing ${inputPath}: ${err.message}`);
        } else {
          console.log(`Processed ${inputPath} to ${outputPath}`);
        }
      });
  }
});