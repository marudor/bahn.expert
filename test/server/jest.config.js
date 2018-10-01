module.exports = {
  globals: {},
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  reporters: ['jest-dot-reporter'],
  setupTestFrameworkScriptFile: '<rootDir>/test/server/config.js',
  collectCoverage: !!process.env.COVERAGE,
  collectCoverageFrom: ['<rootDir>/src/server/**/*.{js,jsx}'],
  coverageReporters: ['lcov', 'cobertura'],
  coverageDirectory: '<rootDir>/reports/server',
  rootDir: '../..',
  roots: ['<rootDir>/src', '<rootDir>/test/server'],
};
