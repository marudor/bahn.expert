/* eslint no-console: 0 */
const config = require('./.babelrc.server');

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  ...config,
});
global.PROD = false;

const search = require('./src/server/Search/OpenDataOffline').default;
const searchTerm = process.argv[2];

search(searchTerm).then((stations) => {
  if (!stations.length) {
    console.error(`${searchTerm} is not a valid station`);
  } else {
    const first = stations[0];

    console.warn(first.title);
    console.log(first.id);
  }
});
