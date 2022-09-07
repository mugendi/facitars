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
const Chooser = require('./lib/chooser');
const chooser = new Chooser();

const Size = 80;

let SVG;

class Facitars {
	constructor(opts) {
		if (typeof opts == 'object' && 'jsdom' in opts) {
			const { JSDOM } = opts.jsdom;
			const localSvgJs = opts.localSvgJs;

			const { window } = new JSDOM(
				`<html>
				<head><script>${localSvgJs}</script></head>
				</html>`,
				{
					runScripts: 'dangerously',
					beforeParse(window) {
						window.SVGElement.prototype.getBBox = () => ({
							x: 0,
							y: 0,
							width: Size,
							height: Size,
							// whatever other props you need
						});
					},
				}
			);

			this.window = window;
		}
	}

	async load_script(src) {
		// allow setting of document via jsdom
		let win = this.window || window;
		let { document } = win;

		// if jsdom instance is passed to enable server based use
		if (this.window) {
			return new Promise((resolve, reject) => {
				document.addEventListener('DOMContentLoaded', () => {
					// console.log('LOADED', win.SVG);
					SVG = win.SVG;
					resolve();
				});
			});
		}

		return new Promise(function (resolve, reject) {
			var s;
			s = document.createElement('script');
			s.src = src;
			s.onload = resolve;
			s.onerror = reject;
			document.head.appendChild(s);
		})
			.then((resp) => {
				SVG = window.SVG;
			})
			.catch(console.error);
	}

	#get_wighted_val(arr, type = '') {
		this.count++;

		// add count to generate seed uniqueness across the various elements
		let seed = this.seed + '-' + type + '-' + this.count * 10000;
		// console.log(this.count, seed);

		let w_arr = new Array(arr.length)
			.fill(0)
			.map((v) => Math.ceil(100 / arr.length));

		let i = chooser.chooseWeightedIndex(w_arr, seed);

