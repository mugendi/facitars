'use strict';
const facitars = new Facitars();
const $ = id => document.getElementById(id);
const labels = { face: 'Faces', ears: 'Ears', eyes: 'Eyes', eyebrows: 'Eyebrows', nose: 'Noses', mouth: 'Mouths', glasses: 'Glasses', cheeks: 'Cheek details' };
const names = ['Anthony Mugendi', 'Marie Marsh', 'Birdie Romero', 'Ronnie McGee', 'Ida McCoy', 'Lina Schmidt', 'Cody Steele', 'Nora Harper'];
let overrides = {};
let currentSvg = '';
let revision = 0;
let galleryRevision = 0;

function formatBytes(svg) { return `${new TextEncoder().encode(svg).length.toLocaleString()} B`; }
function smallSvg(svg, size) { return svg.replace(/width="[^"]+" height="[^"]+"/, `width="${size}" height="${size}"`); }

async function update() {
	const request = ++revision;
	$('size-value').textContent = `${$('size').value} px`;
	try {
		const { svg, color } = await facitars.generate($('seed').value, Number($('size').value), overrides);
		if (request !== revision) return;
		currentSvg = svg;
		$('preview').innerHTML = svg;
		$('preview').setAttribute('aria-label', `Avatar for ${$('seed').value}`);
		$('preview-label').textContent = $('seed').value;
		for (const size of [24, 40, 64]) $('small-' + size).innerHTML = smallSvg(svg, size);
		$('color-value').textContent = color;
		$('swatch').style.backgroundColor = color;
		$('weight').textContent = formatBytes(svg);
		$('source').textContent = svg;
		$('error').textContent = '';
		$('seed').removeAttribute('aria-invalid');
		$('download').disabled = false;
	} catch (error) {
		if (request !== revision) return;
		$('error').textContent = `${error.message} Enter a string to preview an avatar.`;
		$('seed').setAttribute('aria-invalid', 'true');
		$('download').disabled = true;
		currentSvg = '';
		$('preview').replaceChildren();
		$('preview-label').textContent = 'Waiting for your string';
		$('preview').setAttribute('aria-label', 'No avatar generated');
		for (const size of [24, 40, 64]) $('small-' + size).replaceChildren();
		$('source').textContent = '';
		$('weight').textContent = '—';
		$('color-value').textContent = '—';
		$('swatch').style.backgroundColor = 'transparent';
	}
}

function updateChoices() {
	$('reset').hidden = Object.keys(overrides).length === 0;
	$('choices').textContent = Object.entries(overrides).map(([key, value]) => `${labels[key]}: ${Facitars.features[key].families[Math.floor(value / 5)]} ${value % 5 + 1}`).join(' · ');
}

async function gallery() {
	const request = ++galleryRevision;
	const name = $('feature').value;
	const base = { face: 10, eyes: 0, eyebrows: 0, nose: 0, mouth: 0, ears: null, glasses: null, cheeks: null };
	const fragment = document.createDocumentFragment();
	for (let i = 0; i < Facitars.features[name].count; i++) {
		const { svg } = await facitars.generate('Geometry review', 80, { ...base, [name]: i });
		const title = `${Facitars.features[name].families[Math.floor(i / 5)]} ${i % 5 + 1}`;
		const button = document.createElement('button');
		button.type = 'button';
		button.setAttribute('aria-label', `Try ${labels[name]}: ${title}`);
		button.setAttribute('aria-pressed', String(overrides[name] === i));
		button.innerHTML = svg;
		const caption = document.createElement('span');
		caption.textContent = title;
		button.append(caption);
		button.addEventListener('click', () => {
			overrides[name] = i;
			updateChoices();
			update();
			for (const [index, choice] of [...$('feature-gallery').children].entries()) {
				choice.setAttribute('aria-pressed', String(index === i));
			}
		});
		fragment.append(button);
	}
	if (request === galleryRevision) $('feature-gallery').replaceChildren(fragment);
}

async function init() {
	for (const [name, meta] of Object.entries(Facitars.features)) {
		const option = document.createElement('option');
		option.value = name;
		option.textContent = `${labels[name]} (${meta.count})`;
		$('feature').append(option);
	}
	for (const name of names) {
		const { svg } = await facitars.generate(name);
		const button = document.createElement('button');
		button.type = 'button';
		button.innerHTML = svg;
		const caption = document.createElement('span');
		caption.textContent = name;
		button.append(caption);
		button.addEventListener('click', () => { $('seed').value = name; update(); });
		$('comparison').append(button);
	}
	$('seed').addEventListener('input', update);
	$('size').addEventListener('input', update);
	$('feature').addEventListener('change', gallery);
	$('shuffle').addEventListener('click', () => {
		$('seed').value = `Hello ${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
		update();
	});
	$('reset').addEventListener('click', () => { overrides = {}; updateChoices(); update(); gallery(); });
	$('download').addEventListener('click', () => {
		if (!currentSvg) return;
		const url = URL.createObjectURL(new Blob([currentSvg], { type: 'image/svg+xml' }));
		const link = document.createElement('a');
		link.href = url;
		link.download = 'facitar.svg';
		link.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	});
	await update();
	await gallery();
}
init().catch(error => { $('error').textContent = `Unable to load the playground: ${error.message}`; });
