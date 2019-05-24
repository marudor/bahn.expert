if (!process.env.BASE_URL) {
  throw new Error('Missing BASE_URL');
}

global.PROD = process.env.NODE_ENV === 'production';
global.SERVER = true;
global.VERSION = require('./version');
global.IMPRINT = require('./imprint');

require('./app').default();
