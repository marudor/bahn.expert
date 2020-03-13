process.env.BASE_URL = process.env.BASE_URL || 'localhost:9042';
global.PROD = process.env.NODE_ENV === 'production';
global.SERVER = true;
global.IMPRINT = require('./imprint');

require('./app').default();
