module.exports = {
  projects: [
    'packages/client/jest.config.json',
    'packages/server/jest.config.json',
  ],
  reporters: ['default'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
