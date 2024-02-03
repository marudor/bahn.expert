/* eslint-disable unicorn/prefer-module */

module.exports = {
  projects: ['src/server/jest.config.json'],
  reporters: ['default'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
