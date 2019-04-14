module.exports = {
  extends: [
    'joblift/base',
    'joblift/react',
    'joblift/sort-imports',
    'joblift/flowtype',
  ],
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
  rules: {
    'no-use-before-define': 0,
    'no-shadow': 0,
    'import/no-unresolved': 2,
  },
  settings: {
    'import/resolver': 'webpack',
  },
  overrides: [
    {
      rules: {
        'no-unused-vars': 0,
      },
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: './',
      },
    },
  ],
};
