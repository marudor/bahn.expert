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
      rules: {
        'no-use-before-define': 0,
        'no-unused-vars': 0,
        '@typescript-eslint/array-type': 2,
        'spaced-comment': 0,
      },
      plugins: ['@typescript-eslint'],
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      settings: {
        'import/resolver': {
          typescript: {},
        },
      },
      parserOptions: {
        sourceType: 'module',
        // project: './tsconfig.json',
        createDefaultProgram: true,
      },
    },
  ],
};
