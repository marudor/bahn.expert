module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        useBuiltIns: 'entry',
        modules: false,
      },
    ],
    '@babel/preset-react',
    '@babel/preset-flow',
  ],
  plugins: [
    'lodash',
    [
      'module-resolver',
      {
        root: 'app',
      },
    ],

    '@babel/plugin-proposal-export-default-from',
    ['@babel/plugin-proposal-optional-chaining', { loose: false }],
    ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: false }],

    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-export-namespace-from',

    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    '@babel/plugin-proposal-json-strings',
  ],
  env: {
    development: {
      plugins: ['@babel/plugin-transform-react-jsx-source'],
    },
    production: {
      compact: true,
      plugins: ['@babel/plugin-transform-react-constant-elements'],
    },
  },
};
