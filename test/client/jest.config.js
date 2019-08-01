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
  setupFilesAfterEnv: ['<rootDir>/test/client/config.ts'],
  rootDir: '../..',
  roots: ['<rootDir>/src', '<rootDir>/test/client'],
};
