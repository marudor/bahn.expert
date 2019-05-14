const { overrides, ...TestConfig } = require('./.babelrc.server.js');

module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        loose: false,
        useBuiltIns: 'entry',
        modules: false,
        corejs: 3,
      },
    ],
    '@babel/preset-react',
    'babel-preset-joblift',
  ],
  plugins: [
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
