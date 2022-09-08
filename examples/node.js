
// .node() must be called so as to ensure jsdom is initialized
// As Node has no DOM which is needed for SVG rendering
const Facitars = require('..').node();

const fs = require('fs');
const path = require('path');

(async () => {

	let name = "Anthony Mugendi"

	const facitars = new Facitars();
	let { svg, color } = await facitars.generate(name);

	console.log({ svg, color });

	fs.writeFileSync(path.join(__dirname, './test.svg'), svg);

})();
