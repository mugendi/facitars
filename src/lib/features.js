// Ten shape families per feature, each with five deliberately bounded geometries.
const families = {
	face: ['Round', 'Oval', 'Rounded square', 'Squircle', 'Diamond', 'Pear', 'Heart', 'Hexagon', 'Tapered', 'Wide jaw'],
	ears: ['Round', 'Oval', 'Lobed', 'Pointed', 'Angular', 'Cupped', 'Notched', 'Flared', 'Long', 'Folded'],
	eyes: ['Round', 'Oval', 'Almond', 'Sleepy', 'Happy', 'Surprised', 'Square', 'Diamond', 'Wink', 'Side glance'],
	eyebrows: ['Straight', 'Arch', 'Angled', 'Raised', 'Worried', 'Swoop', 'Thick', 'Split', 'Curved', 'Asymmetric'],
	nose: ['Button', 'Triangle', 'Bridge', 'Hook', 'Round', 'Wide', 'Upturned', 'Angular', 'Nostrils', 'Swoop'],
	mouth: ['Smile', 'Grin', 'Smirk', 'Pout', 'Open', 'Laugh', 'Straight', 'Toothy', 'Wave', 'Tongue'],
	glasses: ['Round', 'Oval', 'Square', 'Rounded', 'Cat eye', 'Hexagon', 'Half rim', 'Browline', 'Monocle', 'Sunglasses'],
	cheeks: ['Patches', 'Freckles', 'Dimples', 'Dots', 'Sparkles', 'Hatching', 'Diamonds', 'Crescents', 'Ovals', 'Smile lines'],
};
const optional = ['ears', 'glasses', 'cheeks'];
const catalog = Object.freeze(Object.fromEntries(Object.entries(families).map(([name, names]) => [
	name, Object.freeze({ count: 50, optional: optional.includes(name), families: Object.freeze(names) }),
])));
const n = value => Math.round(value * 100) / 100;
const path = (d, fill = 'none', attrs = '') => `<path d="${d.replace(/-?\d+\.\d+/g, value => n(Number(value)))}" fill="${fill}"${attrs}/>`;
const ellipse = (x, y, rx, ry, fill = 'none', attrs = '') => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fill}"${attrs}/>`;
const rect = (x, y, w, h, r, fill = 'none') => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(r)}" fill="${fill}"/>`;
const pair = (left, right = left, y = 0, x = 29) => `<g transform="translate(${x} ${y})">${left}</g><g transform="translate(${80 - x} ${y}) scale(-1 1)">${right}</g>`;
const ink = '#25232a';

function face(f, v, color) {
	const w = 22 + v, top = 11 - v, bottom = 72 + v;
	switch (f) {
		case 0: return ellipse(40, 43, w, 30 + v, color);
		case 1: return ellipse(40, 43, 19 + v * 0.7, 33, color);
		case 2: return rect(40 - w, top, w * 2, bottom - top, 8 + v, color);
		case 3: return path(`M40 ${top}Q${40 + w} ${top} ${40 + w} 35V53Q${40 + w} ${bottom} 40 ${bottom}Q${40 - w} ${bottom} ${40 - w} 53V35Q${40 - w} ${top} 40 ${top}Z`, color);
		case 4: return path(`M40 ${top}Q${48 + v} 13 ${40 + w} 37L${58 + v} 58Q40 ${bottom + 4} ${22 - v} 58L${40 - w} 37Q${32 - v} 13 40 ${top}Z`, color);
		case 5: return path(`M40 ${top}C${61 + v} ${top} 57 30 ${40 + w} 49Q${67 + v} ${bottom} 40 ${bottom}Q${13 - v} ${bottom} ${40 - w} 49C23 30 ${19 - v} ${top} 40 ${top}Z`, color);
		case 6: return path(`M40 ${top + 4}C${61 + v} ${top - 8} ${72 + v} 30 59 53Q50 66 40 ${bottom}Q30 66 21 53C${8 - v} 30 ${19 - v} ${top - 8} 40 ${top + 4}Z`, color);
		case 7: return path(`M${26 - v} ${top}H${54 + v}L${40 + w} 34V${54 + v}L50 ${bottom}H30L${40 - w} ${54 + v}V34Z`, color);
		case 8: return path(`M${25 - v} ${top}Q40 ${top - 5} ${55 + v} ${top}Q${70 + v} 31 57 57L${47 + v} ${bottom}H${33 - v}L23 57Q${10 - v} 31 ${25 - v} ${top}Z`, color);
		default: return path(`M40 ${top}Q${40 + w} ${top} 61 35L${65 + v} 56Q64 ${bottom} 40 ${bottom}Q16 ${bottom} ${15 - v} 56L19 35Q${40 - w} ${top} 40 ${top}Z`, color);
	}
}

