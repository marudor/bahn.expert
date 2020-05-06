module.exports = {
  globals: {
    PROD: true,
    TEST: true,
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  globalSetup: 'test-helper/setupGlobal.ts',
  setupFilesAfterEnv: ['test-helper/setupServer.ts'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
};
