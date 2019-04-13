// @flow
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const ReactJssHmrPlugin = require('react-jss-hmr/webpack');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
    SERVER: false,
  }),
  new MiniCssExtractPlugin({
    filename: isDev ? '[name].css' : '[name]-[contenthash].css',
    chunkFilename: isDev ? '[id].css' : '[id]-[hash].css',
  }),
];

const rules = [
  {
    test: /\.jsx?$/,
    use: ['babel-loader'],
  },
  {
    test: /\.s?css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: isDev,
          reloadAll: true,
        },
      },
      { loader: 'css-loader' },
      { loader: 'postcss-loader' },
      {
        loader: 'sass-loader',
      },
    ],
  },
  {
    test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
    loader: 'url-loader?limit=8192',
  },
];

const optimization = {};

if (isDev) {
  rules[0].use.unshift('cache-loader');
} else {
  optimization.minimizer = [
    new TerserPlugin({
      parallel: true,
      extractComments: {
        condition: 'all',
        banner: () => '',
      },
    }),
    new OptimizeCSSAssetsPlugin({}),
  ];
  plugins.push(new StatsWriterPlugin());
}

module.exports = {
  optimization,
  plugins,
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-eval-source-map' : false,
  entry: {
    main: ['./src/client/index.jsx'],
  },
  resolve: {
    plugins: [new ReactJssHmrPlugin()],
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      'lodash-es$': 'lodash',
      AppState$: 'client/AppState',
      Abfahrten: 'client/Abfahrten',
      Routing: 'client/Routing',
      Common: 'client/Common',
    },
  },
  output: {
    path: path.resolve('dist/client/static'),
    filename: isDev ? '[name].js' : '[name]-[hash].js',
    publicPath: '/static/',
  },
  module: {
    rules,
  },
};
