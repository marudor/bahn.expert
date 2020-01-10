module.exports = {
  extends: ['../../.eslintrc.js', '@react-native-community'],
  globals: {
    globalThis: false,
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['marudor/typescript'],
    },
  ],
};