		return arr[i];
	}

	face() {
		let faces_arr = [
			{
				shape: 'rect',
				args: [Size, Size],
			},
			{
				shape: 'rect',
				args: [Size * 0.6, Size],
			},
			{
				shape: 'rect',
				args: [Size * 0.6, Size],
				move: [Size * 0.5, 0],
			},
			{
				shape: 'rect',
				args: [Size, Size * 0.6],
			},
			{
				shape: 'rect',
				args: [Size, Size * 0.6],
				move: [0, Size * 0.5],
			},

			{
				shape: 'rect',
				args: [Size, Size],
				radius: Size * this.#get_wighted_val([0.1, 0.2, 0.3]),
			},
			{
				shape: 'rect',
				args: [Size * 0.6, Size],
				radius: Size * this.#get_wighted_val([0.1, 0.2, 0.3]),
				move: [Size * 0.1 * -1, 0],
			},
			{
				shape: 'rect',
				args: [Size * 0.6, Size],
				radius: Size * this.#get_wighted_val([0.1, 0.2, 0.3]),
				move: [Size * 0.5, 0],
			},
			{
				shape: 'rect',
				args: [Size, Size * 0.6],
				radius: Size * this.#get_wighted_val([0.1, 0.2, 0.3]),
				move: [0, Size * -0.1],
			},
			{
				shape: 'rect',
				args: [Size, Size * 0.6],
				radius: Size * this.#get_wighted_val([0.1, 0.2, 0.3]),
				move: [0, Size * 0.5],
			},

			{
				shape: 'rect',
				args: [Size, Size],
				radius: Size * this.#get_wighted_val([0.1, 0.2, 0.3]),
			},
			{ shape: 'circle', args: [Size] },
			{
				shape: 'polygon',
				args: [`0,0 ${Size / 2},${Size} ${Size},0`],
			},

			{
				shape: 'polygon',
				args: [
					`${Size * 0.2},0 ${Size * 0.8},0 ${Size},${Size * 0.5} ${
						Size * 0.5
					},${Size} ${0}, ${Size * 0.5}`,
				],
			},

			{
				shape: 'polygon',
				args: [
					`0,0 ${Size * 0.8},${Size * 0.5} ${Size * 0.5},${Size} ${
						Size * 0.2
					},${Size * 0.5} ${Size},0`,
				],
			},
			{
				shape: 'polygon',
				args: [
					`0,0 ${
						Size * this.#get_wighted_val([0.0, 0.3, 0.5, 0.8])
					},0  ${
						Size * this.#get_wighted_val([0.0, 0.3, 0.5, 0.8])
					},${Size} 0,${Size}`,
				],
			},
		];

		let { shape, args, radius, move } = this.#get_wighted_val(faces_arr);

		let face = this.draw[shape](...args);
		if (radius) {
			face.radius(radius);
		}

		if (move) {
			face.move(...move);
		}

		face.fill(this.color);
	}

	eyes() {
		let pupils_arr = [
			{
				l: [Size * 0.3, Size * 0.3],
				r: [Size * 0.7, Size * 0.3],
			},
		];

		let eyeballs_arr = [
			{
				l: [Size * 0.3, Size * 0.3],
				r: [Size * 0.7, Size * 0.3],

				pupils: this.#get_wighted_val(pupils_arr),
			},

			{
				l: [Size * 0.3, Size * 0.3],
				r: [Size * 0.7, Size * 0.2],
				pupils: this.#get_wighted_val(pupils_arr),
			},

			{
				l: [Size * 0.3, Size * 0.2],
				r: [Size * 0.7, Size * 0.3],
				pupils: this.#get_wighted_val(pupils_arr),
			},
		];

		let pos = this.#get_wighted_val(eyeballs_arr);

		let eyeballs_shape_arr = [
			{
				l: {
					shape: 'circle',
					args: [Size / 3],
				},
				r: {
					shape: 'circle',
					args: [Size / 3],
				},
			},
			{
				l: {
					shape: 'ellipse',
					args: [Size / 3, Size / 2.5],
				},
				r: {
					shape: 'ellipse',
					args: [Size / 3, Size / 2.5],
				},
			},
			{
				l: {
					shape: 'ellipse',
					args: [Size / 2.5, Size / 3],
				},
				r: {
					shape: 'ellipse',
					args: [Size / 2.5, Size / 3],
				},
			},
			{
				l: {
					shape: 'ellipse',
					args: [Size / 2.5, Size / 3],
				},
				r: {
					shape: 'ellipse',
					args: [Size / 3, Size / 2.5],
				},
			},
		];

		let eyes_arr = [
			{
				eyeballs: this.#get_wighted_val(eyeballs_shape_arr),
				pupils: { shape: 'circle', args: [Size / 6] },
			},
		];

		let { eyeballs, pupils } = this.#get_wighted_val(eyes_arr);

		let eye_fill = this.#get_wighted_val(['#FFF']);

		this.draw[eyeballs.l.shape](...eyeballs.l.args)
			.center(...pos.l)
			.fill(eye_fill)
			.stroke('#000');

		this.draw[pupils.shape](...pupils.args)
			.center(...pos.pupils.l)
			.fill('#000');

		this.draw[eyeballs.r.shape](...eyeballs.r.args)
			.center(...pos.r)
			.fill(eye_fill)
			.stroke('#000');

		this.draw[pupils.shape](...pupils.args)
			.center(...pos.pupils.r)
			.fill('#000');
	}

	nose() {
		let nose_arr = [
			`m30,45 5,5 4,-10 5,10, 4,-10`,
			`m30,45 5,5 4,-10`,
			`m30,40 C35,55 50,50 40,30`,
		];
		let path = this.draw.path(this.#get_wighted_val(nose_arr));
		path.stroke({ color: '#000', width: 3, linecap: 'round' });
		path.fill('none');
	}

	mouth() {
		let mouth_arr = [
			{
				mouth: `10,50 30,60 50,60 70,50 50,70 30,70`,
				teeth: this.#get_wighted_val([
					[`30,62 35,62 35,65 30,65`, `45,62 50,62 50,65 45,65`],
					[
						`30,62 35,62 35,65 30,65`,
						`37,70 37,65 43,65 43,70`,
						`45,62 50,62 50,65 45,65`,
					],
					[''],
				]),
				smileLines: this.#get_wighted_val([
					[['m10,40 -5,10 5,10'], ['m70,40 5,10 -5,10']],
					[['m10,40 -5,10 15,20'], ['m70,40 5,10 -15,20']],
					[''],
				]),
			},
			{
				mouth: `10,60 30,55 50,55 70,60 50,70 30,70`,
				teeth: this.#get_wighted_val([
					[''],
					[`30,55 35,55 35,60 30,60`, `45,55 50,55 50,60 45,60`],
					[`10,60 30,63 50,63 70,60 50,56, 30,56`],
					[
						`30,55 35,55 35,60 30,60`,
						`37,70 37,65 43,65 43,70`,
						`45,55 50,55 50,60 45,60`,
					],
					[''],
				]),
			},
			{
				mouth: `10,60 30,65 50,65 70,60 50,70 30,70`,
			},
			{
				mouth: `10,60 30,55 50,65 70,60 50,70 30,70`,
				teeth: this.#get_wighted_val([
					[`30,55 45,63 30,60 20,57`],
					[``],
				]),
			},
			{
				mouth: `10,60 30,65 50,55 70,60 50,70 30,70`,
				teeth: this.#get_wighted_val([
					[`40,60 50,55 70,60 50,65 `],
					[``],
				]),
			},
		];

		let { mouth, teeth, smileLines } = this.#get_wighted_val(mouth_arr);
		// let smileLines = this.#get_wighted_val(smileLines_arr);

		let mouthEl = this.draw
			.polygon(mouth)
			.stroke({ color: '#bbb', width: 1, linecap: 'round' });

		let teethEl, smileLinesEl;

		if (teeth) {
			for (let tooth of teeth) {
				teethEl = this.draw.polygon(tooth).fill('#FFF');
			}
		}

		if (smileLines) {
			for (let smileLine of smileLines) {
				if (smileLine) {
					smileLinesEl = this.draw
						.path(smileLine)
						.stroke({ color: '#444', width: 1 })
						.fill('none');
				}
			}
		}

		let group = this.draw.group();
		group.add(mouthEl).add(teethEl).add(smileLinesEl);

		this.transform(group);
	}

	eyebrows() {
		let brows_arr = [
			[`m0,20 30,-15 10,10`, 'm45,10 20,-5 30,20'],
			[``, 'm45,10 20,-5 30,20'],
			[`m0,20 30,-15 10,10`, ''],
			['m5,5 20,0 10,5', 'm45,10 10,-5 20,0'],
			['m5,5 20,0 10,5', ''],
			['', 'm45,10 10,-5 20,0'],
			[],
		];

		let brows = this.#get_wighted_val(brows_arr);

		// console.log(brows);

		for (let brow of brows) {
			if (brow) {
				this.draw
					.path(brow)
					.stroke({ color: '#000', width: 5, linecap: 'round' })
					.fill('none');
			}
		}
	}

	transform(el, rotateArr = [0, 10, -10]) {
		el.transform({
			rotate: this.#get_wighted_val(rotateArr),
			// translateX: this.#get_wighted_val([0,20,40,-40,-20]),
			// translateY: this.#get_wighted_val([0,20,40,-40,-20]),
			// scale: this.#get_wighted_val([0,2,3,4,-2,-3]),
		});
	}

	async #init() {
		if (typeof SVG == 'function') return;

		await this.load_script(
			'https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@latest/dist/svg.min.js'
		);
	}

	async generate(seed, size = 80) {
		// validate seed
		if (!seed) throw new Error(`First argument must be your seed value!`);
		if (typeof seed !== 'string') seed = seed.toString();

		// validate size
		if (typeof size !== 'number')
			throw new Error('Second argument (size) must be a number!');

		await this.#init();

		this.count = 0;

		seed =
			seed + '-' + seed.length + '-' + seed.split('').reverse().join('');

		this.seed = seed;

		this.color = seedColor(seed).toHex();

		this.svg = SVG();

		this.draw = this.svg.group();

		// draw face
		this.face();

		// add eyes
		this.eyes();

		// add mouth
		this.mouth();

		// add nose
		this.nose();

		// draw eyebrows
		this.eyebrows();

		/**/

		let ratio = size / Size;

		this.draw.size(Size, Size);

		this.draw.transform({
			scale: ratio,
			translateX: (Size / 2) * (ratio - 1),
			translateY: (Size / 2) * (ratio - 1),
		});

		this.svg.size(Size * ratio, Size * ratio).fill('#FFF');

		return {
			svg: this.svg.svg(),
			color: this.color,
		};
	}
}

if (typeof module !== 'undefined') {
	module.exports = Facitars;
}
if (typeof window !== 'undefined') {
	window.Facitars = Facitars;
}