function ears(f, v, color) {
	const r = 3 + v * 0.5, h = 5 + v;
	let shape;
	switch (f) {
		case 0: shape = ellipse(0, 0, r, r + 1, color); break;
		case 1: shape = ellipse(0, 0, r, h, color); break;
		case 2: shape = path(`M2 -6C${-8 - v} -10 ${-8 - v} 4 -2 4Q-4 ${10 + v} 2 7Z`, color); break;
		case 3: shape = path(`M2 -4L${-7 - v} ${-9 - v}L-3 ${7 + v}L2 5Z`, color); break;
		case 4: shape = path(`M2 -6L${-4 - v} -6L${-6 - v} 0L-3 ${h}H2Z`, color); break;
		case 5: shape = ellipse(0, 0, r + 1, h, color) + path(`M1 -3Q${-5 - v} -4 -1 ${3 + v}`); break;
		case 6: shape = path(`M2 -7Q${-9 - v} -7 -3 0Q${-9 - v} 8 2 ${h}Z`, color); break;
		case 7: shape = path(`M2 -4Q${-12 - v} -9 ${-5 - v} 5L2 ${h}Z`, color); break;
		case 8: shape = ellipse(0, 2, r - 1, h + 2, color); break;
		default: shape = path(`M2 -6Q${-10 - v} -9 -4 ${h}L2 6ZM-3 -3L0 2` , color);
	}
	return pair(shape, shape, 42, 17);
}

function eyes(f, v) {
	const w = 4 + v * 0.6, h = 3 + v * 0.5;
	const pupil = ellipse(0, 0, 1.7, 2.2, ink, ' stroke="none"');
	let shape, right;
	switch (f) {
		case 0: shape = ellipse(0, 0, w, w, '#fff') + pupil; break;
		case 1: shape = ellipse(0, 0, w, h + 2, '#fff') + pupil; break;
		case 2: shape = path(`M${-w - 1} 0Q0 ${-h * 2} ${w + 1} 0Q0 ${h * 2} ${-w - 1} 0Z`, '#fff') + pupil; break;
		case 3: shape = path(`M${-w} -1H${w}Q${w} ${h + 3} 0 ${h + 3}Q${-w} ${h + 3} ${-w} -1Z`, '#fff') + ellipse(0, 1.5, 1.5, 1.8, ink); break;
		case 4: shape = path(`M${-w} 2Q0 ${-h - 2} ${w} 2`); break;
		case 5: shape = ellipse(0, 0, w - 1, h + 3, '#fff') + ellipse(0, 0, 1.4, 1.4, ink); break;
		case 6: shape = rect(-w, -h, w * 2, h * 2, 1, '#fff') + pupil; break;
		case 7: shape = path(`M${-w - 1} 0L0 ${-h - 1}L${w + 1} 0L0 ${h + 1}Z`, '#fff') + pupil; break;
		case 8: shape = ellipse(0, 0, w, h + 1, '#fff') + pupil; right = path(`M${-w} 0Q0 ${h} ${w} 0`); break;
		default: shape = ellipse(0, 0, w + 0.5, h, '#fff') + ellipse(2 + v * 0.2, 0, 1.7, 2, ink);
	}
	return pair(shape, right || shape, 35);
}

