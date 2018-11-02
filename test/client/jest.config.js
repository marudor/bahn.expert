module.exports = {
  globals: {},
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  setupTestFrameworkScriptFile: '<rootDir>/test/client/config.js',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/client/**/*.{js,jsx}'],
  coverageReporters: ['text-summary', 'lcov'],
  coverageDirectory: '<rootDir>/reports/client',
  rootDir: '../..',
  roots: ['<rootDir>/src', '<rootDir>/test/client'],
};
