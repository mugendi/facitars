const path = require('node:path');

module.exports = (_, argv) => ({
	entry: './src/facitars.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: argv.mode === 'production' ? 'facitars.min.js' : 'facitars.js',
		library: { name: 'Facitars', type: 'umd' },
		globalObject: 'globalThis',
	},
	// seed-color uses only the default generator; omit seedrandom's unused algorithms.
	resolve: {
		// Build from source; browser consumers resolve to the prebuilt renderer.
		aliasFields: [],
		alias: { 'seedrandom$': require.resolve('seedrandom/seedrandom') },
		fallback: { crypto: false },
	},
	devtool: false,
});
