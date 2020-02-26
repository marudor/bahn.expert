module.exports = {
  root: true,
  extends: ['marudor'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    SERVER: false,
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