function eyebrows(f, v) {
	const w = 4 + v * 0.7, lift = v * 0.7;
	let shape, right;
	switch (f) {
		case 0: shape = path(`M${-w} ${-lift}H${w}`); break;
		case 1: shape = path(`M${-w} 1Q0 ${-4 - lift} ${w} 1`); break;
		case 2: shape = path(`M${-w} -2L0 ${-3 - lift}L${w} 1`); break;
		case 3: shape = path(`M${-w} ${-2 - lift}Q0 ${-6 - lift} ${w} ${-2 - lift}`); break;
		case 4: shape = path(`M${-w} 2L${w} ${-3 - lift}`); break;
		case 5: shape = path(`M${-w} 1Q2 ${-5 - lift} ${w} -1`); break;
		case 6: shape = path(`M${-w} 1L${-w} ${-2 - lift}L${w} -2V1Z`, ink); break;
		case 7: shape = path(`M${-w} ${-lift}H-1M2 ${-lift}H${w}`); break;
		case 8: shape = path(`M${-w} -2Q0 ${3 + lift} ${w} -2`); break;
		default: shape = path(`M${-w} 0Q0 ${-3 - lift} ${w} 0`); right = path(`M${-w} ${-3 - lift}L${w} 0`);
	}
	return pair(shape, right || shape, 24);
}

function nose(f, v, color) {
	const w = 2 + v * 0.6, h = 4 + v;
	let shape;
	switch (f) {
		case 0: shape = path(`M${-w} 0Q0 ${h} ${w} 0`); break;
		case 1: shape = path(`M0 ${-h}L${w + 1} 2H${-w - 1}Z`, color); break;
		case 2: shape = path(`M-1 ${-h}V2H${w}`); break;
		case 3: shape = path(`M-1 ${-h}Q${w + 3} 4 -2 2`); break;
		case 4: shape = ellipse(0, 0, w, 2 + v * 0.4, color); break;
		case 5: shape = path(`M${-w - 2} -2Q${-w - 4} 4 0 2Q${w + 4} 4 ${w + 2} -2`); break;
		case 6: shape = path(`M${-w} 2Q0 ${-h} ${w} 2`); break;
		case 7: shape = path(`M-1 ${-h}L${w} 1L-2 3`); break;
		case 8: shape = ellipse(-w, 1, 0.9, 1, ink) + ellipse(w, 1, 0.9, 1, ink); break;
		default: shape = path(`M-1 ${-h}C${-w - 2} -1 ${w + 3} -2 ${w} 2`);
	}
	return `<g transform="translate(40 47)">${shape}</g>`;
}

function mouth(f, v) {
	const w = 6 + v * 1.2, h = 3 + v;
	let shape;
	switch (f) {
		case 0: shape = path(`M${-w} -2Q0 ${h * 2} ${w} -2`); break;
		case 1: shape = path(`M${-w} -2H${w}Q0 ${h * 2 + 4} ${-w} -2Z`, '#fff'); break;
		case 2: shape = path(`M${-w} 1Q2 ${h} ${w} -3`); break;
		case 3: shape = path(`M${-w} 2Q0 ${-h * 2} ${w} 2`); break;
		case 4: shape = ellipse(0, 1, w * 0.6, h, ink); break;
		case 5: shape = path(`M${-w} -3Q0 1 ${w} -3Q${w} ${h + 4} 0 ${h + 4}Q${-w} ${h + 4} ${-w} -3Z`, ink) + path(`M-3 ${h + 2}Q0 ${h - 1} 3 ${h + 2}`, 'none', ' stroke="#ef8b91"'); break;
		case 6: shape = path(`M${-w} 1H${w}`); break;
		case 7: shape = rect(-w, -2, w * 2, h + 1, 2, '#fff') + path(`M${-w} ${n(h / 2 - 1)}H${w}M0 -2V${h - 1}`); break;
		case 8: shape = path(`M${-w} 0Q${-w / 2} ${-h} 0 0T${w} 0`); break;
		default: shape = path(`M${-w} -2H${w}Q0 ${h * 2} ${-w} -2Z`, ink) + path(`M-3 0H3V${h}Q0 ${h + 3} -3 ${h}Z`, '#ef8b91');
	}
	return `<g transform="translate(40 59)">${shape}</g>`;
}

