module.exports = {
  extends: ['../.eslintrc.js'],
  globals: {
    nock: true,
  },
  env: {
    jest: true,
  },
  rules: {
    'jest/expect-expect': 0,
  },
};
