/* eslint no-sync: 0, no-console: 0, no-process-exit: 0 */
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');
const fs = require('fs');
const stats = require(path.resolve('dist/client/loadable-stats.json'));

function checkFile(filePath) {
  const assetPath = path.resolve('dist/client', filePath);

  if (!fs.existsSync(assetPath)) {
    console.error(`${assetPath} does not exist. Build failed`);
    process.exit(1);
  }
}

Object.keys(stats.assetsByChunkName).forEach((chunk) => {
  const chunkPath = stats.assetsByChunkName[chunk];

  if (Array.isArray(chunkPath)) {
    chunkPath.forEach(checkFile);
  } else {
    checkFile(chunkPath);
  }
});
