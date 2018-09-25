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
    'babel-preset-joblift',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: 'src',
      },
    ],
  ],
};
