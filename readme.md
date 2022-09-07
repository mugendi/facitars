# Facitars!

![Sample Facitars](https://repository-images.githubusercontent.com/533896513/9f78e67a-c195-4028-92bc-dfb1bd133390)

Lightweight avatar generator for the browser and server (NodeJs) that creates colorful and gender neutral avatars and also conveniently returns the avatars primary color too!

Facitars was built after I tried dozens of others and couldn't find one that provided support for all of the following:

1. Creating lightweight (no complex curves and paths) SVG avatars with the help of [SVG.js](https://svgjs.dev/)
   **Note:** If [SVG.js](https://svgjs.dev/) is not installed, it automatically loads it to dom.
2. Generating and Returning a unique (seed generated) color for each avatar. This is useful for applications where you wish to color code certain parts of your UI based on a users ID/email or whatever your seed value may be.
3. Most importantly, this project is generates SVG avatars both in the browser and on the server in a consistent manner. To do so, it relies on [JSDOM](https://www.npmjs.com/package/jsdom) and [SVG.js](https://svgjs.dev/) while avoiding SVG operations that would produce inconsistent SVGs on browser and server. This means that [facitars](https://github.com/mugendi/facitars) goes beyond other avatar generators out there!

## Generating Facitars on the Browser

On the browser all you need is:

### 1. Load the js file

```html
<!-- Add this line preferably to your <head> -->
<script src="../dist/facitars.js"></script>
```

### 2. Initialize the class

```html
<script>
	// init
	const facitars = new Facitars();
</script>
```

### 3. Generate your Facitar

```html
<script>
	// init
	const facitars = new Facitars();
	// generate your facitar.
	// Note generate() function is asynchronous
	(async () => {
		// create facitar for the seed 'Anthony Mugendi' that is 300x300px
		let { svg, color } = await facitars.generate('Anthony Mugendi', 100);
		// use the svg and color values returned as you desire
	})();
</script>
```

## Generating Facitars on the Server

### 1. Require Facitars

Of course start with installing **facitars** `yarn add facitars`

```javascript
// require
const Facitars = require('facitars');
```

### 2. Initialize the class

```javascript
// init
const facitars = new Facitars();
```

### 3. Generate your Facitar

```javascript
// require
const Facitars = require('facitars');
//init
const facitars = new Facitars();
// create facitar for the seed 'Anthony Mugendi' that is 300x300px
let { svg, color } = await facitars.generate('Anthony Mugendi', 100);
// use the svg and color values returned as you desire
```

**Note:**

For Server renders, you can write the SVG data returned to an svg file for later serving via HTTP or any other use. See the [Node Example](./examples/node.js) folder for more.

For both browser abd server examples above, the following Facitar is generated against the seed "Anthony Mugendi" 🙂

![Anthony Mugendi Facitar](https://repository-images.githubusercontent.com/533896513/20c44c8c-a4d7-4491-b871-27142e684d20)

## API

`.generate(seed,size)`

The `seed` can be any value so long as it can be converted into a string using `seed.toString()`.

The `size` argument determines the dimensions of the final SVG. Default is 80.
