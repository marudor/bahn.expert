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
    'require-await': 0,
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.js', '**/*.spec.js'] },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['marudor/typescript'],
    },
    {
      files: ['**/__tests__/**'],
      globals: {
        nock: true,
      },
      env: {
        jest: true,
      },
    },
  ],
};
