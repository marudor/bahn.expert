module.exports = {
  projects: ['test/client/jest.config.js', 'test/server/jest.config.js'],
  collectCoverage: Boolean(process.env.CI || process.env.COVERAGE),
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
  coverageReporters: ['text-summary', 'lcov'],
  coverageDirectory: '<rootDir>/reports',
  reporters: ['default', 'jest-junit'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
