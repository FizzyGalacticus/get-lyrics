const util = require('./util');

const formatStr = (str) => {
	let retStr = str.toLowerCase();
	return retStr.replace(/ /g, '-');

};

module.exports = exports = (artist, songTitle) => {
	const formattedArtist = formatStr(artist);
	const formattedSongTitle = formatStr(songTitle);
	const url = `https://genius.com/${formattedArtist}-${formattedSongTitle}-lyrics`;

	return new Promise(async (resolve, reject) => {
		try {
			const html = await util.getHtmlFromUrl(url);
			const soup = new util.JSSoup(html);
			const lyricContainer = soup.find('div', {class: 'lyrics'});
			lyrics = '';

			lyricContainer.contents.forEach((tag) => {
				if(tag.name !== undefined) {
					tag.contents.forEach((content) => {
						lyrics += util.getSoupStrings(content);
					});
				}
			});

			lyrics = util.removeDoubleNewline(lyrics);

			resolve(lyrics);
		}
		catch(err) {
			reject(`Could not get html: ${err}`);
		}
	});
};
