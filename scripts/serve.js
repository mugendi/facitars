const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };

// Serve only the playground and its built assets on loopback.
const server = http.createServer(async (req, res) => {
	let pathname;
	try { pathname = new URL(req.url, 'http://localhost').pathname; }
	catch { res.writeHead(400).end('Invalid URL'); return; }
	const files = {
		'/': 'examples/index.html',
		'/examples/index.html': 'examples/index.html',
		'/examples/playground.css': 'examples/playground.css',
		'/examples/playground.js': 'examples/playground.js',
		'/dist/facitars.min.js': 'dist/facitars.min.js',
	};
	if (!Object.hasOwn(files, pathname)) { res.writeHead(404).end('Not found'); return; }
	try {
		const file = files[pathname];
		res.writeHead(200, { 'Content-Type': `${types[path.extname(file)]}; charset=utf-8` });
		res.end(await fs.readFile(path.join(root, file)));
	} catch {
		res.writeHead(500).end('File unavailable. Run npm run build first.');
	}
});
server.listen(3033, '127.0.0.1', () => console.log('Facitars playground: http://127.0.0.1:3033'));
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
