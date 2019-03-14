// @flow
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

const isDev = process.env.NODE_ENV !== 'production';

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new MiniCssExtractPlugin({
    filename: '[name]-[contenthash].css',
    chunkFilename: '[id]-[hash].css',
  }),
];

// const optimization = {
//   minimizer: [
//     new OptimizeCSSAssetsPlugin({
//       cssProcessor: require('cssnano'),
//       cssProcessorOptions: { discardComments: { removeAll: true } },
//     }),
//   ],
// };

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

if (isDev) {
  rules.forEach(r => r.use && r.use.unshift({ loader: 'cache-loader' }));
} else {
  plugins.push(
    new TerserPlugin({
      parallel: true,
      extractComments: {
        condition: 'all',
        banner: () => '',
      },
    })
  );
  plugins.push(
    new StatsWriterPlugin({
      filename: 'stats.json', // Default
    })
  );
}

module.exports = {
  plugins,
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-eval-source-map' : false,
  entry: {
    main: ['./src/client/index.jsx'],
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      'lodash-es': 'lodash',
      AppState: 'client/AppState',
    },
  },
  output: {
    path: path.resolve('dist/client/static'),
    filename: '[name]-[hash].js',
    publicPath: '/static/',
  },
  module: {
    rules,
  },
};
