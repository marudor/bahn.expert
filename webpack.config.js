// @flow
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PROD = process.env.NODE_ENV === 'production';

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'html-loader!src/index.html',
    minify: {},
  }),
];

function StyleLoader(prod, scss) {
  const loader = [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: true,
        importLoaders: scss ? 2 : 1,
        localIdentName: prod ? undefined : '[path][name]__[local]',
      },
    },
    'postcss-loader',
  ];

  if (scss) {
    loader.push('sass-loader');
  }

  if (prod) {
    loader.shift();

    return ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: loader,
    });
  }

  return loader;
}

if (PROD) {
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

  plugins.push(
    ...[
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false,
          },
          sourceMap: false,
        },
      }),
      new ExtractTextPlugin('[name]-[contenthash].css'),
    ]
  );
} else {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  const DashboardPlugin = require('webpack-dashboard/plugin');

  plugins.push(new DashboardPlugin());
  plugins.push(
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      defaultSizes: 'gzip',
    })
  );
}

module.exports = {
  plugins,
  entry: ['@babel/polyfill', 'index.jsx'],
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
      {
        test: /\.scss/,
        use: StyleLoader(PROD, true),
      },
      {
        test: /\.css$/,
        use: StyleLoader(PROD, false),
      },
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
