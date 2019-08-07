const { env, ...TestConfig } = require('./.babelrc.server.js');

module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        loose: false,
        useBuiltIns: 'usage',
        modules: false,
        corejs: 3,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    './scripts/babelTransform/debugStyleNames.js',
    'babel-plugin-idx',
    'lodash',
    [
      'module-resolver',
      {
        root: 'src',
      },
    ],
  ],
  env: {
    testProduction: {
      compact: true,
      plugins: ['@babel/plugin-transform-react-constant-elements'],
    },
    production: {
      compact: true,
      plugins: [
        '@babel/plugin-transform-react-constant-elements',
        'babel-plugin-jsx-remove-data-test-id',
      ],
    },
    test: TestConfig,
  },
};
