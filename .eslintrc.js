module.exports = {
  root: true,
  extends: ['marudor'],
  env: { browser: true, node: true, es6: true },
  globals: { SERVER: false, M: false, MF: false },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
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
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['marudor/typescript'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
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
        'import/no-default-export': 2,
        'no-process-env': 2,
      },
    },
    {
      files: ['packages/server/**'],
      rules: {
        'no-restricted-imports': [
          2,
          {
            patterns: ['sbb/*', 'oebb/*'],
          },
        ],
      },
    },
  ],
};
