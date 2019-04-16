module.exports = {
  globals: {},
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/test/server/config.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/server/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/server/testData/',
    '<rootDir>/src/server/index.ts',
  ],
  coverageReporters: ['text-summary', 'lcov'],
  coverageDirectory: '<rootDir>/reports/server',
  rootDir: '../..',
  roots: ['<rootDir>/src', '<rootDir>/test/server'],
  verbose: false,
};
