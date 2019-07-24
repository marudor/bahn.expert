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
    production: {
      compact: true,
      plugins: ['@babel/plugin-transform-react-constant-elements'],
    },
    test: TestConfig,
  },
};
