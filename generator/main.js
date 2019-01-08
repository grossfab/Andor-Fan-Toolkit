/**
 * Copyright (C) 2018 Fabian Große
 * This software is licensed under the GNU General Public License 3 (GPLv3) or later.
 * For details please see the LICENSE file that should be included with this software.
 */

const fs = require("fs");
const puppeteer = require("puppeteer");
const mergePDFs = require("./lib/mergepdfs.js");

main();

/**
 *
 */
function main() {
	/**
	 *
	 * @param {*} arg
	 * @param {*} callback
	 */
	function _helper(arg, callback) {
		if (arg != undefined) {
			fs.readFile(arg, (err, data) => {
				if (err) {
					console.error(err);
					console.debug("Argument is not a valid path or file doesn't exist. Use 'help' for usage information.");
					return;
				}
				let jsonObj = JSON.parse(data);
				callback(jsonObj);
			});
		}
	}

	const args = parseArguments(process.argv.slice(2));
	//TODO: handle 'help' argument
	console.log("Starting...");
	if (!fs.existsSync(args.outDir)) {
		fs.mkdirSync(args.outDir);
	}
	// Build story cards
	_helper(args.story, async function(jsonObj) {
		console.log("Building your story cards...");
		buildStoryCards(jsonObj.title, jsonObj.story_cards, args.outDir);
	});
	// Build fog tiles
	_helper(args.fog, function(jsonObj) {
		console.log("Building your fog tiles...");
		buildFogTiles(jsonObj, args.outDir);
	});

	/*
	console.log("Merging PDF files...");
	mergePDFs.merge(process.cwd() + "/out");
	*/
}

/**
 *
 * @param {*} args
 */
function parseArguments(args) {
	const cwd = process.cwd();
	//TODO: handle 'help' argument
	let outDir = args.find((el) => {return el.includes("--out-dir=")});
	if (outDir != undefined)
		outDir = outDir.split('=')[1];
	else
		outDir = "./out";
	let storyArg = args.find((el) => {return el.includes("--story=")});
	if (storyArg != undefined)
		storyArg = storyArg.split('=')[1];
	let fogArg = args.find((el) => {return el.includes("--fog=")});
	if (fogArg != undefined)
		fogArg = fogArg.split('=')[1];
	return {
		outDir: outDir,
		story: storyArg,
		fog: fogArg
	};
}

/**
 * Build Andor story cards and output as ready-to-print PDF files
 * @param {string} title        Title of your campaign
 * @param {object} story_cards  Object conaining card declarations
 */
function buildStoryCards(title, story_cards, outDir) {
	for (i = 0; i < story_cards.length; i++) {
		let params = [];
		params.push("title="+title);
		params.push("index_1="+story_cards[i].index);
		params.push("content_1="+story_cards[i].content);
		if (story_cards[i].background) {
			params.push("background_1="+story_cards[i].background);
		} else {
			// assets/Andor_Blankocard-1.png
			params.push("background_1=../assets/Andor_Blankocard-1.png");
		}
		i++;
		if (i < story_cards.length) {
			params.push("index_2="+story_cards[i].index);
			params.push("content_2="+story_cards[i].content);
			if (story_cards[i].background) {
				params.push("background_2="+story_cards[i].background);
			} else {
				params.push("background_2=../assets/Andor_Blankocard-1.png");
			}
		}
		(async (params, index) => {
			const browser = await puppeteer.launch({headless: true});
			const page = await browser.newPage();
			await page.goto("file:///"
				+ process.cwd()
				+ "/templates/story-template.html?"
				+ encodeURI(params.join("&")));
			await page.pdf({path: `${outDir}/card-${index}.pdf`, format: "A4", printBackground: true});
			await browser.close();
		})(params, `${i}-${i+1}`);
	}
}

/**
 *
 * @param {*} jsonObj
 */
function buildFogTiles(jsonObj, outDir) {
	(async () => {
		const browser = await puppeteer.launch({headless: true});
		const page = await browser.newPage();
		await page.goto("file:///"
			+ process.cwd()
			+ "/templates/fog-template.html?json="
			+ encodeURI(JSON.stringify(jsonObj)));
		await page.pdf({path: `${outDir}/fog.pdf`, format: "A4"});
		await browser.close();
	})();
}

function echoHelp() {
	let helpString = `//TODO: help string`;
	console.log(helpString);
}
