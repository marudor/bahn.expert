const path = require('node:path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
require('./scripts/adjustSwcrc.cjs');

const isDev = process.env.NODE_ENV !== 'production';

const plugins = [
	new LoadablePlugin(),
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify(
			process.env.NODE_ENV || 'development',
		),
	}),
];
const entry = ['./src/client/entry.ts'];

const targets = require('browserslist').loadConfig({
	path: __dirname,
});
const env = {
	mode: 'entry',
	targets: require('browserslist').loadConfig({
		path: __dirname,
	}),
	coreJs: '3.36',
};

if (!process.env.SKIP_OLD_BROWSER) {
	env.targets.push('ios 10');
}

const rules = [
	{
		test: /\.css$/,
		use: ['style-loader', 'css-loader'],
	},
	{
		test: /\.(t|j)sx?$/,
		use: [
			{
				loader: 'swc-loader',
				options: {
					parseMap: true,
					module: {
						type: 'es6',
					},
					env,
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
	plugins.push(
		new webpack.HotModuleReplacementPlugin(),
		new ReactRefreshWebpackPlugin(),
	);
	entry.push('webpack-hot-middleware/client');
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
	optimization.splitChunks = {
		cacheGroups: {
			vendor: {
				test: /[/\\]node_modules[/\\](axios|react|react-dom|react-router|react-router-dom|@mui|@emotion|downshift|date-fns)[/\\]/,
				name: 'vendor',
				chunks: 'all',
			},
		},
	};
	plugins.push(
		new CompressionPlugin({
			filename: '[path]/[base].br[query]',
			test: /\.(js|css|svg)$/,
			algorithm: 'brotliCompress',
			compressionOptions: { level: 11 },
			threshold: 0,
			minRatio: 1,
		}),
		new CompressionPlugin({
			filename: '[path]/[base].gz[query]',
			test: /\.(js|css|svg)$/,
			algorithm: 'gzip',
			threshold: 0,
			minRatio: 1,
		}),
	);
}

module.exports = {
	optimization,
	plugins,
	mode: isDev ? 'development' : 'production',
	devtool: isDev ? 'cheap-module-source-map' : 'source-map',
	entry,
	resolve: {
		modules: ['node_modules'],
		extensions: ['.ts', '.tsx', '.json', '.web.ts', '.js', '.jsx'],
		alias: {
			'lodash-es$': 'lodash',
		},
	},
	output: {
		path: path.resolve('dist/client'),
		filename: 'static/[contenthash].js',
		publicPath: '/',
	},
	module: {
		rules,
	},
	watchOptions: {
		ignored: /node_modules/,
	},
	experiments: {
		topLevelAwait: true,
	},
};
