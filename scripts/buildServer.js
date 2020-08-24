// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');
const fs = require('fs');
const SentryCli = require('@sentry/cli');
const sentryCli = new SentryCli();

function adjustVersion() {
  const versionPath = path.resolve(__dirname, '../packages/server/version.js');
  return new Promise((resolve) => {
    sentryCli.releases
      .proposeVersion()
      .then((version) => {
        // eslint-disable-next-line no-sync
        if (fs.existsSync(versionPath)) {
          // eslint-disable-next-line no-sync
          fs.writeFileSync(
            versionPath,
            `exports.__esModule=true;exports.default='${version.trim()}'`,
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
