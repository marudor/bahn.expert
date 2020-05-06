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
    'test-helper/setupClient.ts',
    '@testing-library/jest-dom/extend-expect',
  ],
};
