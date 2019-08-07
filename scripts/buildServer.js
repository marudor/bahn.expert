// eslint-disable-next-line no-sync
const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');

const p1 = new Promise(resolve =>
  spawn(
    'babel',
    [
      'src',
      '-x',
      '.ts,.tsx,.js,.jsx',
      '--no-babelrc',
      '--config-file',
      './.babelrc.server.js',
      '--out-dir',
      'dist/server',
      '--copy-files',
    ],
    { stdio: 'pipe' }
  ).on('close', resolve)
);
const p2 = new Promise(resolve =>
  spawn(
    'babel',
    [
      'src',
      '-x',
      '.ts,.tsx,.js,.jsx',
      '--no-babelrc',
      '--config-file',
      './.babelrc.server.js',
      '--out-dir',
      'testDist/server',
      '--copy-files',
    ],
    {
      stdio: 'pipe',
      env: {
        ...process.env,
        BABEL_ENV: 'testProduction',
      },
    }
  ).on('close', resolve)
);

Promise.all([p1, p2]).then(([c1, c2]) => {
  if (c1 !== 0 || c2 !== 0) {
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
  const version = require('../version');

  // eslint-disable-next-line no-sync
  fs.writeFileSync(
    path.resolve('dist/server/server/version.js'),
    `module.exports="${version}"`
  );
  // eslint-disable-next-line no-sync
  fs.writeFileSync(
    path.resolve('testDist/server/server/version.js'),
    `module.exports="${version}"`
  );
});
