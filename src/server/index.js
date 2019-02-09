// @flow
if (process.env.NODE_ENV !== 'production') {
  // $FlowFixMe
  const config = require('../../.babelrc.server');

  require('@babel/register')(config);
}

if (!process.env.BASE_URL) {
  throw new Error('Missing BASE_URL');
}

require('./localStorageShim');
require('./app').default();
