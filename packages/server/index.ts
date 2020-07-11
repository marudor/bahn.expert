global.M = require('react').createElement;
global.MF = require('react').Fragment;

global.PROD = process.env.NODE_ENV === 'production';
global.BASE_URL = `${
  global.PROD && !process.env.TEST_RUN ? 'https://' : 'http://'
}${process.env.BASE_URL || 'localhost:9042'}`;
global.SERVER = true;
global.IMPRINT = require('./imprint');
global.VERSION = require('./version').default;

require('./app').default();
