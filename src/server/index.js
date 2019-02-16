// @flow
if (process.env.NODE_ENV !== 'production') {
  // $FlowFixMe
  const config = require('../../.babelrc.server');

  require('@babel/register')(config);
}

if (!process.env.BASE_URL) {
  throw new Error('Missing BASE_URL');
}

global.PROD = process.env.NODE_ENV === 'production';

require('./localStorageShim');
require('./app').default();
