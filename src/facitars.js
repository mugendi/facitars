// Copyright 2022 Anthony Mugendi
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const seedColor = require('seed-color');
const { catalog, renderFeature } = require('./lib/features');

// Per-category hashes keep selections independent of drawing order and new features.
function hash(seed) {
	let value = 2166136261;
	for (let i = 0; i < seed.length; i++) value = Math.imul(value ^ seed.charCodeAt(i), 16777619);
	value = Math.imul(value ^ (value >>> 16), 2246822507);
	value = Math.imul(value ^ (value >>> 13), 3266489909);
	return (value ^ (value >>> 16)) >>> 0;
}

function validateFeatures(features) {
	if (!features || typeof features !== 'object' || Array.isArray(features)) {
		throw new TypeError('Features must be an object of feature indices.');
	}
	for (const [name, index] of Object.entries(features)) {
		if (!Object.hasOwn(catalog, name)) throw new RangeError(`Unknown feature: ${name}`);
		if (index === null && catalog[name].optional) continue;
		if (!Number.isInteger(index) || index < 0 || index >= catalog[name].count) {
			throw new RangeError(`${name} must be an integer from 0 to 49${catalog[name].optional ? ', or null to hide it' : ''}.`);
		}
	}
}

class Facitars {
	static get features() { return catalog; }

	async generate(seed, size = 80, features = {}) {
		if (seed === null || seed === undefined) throw new TypeError('A seed value is required.');
		seed = seed.toString();
		if (typeof seed !== 'string' || !seed.length) throw new TypeError('The seed must convert to a non-empty string.');
		if (typeof size !== 'number' || !Number.isFinite(size) || size <= 0) {
			throw new RangeError('Size must be a finite number greater than zero.');
		}
		validateFeatures(features);

		// Preserve v1 seed preprocessing and its primary color algorithm.
		const color = seedColor(seed + '-' + seed.length + '-' + seed.split('').reverse().join('')).toHex();
		const selected = {};
		for (const [name, meta] of Object.entries(catalog)) {
			const value = hash(seed + ':' + name);
			const visible = !meta.optional || hash(seed + ':' + name + ':visible') % 100 < ({ ears: 85, glasses: 25, cheeks: 45 }[name]);
			selected[name] = Object.hasOwn(features, name) ? features[name] : visible ? value % meta.count : null;
		}
		const render = name => selected[name] === null ? '' : renderFeature(name, selected[name], color);
		const background = hash(seed + ':background') % 4;
		const decoration = background === 0 ? '' : background === 1
			? `<circle cx="65" cy="12" r="32" fill="${color}" opacity=".12"/>`
			: background === 2 ? `<path d="M0 55L80 15V80H0Z" fill="${color}" opacity=".12"/>`
				: `<path d="M0 16H80M0 40H80M0 64H80" stroke="${color}" stroke-width="8" opacity=".1"/>`;
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 80 80" fill="none"><path fill="#f6f3ee" d="M0 0H80V80H0Z"/>${decoration}<g stroke="#25232a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${['ears', 'face', 'cheeks', 'eyes', 'eyebrows', 'nose', 'mouth', 'glasses'].map(render).join('')}</g></svg>`;
		return { svg, color };
	}
}

module.exports = Facitars;
