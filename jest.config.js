module.exports = {
  projects: ['src/client/jest.config.json', 'src/server/jest.config.json'],
  reporters: ['default'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
