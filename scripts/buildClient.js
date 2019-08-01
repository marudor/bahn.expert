/* eslint no-sync: 0, no-console: 0, no-process-exit: 0 */
const childProcess = require('child_process');

const webpackProcess = childProcess.spawn('webpack', [], {
  env: process.env,
});

webpackProcess.stdout.pipe(process.stdout);
webpackProcess.stderr.pipe(process.stderr);

webpackProcess.on('close', code => {
  if (code !== 0) {
    process.exit(code);
  }
  childProcess.spawnSync('cp', ['-r', 'public/*', 'dist/client/']);
  require('./checkAssetFiles');
});
