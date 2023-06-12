/* eslint no-sync: 0, no-console: 0, unicorn/no-process-exit: 0 */
const childProcess = require('node:child_process');
const ncp = require('ncp');

const webpackProductionProcess = childProcess.spawn('webpack', [], {
  env: {
    ...process.env,
  },
});

webpackProductionProcess.stdout.pipe(process.stdout);
webpackProductionProcess.stderr.pipe(process.stderr);

webpackProductionProcess.on('close', (code) => {
  if (code !== 0) {
    process.exit(code);
  }
  ncp('public/', 'dist/client/');
  require('./checkAssetFiles');
});
