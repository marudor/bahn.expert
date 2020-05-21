module.exports = {
  root: true,
  extends: ['marudor'],
  env: { browser: true, node: true, es6: true },
  globals: { SERVER: false, M: false, MF: false },
  settings: {
    'import/resolver': 'webpack',
    react: { version: 'detect' },
  },
  rules: {
    'prettier/prettier': 0,
    'react/react-in-jsx-scope': 0,
    'require-await': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/__tests__/**',
          '**/webpackDev.ts',
          './scripts/**',
          './webpack.config.js',
          './cypress/**',
        ],
      },
    ],
  },
  overrides: [
    { files: ['**/*.ts', '**/*.tsx'], extends: ['marudor/typescript'] },
    {
      files: ['**/__tests__/**'],
      globals: { nock: true },
      env: { jest: true },
    },
    {
      files: ['packages/client/**'],
      globals: {
        TEST: false,
      },
      rules: {
        'no-process-env': 2,
      },
    },
  ],
};
