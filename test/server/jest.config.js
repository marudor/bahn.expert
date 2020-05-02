module.exports = {
  globals: {
    PROD: true,
    TEST: true,
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  globalSetup: '<rootDir>/test/setTZ.ts',
  setupFilesAfterEnv: ['<rootDir>/test/server/config.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/testDist'],
  testPathIgnorePatterns: ['/src/app/', '/test/client/', '/cypress/'],
  rootDir: '../..',
};
