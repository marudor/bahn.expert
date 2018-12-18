// @flow
if (process.env.NODE_ENV !== 'production') {
  // $FlowFixMe
  const config = require('../../.babelrc.server');

  require('@babel/register')(config);
}

require('./localStorageShim');
require('./app').default();
