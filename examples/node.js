

const Facitars = require('..').node();

const fs = require('fs');
const path = require('path');

(async () => {

	let name = "Anthony Mugendi"

	const facitars = new Facitars();
	let { svg, color } = await facitars.generate(name);

	console.log({  color });

	fs.writeFileSync(path.join(__dirname, './test.svg'), svg);

})();
