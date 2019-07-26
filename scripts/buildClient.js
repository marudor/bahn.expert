/* eslint no-sync: 0, no-console: 0, no-process-exit: 0 */
const execSync = require('child_process').execSync;

execSync('webpack');
execSync('cp -r public/* dist/client/');

require('./checkAssetFiles');
