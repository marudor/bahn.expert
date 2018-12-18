// @flow
// eslint-disable-next-line no-sync
const execSync = require('child_process').execSync;

execSync('webpack');
execSync('cp public/* dist/client/');
