// eslint-disable-next-line no-sync
const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');

execSync(
  'babel src -x ".ts,.tsx,.js,.jsx" --no-babelrc --config-file ./.babelrc.server.js --out-dir dist/server --copy-files'
);

const version = require('../version');

// eslint-disable-next-line no-sync
fs.writeFileSync(
  path.resolve('dist/server/server/version.js'),
  `module.exports="${version}"`
);
