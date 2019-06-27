module.exports = {
  projects: [
    'test/client/jest.config.js',
    'test/server/jest.config.js',
    // 'test/e2e/jest.config.js',
  ],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
  coverageReporters: ['text-summary', 'lcov'],
  coverageDirectory: '<rootDir>/reports',
  reporters: ['default', 'jest-junit'],
};
