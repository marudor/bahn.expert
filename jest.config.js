module.exports = {
  projects: ['src/client/jest.config.js', 'src/server/jest.config.js'],
  reporters: ['default', 'jest-junit'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
