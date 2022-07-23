/* eslint-disable unicorn/prefer-module */
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const webpack = require('@cypress/webpack-preprocessor');

// eslint-disable-next-line no-unused-vars
export default (on, config) => {
  const webpackOptions = {
    resolve: {
      extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(j|t)s$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader',
              options: {
                rootMode: 'upward',
              },
            },
          ],
        },
      ],
    },
  };

  /**
   * Workaround for the "Automatic publicPath is not supported in this browser" fail
   *
   * See https://github.com/cypress-io/cypress/issues/18435 for more
   * details. Should be removed when cypress switches to webpack 5.
   */
  const publicPath = ' ';
  let outputOptions;
  Object.defineProperty(webpackOptions, 'output', {
    get: () => {
      return { ...outputOptions, publicPath };
    },
    set: function (x) {
      outputOptions = x;
    },
  });

  on(
    'file:preprocessor',
    webpack({
      webpackOptions,
      typescript: require.resolve('typescript'),
    }),
  );
};
