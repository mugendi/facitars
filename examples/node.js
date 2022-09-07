
const Facitars = require('..');
const fs = require('fs');
const path = require('path');

(async () => {

	const facitars = new Facitars();
	let { svg, color } = await facitars.generate("Anthony Mugendi", 300);

	console.log({ svg, color });

	fs.writeFileSync(path.join(__dirname, './test.svg'), svg);

})();
