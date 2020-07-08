/* eslint-disable no-process-env */
/* eslint-disable no-console */
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

global.M = require('react').createElement;
global.MF = require('react').Fragment;

console.log('global.PROD', global.PROD);
console.log('global.TEST', global.TEST);
console.log('global.SERVER', global.SERVER);
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

require('./index');
