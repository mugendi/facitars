const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const seedColor = require('seed-color');
const { node, browser } = require('..');
const { catalog, renderFeature } = require('../src/lib/features');
const Facitars = node();
const facitars = new Facitars();

test('legacy entry points use one DOM-free renderer', () => {
	assert.equal(node(), browser());
	assert.equal(Facitars, require('../src/facitars'));
});

test('repeat, fresh-instance, interleaved and concurrent calls are identical', async () => {
	const expected = await facitars.generate('Anthony Mugendi', 300);
	await facitars.generate('A different person');
	const actual = await Promise.all(Array.from({ length: 10 }, (_, i) => (i % 2 ? facitars : new Facitars()).generate('Anthony Mugendi', 300)));
	for (const value of actual) assert.deepEqual(value, expected);
	assert.deepEqual(Object.keys(expected), ['svg', 'color']);
	assert.match(expected.svg, /width="300" height="300" viewBox="0 0 80 80"/);
	assert.doesNotMatch(expected.svg, /(?:NaN|Infinity|undefined|<script|url\(|\bid=)/);
});

test('v1 primary colors are preserved for string, numeric and Unicode seeds', async () => {
	for (const value of ['Anthony Mugendi', 'hello', '你好 👩🏽‍🚀', 42, 0, false]) {
		const seed = String(value);
		const expected = seedColor(`${seed}-${seed.length}-${seed.split('').reverse().join('')}`).toHex();
		assert.equal((await facitars.generate(value)).color, expected);
	}
});

test('rejects invalid seeds, sizes and feature overrides', async () => {
	for (const seed of [undefined, null, '', { toString: () => 1 }]) await assert.rejects(facitars.generate(seed), TypeError);
	for (const size of [0, -1, NaN, Infinity, -Infinity, '80', null]) await assert.rejects(facitars.generate('hello', size), RangeError);
	for (const features of [null, [], 'eyes']) await assert.rejects(facitars.generate('hello', 80, features), TypeError);
	for (const features of [{ eyes: -1 }, { eyes: 50 }, { nose: 1.5 }, { face: null }, { eyes: '1' }, { unknown: 0 }, JSON.parse('{"__proto__":1}')]) {
		await assert.rejects(facitars.generate('hello', 80, features), RangeError);
	}
});

test('seed text cannot become SVG markup', async () => {
	const { svg } = await facitars.generate('"><script>alert(1)</script>&<img onerror=alert(1)>');
	assert.doesNotMatch(svg, /<script|onerror|alert\(|&/);
});

test('every feature has ten families and 50 distinct geometries', async () => {
	assert.equal(Object.keys(catalog).length, 8);
	for (const [name, meta] of Object.entries(catalog)) {
		assert.equal(meta.count, 50, name);
		assert.equal(meta.families.length, 10, name);
		const shapes = Array.from({ length: 50 }, (_, i) => renderFeature(name, i, '#abcdef'));
		assert.equal(new Set(shapes).size, 50, `${name} contains duplicate geometry`);
		for (let i = 0; i < 50; i++) {
			const { svg, color } = await facitars.generate('Review', 80, { [name]: i });
			assert.ok(svg.includes(renderFeature(name, i, color)), `${name} ${i} is unreachable`);
			assert.doesNotMatch(svg, /NaN|Infinity|undefined/, `${name} ${i}`);
		}
	}
	assert.ok(Object.isFrozen(Facitars.features));
});

test('changing one feature leaves all other geometry and the color unchanged', async () => {
	const a = await facitars.generate('Independent features', 80, { nose: 0 });
	const b = await facitars.generate('Independent features', 80, { nose: 49 });
	assert.equal(a.color, b.color);
	assert.equal(a.svg.replace(renderFeature('nose', 0, a.color), ''), b.svg.replace(renderFeature('nose', 49, b.color), ''));
	for (const [name, meta] of Object.entries(catalog)) {
		if (meta.optional) {
			const shown = await facitars.generate('Review', 80, { [name]: 0 });
			const hidden = await facitars.generate('Review', 80, { [name]: null });
			assert.equal(shown.svg.replace(renderFeature(name, 0, shown.color), ''), hidden.svg);
		}
	}
});

test('default sampling reaches every variation in each category', async () => {
	const seen = Object.fromEntries(Object.keys(catalog).map(name => [name, new Set()]));
	for (let i = 0; i < 3000; i++) {
		const { svg, color } = await facitars.generate(`Person ${i}`);
		for (const name of Object.keys(catalog)) {
			if (seen[name].size === 50) continue;
			for (let index = 0; index < 50; index++) if (svg.includes(renderFeature(name, index, color))) seen[name].add(index);
		}
	}
	for (const name of Object.keys(catalog)) assert.equal(seen[name].size, 50, name);
});

test('browser bundle works offline and matches Node output byte for byte', async () => {
	const context = vm.createContext({});
	vm.runInContext(fs.readFileSync(require.resolve('../dist/facitars.min.js'), 'utf8'), context);
	const instance = new context.Facitars();
	for (const seed of ['Juliet', 'Anthony Mugendi', '你好 👩🏽‍🚀', '<>&"', 'another string']) {
		const actual = await instance.generate(seed, 128, { glasses: 12 });
		const expected = await facitars.generate(seed, 128, { glasses: 12 });
		assert.equal(actual.svg, expected.svg);
		assert.equal(actual.color, expected.color);
	}
});


test('gender-neutral catalog excludes hairstyles and facial hair in Node and browsers', async () => {
	const context = vm.createContext({});
	vm.runInContext(fs.readFileSync(require.resolve('../dist/facitars.min.js'), 'utf8'), context);
	for (const Renderer of [Facitars, context.Facitars]) {
		assert.deepEqual(Array.from(Object.keys(Renderer.features)).sort(), ['cheeks', 'ears', 'eyebrows', 'eyes', 'face', 'glasses', 'mouth', 'nose']);
		const renderer = new Renderer();
		for (const name of ['hair', 'facialHair']) {
			for (const index of [0, 49, null]) {
				await assert.rejects(renderer.generate('Juliet', 80, { [name]: index }), /Unknown feature/);
			}
		}
	}
});
