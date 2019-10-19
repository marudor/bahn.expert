/* eslint no-sync: 0, no-console: 0, no-process-exit: 0 */
const childProcess = require('child_process');
const ncp = require('ncp');

const testOnly = Boolean(process.env.TEST_ONLY);

if (!testOnly) {
  const webpackProductionProcess = childProcess.spawn('webpack', [], {
    env: process.env,
  });

  webpackProductionProcess.stdout.pipe(process.stdout);
  webpackProductionProcess.stderr.pipe(process.stderr);

  webpackProductionProcess.on('close', code => {
    if (code !== 0) {
      process.exit(code);
    }
    ncp('public/', 'dist/client/');
    require('./checkAssetFiles');
  });
}

const webpackTestProductionProcess = childProcess.spawn('webpack', [], {
  env: {
    ...process.env,
    BABEL_ENV: 'testProduction',
  },
});

webpackTestProductionProcess.on('close', code => {
  if (code !== 0) {
    process.exit(code);
  }
  ncp('public/', 'testDist/client/');
});
