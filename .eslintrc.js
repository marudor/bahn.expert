module.exports = {
  extends: ['marudor'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    SERVER: false,
  },
  rules: {},
  settings: {
    'import/resolver': 'webpack',
  },
  overrides: require('eslint-config-marudor/typescript').overrides,
};
