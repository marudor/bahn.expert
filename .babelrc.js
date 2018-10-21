const TestConfig = require('./.babelrc.server.js');

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
    'babel-preset-joblift',
  ],
  plugins: [
    'lodash',
    [
      'module-resolver',
      {
        root: 'src'
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
