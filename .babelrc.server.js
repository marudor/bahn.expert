// @flow
module.exports = {
  comments: false,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10',
        },
        loose: true,
        useBuiltIns: 'entry',
        modules: 'commonjs',
      },
    ],
    '@babel/preset-flow',
    [
      '@babel/preset-stage-1',
      {
        decoratorsLegacy: true,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    [
      'module-resolver',
      {
        root: 'app',
      },
    ],
  ],
};
