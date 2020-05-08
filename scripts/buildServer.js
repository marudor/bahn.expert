const fs = require('fs');
const SentryCli = require('@sentry/cli');
const sentryCli = new SentryCli();

function adjustVersion() {
  return new Promise((resolve) => {
    sentryCli.releases
      .proposeVersion()
      .then((version) => {
        // eslint-disable-next-line no-sync
        if (fs.existsSync('packages/server/version.js')) {
          // eslint-disable-next-line no-sync
          fs.writeFileSync(
            'packages/server/version.js',
            `exports.__esModule=true;exports.default='${version.trim()}'`
          );
        }
        resolve(0);
      })
      .catch(() => {
        resolve(100);
      });
  });
}

adjustVersion();
