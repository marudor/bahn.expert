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
