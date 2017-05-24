// @flow
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'html-loader!src/index.html',
    minify: {},
  }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      screwIe8: true,
      sourceMap: false,
    })
  );
} else {
  plugins.push(new DashboardPlugin());
}

module.exports = {
  plugins,
  entry: ['babel-polyfill', 'index.jsx'],
  output: {
    filename: 'abfahrten-[hash].js',
    path: `${__dirname}/dist`,
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    extensions: ['.jsx', '.js', '.json'],
    modules: [path.resolve('src'), 'node_modules'],
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.jsx?$/,
        loader: 'eslint-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: /(.*\.config.*|.*node_modules.*|.*inferno.*)/,
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|primusClient)/,
        loader: 'babel-loader',
        query: { cacheDirectory: true },
      },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
  devServer: {
    overlay: true,
    clientLogLevel: 'none',
    compress: true,
    contentBase: 'dist/',
    historyApiFallback: true,
    noInfo: true,
    quiet: true,
    proxy: {
      '/api/*': {
        target: 'http://localhost:9042',
        toProxy: true,
        changeOrigin: true,
        xfwd: true,
        logLevel: 'silent',
        // pathRewrite: { '^/api': '' },
      },
    },
  },
};
