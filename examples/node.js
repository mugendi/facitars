const Facitars = require('..').node();
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
	const seed = process.argv[2] || 'Anthony Mugendi';
	const { svg, color } = await new Facitars().generate(seed, 160);
	await fs.writeFile(path.join(__dirname, 'test.svg'), svg);
	console.log(`Generated examples/test.svg for ${JSON.stringify(seed)}; primary color: ${color}`);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
