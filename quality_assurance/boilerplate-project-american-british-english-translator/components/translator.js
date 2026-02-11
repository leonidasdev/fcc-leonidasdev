const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
	translate(text, locale) {
		if (text === undefined || text === null) return { error: 'No text to translate' };
		if (typeof text !== 'string') text = String(text);

		let original = text;
		let translated = text;
		let changes = 0;

		const wrap = (str) => `<span class="highlight">${str}</span>`;

		const replaceWithHighlight = (input, from, to) => {
			const escaped = from.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
			const re = new RegExp('\\b' + escaped + '\\b', 'gi');
			return input.replace(re, (match) => {
				const isCapitalized = /^[A-Z]/.test(match);
				let replaced = to;
				if (isCapitalized) replaced = replaced.charAt(0).toUpperCase() + replaced.slice(1);
				changes++;
				return wrap(replaced);
			});
		};

		if (locale === 'american-to-british') {
			const dictionary = Object.assign({}, americanToBritishSpelling, americanOnly);
			const keys = Object.keys(dictionary).sort((a,b)=>b.length-a.length);
			for (const k of keys) {
				translated = replaceWithHighlight(translated, k, dictionary[k]);
			}
			// titles
			for (const [k,v] of Object.entries(americanToBritishTitles)) {
				const escaped = k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
				const re = new RegExp(escaped, 'gi');
				translated = translated.replace(re, (match)=>{
					// v is without dot
					const replaced = v.charAt(0).toUpperCase() + v.slice(1);
					changes++;
					return wrap(replaced);
				});
			}
			// time hh:mm -> hh.mm
			translated = translated.replace(/(\d{1,2}:\d{2})/g, (m)=>{ changes++; return wrap(m.replace(':','.')); });

		} else if (locale === 'british-to-american') {
			const inverseSpelling = Object.keys(americanToBritishSpelling).reduce((acc,k)=>{
				acc[americanToBritishSpelling[k]] = k; return acc;
			},{});
			const dictionary = Object.assign({}, inverseSpelling, britishOnly);
			const keys = Object.keys(dictionary).sort((a,b)=>b.length-a.length);
			for (const k of keys) {
				translated = replaceWithHighlight(translated, k, dictionary[k]);
			}
			// titles: british forms (v) -> american forms (k)
			for (const [k,v] of Object.entries(americanToBritishTitles)){
				const brit = v;
				const amer = k;
				const escaped = brit.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
				const re = new RegExp('\\b' + escaped + '\\b', 'gi');
				translated = translated.replace(re, (match)=>{
					const isCapitalized = /^[A-Z]/.test(match);
					let replaced = amer;
					if (isCapitalized) replaced = replaced.charAt(0).toUpperCase() + replaced.slice(1);
					changes++;
					return wrap(replaced);
				});
			}
			// time hh.mm -> hh:mm
			translated = translated.replace(/(\d{1,2}\.\d{2})/g, (m)=>{ changes++; return wrap(m.replace('.',':')); });

		} else {
			return { error: 'Invalid value for locale field' };
		}

		if (changes === 0) {
			return { text: original, translation: 'Everything looks good to me!' };
		}

		return { text: original, translation: translated };
	}
}

module.exports = Translator;