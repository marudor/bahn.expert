module.exports = {
  presets: [
    [
      'env',
      {
        loose: true,
        useBuiltIns: 'entry',
        modules: false,
      },
    ],
    'react',
    // 'flow',
    'stage-1',
  ],
  plugins: [
    'transform-flow-strip-types',
    'transform-class-properties',
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
      plugins: ['transform-react-jsx-source',  'transform-dev-warning'],
    },
    production: {
      compact: true,
      plugins: ['transform-react-constant-elements'],
    },
  },
};
