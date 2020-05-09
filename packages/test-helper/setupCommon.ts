// Custom React setup
global.M = require('react').createElement;
global.MF = require('react').Fragment;

// eslint-disable-next-line jest/no-standalone-expect
expect(new Date().getTimezoneOffset()).toBe(0);
