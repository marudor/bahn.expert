module.exports = {
  extends: ['marudor'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    PROD: false,
    SERVER: false,
  },
  rules: {},
  settings: {
    'import/resolver': 'webpack',
  },
};
