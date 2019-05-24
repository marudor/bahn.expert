const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

const runtimeCaching = [
  {
    urlPattern: '/',
    handler: 'NetworkFirst',
  },
  {
    urlPattern: /api\/station\/.*/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'stationSearch',
    },
  },
];

if (isDev) {
  runtimeCaching.push({
    urlPattern: /api\/.*/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'development',
      networkTimeoutSeconds: 7,
    },
  });
}

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
    SERVER: false,
    VERSION: JSON.stringify(require('./version')),
  }),
  new MiniCssExtractPlugin({
    filename: isDev ? '[name].css' : '[name]-[contenthash].css',
    chunkFilename: isDev ? '[id].css' : '[id]-[hash].css',
  }),
  new WorkboxPlugin.GenerateSW({
    swDest: 'sw.js',
    runtimeCaching,
    clientsClaim: true,
    skipWaiting: true,
  }),
];

const rules = [
  {
    test: /\.(t|j)sx?$/,
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
  plugins.push(
    new StatsWriterPlugin({
      filename: 'static/stats.json',
    })
  );
}

module.exports = {
  optimization,
  plugins,
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-eval-source-map' : false,
  entry: {
    main: ['./src/client/entry.ts'],
  },
  resolve: {
    // plugins: [new ReactJssHmrPlugin()],
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    alias: {
      'lodash-es$': 'lodash',
      Abfahrten: 'client/Abfahrten',
      Routing: 'client/Routing',
      Common: 'client/Common',
      testHelper$: '../test/client/testHelper',
    },
  },
  output: {
    path: path.resolve('dist/client'),
    filename: isDev ? 'static/[name].js' : 'static/[name]-[hash].js',
    publicPath: '/',
  },
  module: {
    rules,
  },
};
