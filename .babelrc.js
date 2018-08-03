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
        root: 'app',
      },
    ],
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
