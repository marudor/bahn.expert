// @flow
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV !== 'production';

const plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/index.html'),
    minifiy: !isDev,
  }),
];

const rules = [
  {
    test: /\.jsx?$/,
    use: ['cache-loader', 'babel-loader'],
  },
  {
    test: /\.s?css$/,
    use: [
      { loader: 'cache-loader' },
      {
        loader: 'style-loader',
      },
      { loader: 'css-loader' },
      { loader: 'postcss-loader' },
      { loader: 'sass-loader' },
    ],
  },
];

if (isDev) {
  plugins.push(...[new webpack.HotModuleReplacementPlugin()]);

  rules.forEach(r => r.use.unshift({ loader: 'cache-loader' }));
}

module.exports = {
  plugins,
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'source-map' : false,
  entry: './src/index.jsx',
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      'lodash-es': 'lodash',
    },
  },
  module: {
    rules,
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    historyApiFallback: true,
    inline: true,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9042',
      },
    },
  },
};
