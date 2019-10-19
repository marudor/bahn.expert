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
  rules: {
    'require-atomic-updates': 0,
    'babel/object-curly-spacing': 0,
  },
  settings: {
    'import/resolver': 'webpack',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['marudor/typescript'],
    },
  ],
};
