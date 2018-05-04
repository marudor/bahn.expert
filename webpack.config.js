// @flow
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV !== 'production';

const plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/index.html'),
    minifiy: !isDev,
  }),
];

if (isDev) {
  plugins.push(...[new HardSourceWebpackPlugin(), new webpack.HotModuleReplacementPlugin()]);
}

module.exports = {
  plugins,
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'source-map' : false,
  entry: './src/index.jsx',
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    extensions: ['.js', '.json', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader',
          },
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      },
    ],
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
