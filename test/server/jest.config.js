module.exports = {
  globals: {},
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  setupTestFrameworkScriptFile: '<rootDir>/test/server/config.js',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/server/**/*.{js,jsx}'],
  coveragePathIgnorePatterns: ['<rootDir>/src/server/testData/'],
  coverageReporters: ['text-summary', 'lcov'],
  coverageDirectory: '<rootDir>/reports/server',
  rootDir: '../..',
  roots: ['<rootDir>/src', '<rootDir>/test/server'],
  verbose: false,
};
