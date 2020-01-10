module.exports = {
  projects: [
    'test/client/jest.config.js',
    'test/server/jest.config.js',
    'src/app/test/jest.config.js',
  ],
  collectCoverage: Boolean(process.env.CI || process.env.COVERAGE),
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/app/**',
    '!<rootDir>/src/server/API/routes.ts',
    '!<rootDir>/src/types/**',
  ],
  coverageDirectory: '<rootDir>/jest-coverage',
  reporters: ['default', 'jest-junit'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
