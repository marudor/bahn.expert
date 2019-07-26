/* eslint no-sync: 0, no-console: 0, no-process-exit: 0 */
const path = require('path');
const fs = require('fs');
const stats = require(path.resolve('dist/client/static/stats.json'));

Object.keys(stats.assetsByChunkName).forEach(chunk => {
  const assetPath = path.resolve('dist/client', stats.assetsByChunkName[chunk]);

  if (!fs.existsSync(assetPath)) {
    console.error(`${assetPath} does not exist. Build failed`);
    process.exit(1);
  }
});

console.log(stats.assetsByChunkName);
