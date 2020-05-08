module.exports = {
  globals: {
    PROD: true,
    TEST: true,
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  globalSetup: 'test-helper/setupGlobal.ts',
  setupFilesAfterEnv: [
    'test-helper/setupCommon.ts',
    './__tests__/setup.ts',
    '@testing-library/jest-dom/extend-expect',
  ],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
};
