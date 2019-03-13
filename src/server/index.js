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
global.SERVER = true;

require('./localStorageShim');
require('./app').default();
