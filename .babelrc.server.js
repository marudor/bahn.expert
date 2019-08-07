module.exports = {
  comments: false,
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        loose: false,
        useBuiltIns: 'entry',
        modules: 'commonjs',
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
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
          testHelper: './test/client/testHelper',
          classnames: 'clsx',
        },
        resolvePath: (sourcePath, currentFile, opts) => {
          const path = require('babel-plugin-module-resolver').resolvePath(
            sourcePath.replace(/^(Abfahrten|Common|Routing)\//, 'client/$1/'),
            currentFile,
            opts
          );

          return path;
        },
      },
    ],
    [
      'transform-require-ignore',
      {
        extensions: ['.scss', '.css'],
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
  },
};
