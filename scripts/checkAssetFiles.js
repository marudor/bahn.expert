/* eslint-disable unicorn/prefer-module */
/* eslint no-sync: 0, no-console: 0 */
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('node:path');
const fs = require('node:fs');
const baseAssetPath = 'dist/client';
const stats = require(path.resolve(`${baseAssetPath}/loadable-stats.json`));

function checkFile(filePath) {
  const assetPath = path.resolve(baseAssetPath, filePath);

  if (!fs.existsSync(assetPath)) {
    console.error(`${assetPath} does not exist. Build failed`);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
}

for (const chunk of Object.keys(stats.assetsByChunkName)) {
  const chunkPath = stats.assetsByChunkName[chunk];

  if (Array.isArray(chunkPath)) {
    for (const chunk of chunkPath) {
      checkFile(chunk);
    }
  } else {
    checkFile(chunkPath);
  }
}
