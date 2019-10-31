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
    '@loadable/babel-plugin',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    'babel-plugin-parameter-decorator',
    './scripts/babelTransform/debugStyleNames.js',
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
