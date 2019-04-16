module.exports = {
  globals: {},
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/test/client/config.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/client/**/*.{ts,tsx}'],
  coverageReporters: ['text-summary', 'lcov'],
  coverageDirectory: '<rootDir>/reports/client',
  rootDir: '../..',
  roots: ['<rootDir>/src', '<rootDir>/test/client'],
  verbose: false,
};
