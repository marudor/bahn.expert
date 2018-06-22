// @flow
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'app/index.html'),
    minifiy: !isDev,
  }),
];

const optimization = {};

const rules = [
  {
    test: /\.jsx?$/,
    use: ['babel-loader'],
  },
  {
    test: /\.s?css$/,
    use: [
      {
        loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
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
} else {
  plugins.push(
    ...[
      new MiniCssExtractPlugin({
        filename: '[name]-[hash].css',
        chunkFilename: '[id]-[hash].css',
      }),
    ]
  );
  optimization.minimizer = [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      extractComments: true,
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
    }),
  ];
}

module.exports = {
  plugins,
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'source-map' : false,
  entry: './app/index.jsx',
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'app')],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      'lodash-es': 'lodash',
    },
  },
  output: {
    path: path.resolve('dist/client'),
    filename: '[name]-[hash].js',
    publicPath: '/',
  },
  module: {
    rules,
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist/client'),
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
