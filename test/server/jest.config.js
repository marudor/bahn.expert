module.exports = {
  globals: {},
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/test/server/config.js'],
  // collectCoverage: true,
  // collectCoverageFrom: ['<rootDir>/src/server/**/*.{js,jsx}'],
  // coveragePathIgnorePatterns: ['<rootDir>/src/server/testData/', '<rootDir>/src/server/index.js'],
  // coverageReporters: ['text-summary', 'lcov'],
  // coverageDirectory: '<rootDir>/reports/server',
  rootDir: '../..',
  roots: ['<rootDir>/src', '<rootDir>/test/server'],
  // verbose: false,
};
