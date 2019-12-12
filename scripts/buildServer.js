// eslint-disable-next-line no-sync
const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');

const testOnly = Boolean(process.env.TEST_ONLY);
const productionOnly = Boolean(process.env.PROD_ONLY);

function buildTest() {
  return new Promise(resolve =>
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
}

function buildProd() {
  return new Promise(resolve =>
    spawn(
      'babel',
      [
        'src',
        '-x',
        '.ts,.tsx,.js,.jsx',
        '--no-babelrc',
        '--source-maps',
        '--config-file',
        './.babelrc.server.js',
        '--out-dir',
        'dist/server',
        '--copy-files',
      ],
      { stdio: 'pipe' }
    ).on('close', resolve)
  );
}

const prodPromise = testOnly ? Promise.resolve(0) : buildProd();
const testPromise = productionOnly ? Promise.resolve(0) : buildTest();

Promise.all([prodPromise, testPromise]).then(([c1, c2]) => {
  if (c1 !== 0 || c2 !== 0) {
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
  const version = require('../version');

  if (!testOnly) {
    // eslint-disable-next-line no-sync
    fs.writeFileSync(
      path.resolve('dist/server/server/version.js'),
      `module.exports="${version}"`
    );
  }
  if (!productionOnly) {
    // eslint-disable-next-line no-sync
    fs.writeFileSync(
      path.resolve('testDist/server/server/version.js'),
      `module.exports="${version}"`
    );
  }
});
