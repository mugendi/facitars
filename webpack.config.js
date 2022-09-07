const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = function (env, argv) {
	return {
		watch: !isProduction,

		entry: {
			[`facitars${isProduction ? '.min' : ''}`]: path.resolve(
				__dirname,
				'./src/facitars.js'
			),
		},

		module: {},

		resolve: {
			modules: [path.join(__dirname, 'node_modules')],
		},

		// Add an instance of the MiniCssExtractPlugin to the plugins list
		// But remember - only for production!
		plugins: isProduction
			? [
					new UglifyJsPlugin({
						sourceMap: false,

						uglifyOptions: {
							// Eliminate comments
							comments: false,
							mangle: true,

							// Compression specific options
							compress: {
								// remove warnings
								// warnings: false,
								// Drop console statements
								drop_console: true,
							},
						},
					}),
			  ]
			: [],

		output: {
			path: path.resolve(__dirname, 'dist'),
		},
	};
};
