module.exports = {
  extends: ['../.eslintrc.js', 'plugin:cypress/recommended'],
  env: {
    'cypress/globals': true,
  },
  plugins: ['cypress'],
  rules: {
    // cypress has assertions without expect
    'jest/expect-expect': 0,
  },
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
