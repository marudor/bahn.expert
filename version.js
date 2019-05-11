// eslint-disable-next-line no-sync
// const execSync = require('child_process').execSync;

// const getVersion = () => {
//   const gitRevCount = execSync('git rev-list --count --first-parent HEAD', {
//     encoding: 'utf8',
//   }).trim();

//   const version = Number.parseInt(gitRevCount, 10).toString(36);

//   return `${version}${process.env.NODE_ENV !== 'production' ? ' - dev' : ''}`;
// };

module.exports = process.env.CI_COMMIT_SHORT_SHA || 'dev';
