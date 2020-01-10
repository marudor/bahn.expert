module.exports = {
  preset: '@testing-library/react-native',
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/../src/$1',
    '^shared/(.*)': '<rootDir>/../../shared/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native-community|react-native))',
  ],
  setupFiles: ['<rootDir>/setup.js'],
  // globalSetup: '<rootDir>/test/setTZ.ts',
  // setupFilesAfterEnv: ['<rootDir>/test/server/config.ts'],
};
