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
const Facitars = require('./src/facitars');


function node() {	

	// JSDOM is needed for node module to provide DOM
	const jsdom = require('jsdom');
	const path = require('path');
	const fs = require('fs');

	// read local file for server use instead of trying to load
	// this is because the server version should be able to run with no external http calls
	// This is more so the case because we enable "runScripts: 'dangerously'" and thus should never trust scripts loaded externally!!
	const localSvgJs = fs.readFileSync(
		path.join(__dirname, './src/lib/svg.min.js')
	);

	class JSDomInjector extends Facitars {
		constructor() {
			super({ jsdom, localSvgJs });
		}
	}

    return JSDomInjector
}

module.exports = Facitars;

module.exports.node = node;
