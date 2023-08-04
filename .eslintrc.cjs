module.exports = {
  root: true,
  extends: ['marudor'],
  env: { browser: true, node: true, es6: true },
  globals: { SERVER: false, M: false, MF: false },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
    react: { version: 'detect' },
  },
  rules: {
    'react/no-unknown-property': [2, { ignore: ['css'] }],
    'prettier/prettier': 0,
    'react/react-in-jsx-scope': 0,
    'require-await': 0,
    'testing-library/no-debug': 0,
    // 'react-hooks/exhaustive-deps': 0,
    'testing-library/no-debugging-utils': 0,
    'no-console': 2,
    'unicorn/filename-case': 0,
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
      rules: {
        '@typescript-eslint/no-unsafe-argument': 0,
        '@typescript-eslint/no-misused-promises': 0,

        '@typescript-eslint/prefer-nullish-coalescing': 0,
        '@typescript-eslint/ban-tslint-comment': 0,
      },
    },
    {
      files: ['**/__tests__/**'],
      globals: { nock: true },
      env: { jest: true },
    },
    {
      files: ['src/client/**'],
      globals: {
        TEST: false,
      },
      rules: {
        // 'unicorn/no-array-for-each': 0,
        'import/no-default-export': 2,
        'no-restricted-imports': [
          'error',
          {
            patterns: ['@/server/*'],
          },
        ],
        'no-process-env': 2,
      },
    },
  ],
};
