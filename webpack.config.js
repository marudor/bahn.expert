const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

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
  new LoadablePlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'global.PROD': JSON.stringify(!isDev),
    'global.TEST': JSON.stringify(process.env.NODE_ENV === 'test'),
    'global.SERVER': JSON.stringify(false),
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
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  },
  {
    test: /\.(t|j)sx?$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          configFile: false,
        },
      },
    ],
  },
  {
    test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
    loader: 'url-loader',
    options: {
      limit: 8192,
    },
  },
];

const optimization = {};

if (isDev) {
  if (process.env.BABEL_ENV !== 'testProduction') {
    rules[0].use.unshift('cache-loader');
    plugins.push(new ErrorOverlayPlugin());
  }
} else {
  optimization.minimizer = [
    new TerserPlugin({
      parallel: true,
      extractComments: {
        condition: 'all',
        banner: () => '',
      },
    }),
  ];
  // optimization.splitChunks = {
  //   minSize: 30000,
  //   cacheGroups: {
  //     vendor: {
  //       test: /[\\/]node_modules[\\/](react|react-dom|react-router|core-js|@material-ui)[\\/]/,
  //       name: 'vendor',
  //       chunks: 'all',
  //     },
  //   },
  // };
  plugins.push(
    ...[
      new CompressionPlugin({
        filename: '[path].br[query]',
        test: /\.(js|css|svg)$/,
        algorithm: 'brotliCompress',
        compressionOptions: { level: 11 },
        threshold: 0,
        minRatio: 1,
      }),
      new CompressionPlugin({
        filename: '[path].gz[query]',
        test: /\.(js|css|svg)$/,
        algorithm: 'gzip',
        threshold: 0,
        minRatio: 1,
      }),
    ]
  );
}

module.exports = {
  optimization,
  plugins,
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-source-map' : false,
  entry: ['./src/client/entry.ts'],
  resolve: {
    // plugins: [new ReactJssHmrPlugin()],
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    extensions: ['.js', '.json', '.web.ts', '.jsx', '.ts', '.tsx'],
    alias: {
      classnames$: 'clsx',
      'lodash-es$': 'lodash',
      Abfahrten: 'client/Abfahrten',
      Routing: 'client/Routing',
      Common: 'client/Common',
      testHelper$: '../test/client/testHelper',
    },
  },
  output: {
    path: path.resolve(
      process.env.BABEL_ENV === 'testProduction'
        ? 'testDist/client'
        : 'dist/client'
    ),
    filename: isDev ? 'static/[name].js' : 'static/[contenthash].js',
    publicPath: '/',
  },
  module: {
    rules,
  },
};