function glasses(f, v) {
	const w = 7 + v * 0.5, h = 5 + v * 0.5;
	let lens;
	switch (f) {
		case 0: lens = ellipse(0, 0, w, w); break;
		case 1: lens = ellipse(0, 0, w + 1, h); break;
		case 2: lens = rect(-w, -h, w * 2, h * 2, 0); break;
		case 3: lens = rect(-w, -h, w * 2, h * 2, 3); break;
		case 4: lens = path(`M${-w - 2} ${-h - 2}L${w} ${-h}V2Q0 ${h + 5} ${-w} 2Z`); break;
		case 5: lens = path(`M${-w} -2L-3 ${-h}H3L${w} -2V3L3 ${h}H-3L${-w} 3Z`); break;
		case 6: lens = path(`M${-w} 0V2Q0 ${h + 4} ${w} 2V0`); break;
		case 7: lens = path(`M${-w - 1} ${-h}H${w + 1}M${-w} ${-h}V2Q0 ${h + 4} ${w} 2V${-h}`, 'none', ' stroke-width="2.4"'); break;
		case 8: return `<g transform="translate(29 35)">${ellipse(0, 0, w, w) + path(`M${-w} 2L${-w - 2} ${20 + v}`)}</g>`;
		default: lens = rect(-w, -h, w * 2, h * 2, 2, ink);
	}
	return pair(lens, lens, 35) + path(`M${n(29 + w)} 35Q40 32 ${n(51 - w)} 35M${n(29 - w)} 33L19 31M${n(51 + w)} 33L61 31`);
}

function cheeks(f, v) {
	const w = 2 + v * 0.6;
	let shape;
	switch (f) {
		case 0: shape = ellipse(0, 0, w + 1, 2, ink, ' stroke="none" opacity=".6"'); break;
		case 1: shape = `<g fill="${ink}" stroke="none">${ellipse(-w, 0, 0.7, 0.7, ink) + ellipse(0, -1.5, 0.7, 0.7, ink) + ellipse(w, 1, 0.7, 0.7, ink)}</g>`; break;
		case 2: shape = path(`M0 -2Q${-w} 0 0 2`); break;
		case 3: shape = ellipse(0, 0, w * 0.5, w * 0.5, ink); break;
		case 4: shape = path(`M${-w} 0H${w}M0 ${-w}V${w}`); break;
		case 5: shape = path(`M${-w} 2L-1 -2M1 2L${w} -2`, 'none', ' stroke="#25232a"'); break;
		case 6: shape = path(`M0 ${-w}L${w} 0L0 ${w}L${-w} 0Z`, ink, ' stroke="none"'); break;
		case 7: shape = path(`M0 ${-w}Q${-w * 2} 0 0 ${w}Q${-w} 0 0 ${-w}Z`, ink, ' stroke="none"'); break;
		case 8: shape = ellipse(0, 0, w, 3, ink, ' stroke="none" opacity=".55"'); break;
		default: shape = path(`M0 ${-w}Q${w} 0 0 ${w}`);
	}
	return pair(shape, shape, 47, 25);
}

const renderers = { face, ears, eyes, eyebrows, nose, mouth, glasses, cheeks };
module.exports = { catalog, renderFeature: (name, index, color) => renderers[name](Math.floor(index / 5), index % 5, color) };
