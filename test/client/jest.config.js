module.exports = {
  globals: {
    PROD: true,
    TEST: true,
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
    '^Test/(.*)': '<rootDir>/test/$1',
  },
  globalSetup: '<rootDir>/test/setTZ.ts',
  setupFilesAfterEnv: [
    '<rootDir>/test/client/config.ts',
    '@testing-library/jest-dom/extend-expect',
  ],
  testPathIgnorePatterns: ['/src/app/', '/test/server/', '/cypress/'],
  rootDir: '../..',
};
