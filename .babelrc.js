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
    '@babel/preset-stage-1',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    'lodash',
    'transform-decorators-legacy',
    [
      'module-resolver',
      {
        root: 'src',
      },
    ],
  ],
  env: {
    development: {
      plugins: ['@babel/plugin-transform-react-jsx-source', 'flow-react-proptypes', 'transform-dev-warning'],
    },
    production: {
      compact: true,
      plugins: ['@babel/plugin-transform-react-constant-elements'],
    },
  },
};
