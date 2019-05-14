// eslint-disable-next-line no-sync
const execSync = require('child_process').execSync;

execSync('webpack');
execSync('cp -r public/* dist/client/');
