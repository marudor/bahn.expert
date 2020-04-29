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
    M: false,
    MF: false,
  },
  settings: {
    'import/resolver': 'webpack',
  },
  rules: {
    'react/react-in-jsx-scope': 0,
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['marudor/typescript'],
    },
  ],
};
