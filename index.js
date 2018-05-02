const getGeniusLyrics = require('./src/getGeniusLyrics');
const getSongMeaningsLyrics = require('./src/getSongMeaningsLyrics');

const getLyrics = (artist, songTitle) => {
	return new Promise(async (resolve, reject) => {
		let lyrics;
		let sourceName;
		let retrieved = false;
		const errs = [];

		const sources = [
			{
				name: 'Genius',
				fn: getGeniusLyrics,
			},
			{
				name: 'Song Meanings',
				fn: getSongMeaningsLyrics,
			},
		];

		for(const source of sources) {
			try {
				lyrics = await source.fn(artist, songTitle);
				sourceName = source.name;
				retrieved = true;
			}
			catch(err) {
				errs.push(err);
			}

			if(retrieved)
				break;
		}

		if(retrieved)
			resolve({sourceName, lyrics});
		else
			reject(errs);
	});
};

module.exports = exports = {
	getGeniusLyrics,
	getSongMeaningsLyrics,
	getLyrics,
};
