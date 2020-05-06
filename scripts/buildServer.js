// eslint-disable-next-line no-sync
const spawn = require('child_process').spawn;
const rimraf = require('rimraf');
const fs = require('fs');
const SentryCli = require('@sentry/cli');
const sentryCli = new SentryCli();

const testOnly = Boolean(process.env.TEST_ONLY);
const productionOnly = Boolean(process.env.PROD_ONLY);

function buildTest() {
  return new Promise((resolve) =>
    spawn(
      'babel',
      [
        'src',
        '--out-dir',
        'testDist/server',
        '-x',
        '.ts,.tsx,.js,.jsx',
        '--root-mode',
        'upward',
        '--copy-files',
      ],
      {
        stdio: 'pipe',
        env: {
          ...process.env,
          BABEL_ENV: 'testProduction',
          SERVER: 1,
        },
      }
    ).on('close', (code) => {
      rimraf.sync('testDist/server/app');
      resolve(code);
    })
  );
}

function buildProd() {
  return new Promise((resolve) =>
    spawn(
      'babel',
      [
        'src',
        '--out-dir',
        'dist/server',
        '-x',
        '.ts,.tsx,.js,.jsx',
        '--source-maps',
        '--root-mode',
        'upward',
        '--copy-files',
      ],
      {
        stdio: 'pipe',
        env: {
          ...process.env,
          SERVER: 1,
        },
      }
    ).on('close', (code) => {
      if (code !== 0) {
        resolve(code);
      } else {
        sentryCli.releases
          .proposeVersion()
          .then((version) => {
            // eslint-disable-next-line no-sync
            fs.writeFileSync(
              'dist/server/server/version.js',
              `exports.__esModule=true;exports.default='${version.trim()}'`
            );
            resolve(code);
          })
          .catch(() => {
            resolve(100);
          });
      }
    })
  );
}

const prodPromise = testOnly ? Promise.resolve(0) : buildProd();
const testPromise = productionOnly ? Promise.resolve(0) : buildTest();

Promise.all([prodPromise, testPromise]).then(([c1, c2]) => {
  if (c1 !== 0 || c2 !== 0) {
    // eslint-disable-next-line no-process-exit
    process.exit(c1 || c2);
  }
});
