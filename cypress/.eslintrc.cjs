module.exports = {
  extends: ['../.eslintrc.cjs', 'plugin:cypress/recommended'],
  env: {
    'cypress/globals': true,
  },
  plugins: ['cypress'],
  rules: {
    // cypress has assertions without expect
    'jest/expect-expect': 0,
    'testing-library/await-async-query': 0,
    'testing-library/prefer-screen-queries': 0,
    'testing-library/await-async-utils': 0,
  },
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
