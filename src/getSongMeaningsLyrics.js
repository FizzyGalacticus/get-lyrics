const util = require('./util');

const formatStr = (str) => {
	let retStr = str.replace(/ /g, '+');
	return escape(retStr);
};

const getLyricsPageUrl = (artist, songTitle) => {
	const formattedArtist = formatStr(artist);
	const formattedSongTitle = formatStr(songTitle);
	const searchUrl = `http://songmeanings.com/query/?query=${formattedArtist}+${formattedSongTitle}&type=all`;

	return new Promise(async (resolve, reject) => {
		try {
			const searchHtml = await util.getHtmlFromUrl(searchUrl);
			const soup = new util.JSSoup(searchHtml);
			const table = soup.find('table', {summary: 'table'})
			let found = false;
			let songId = '';

			table.contents.forEach((content) => {
				if(content.name == 'tbody') {
					const trs = content.findAll('tr', {class: 'item'});

					trs.forEach((td) => {
						const atags = td.findAll('a');

						atags.forEach((a) => {
							if(typeof a.attrs.title == 'string') {
								if(a.attrs.title.toLowerCase() == songTitle.toLowerCase()) {
									let href = a.attrs.href;

									if(href[href.length - 1] == '/')
										href = href.substr(0, href.length - 1);

									const splitHref = href.split('/');

									songId = splitHref[splitHref.length - 1];
									found = true;
								}
							}
						});
					});
				}
			});

			if(found)
				resolve(`http://songmeanings.com/songs/view/${songId}`);
			else
				reject('Could not find lyrics page link.');
		}
		catch(err) {
			reject(`Couldn't get search html: ${err}`);
		}
	});
};

module.exports = exports = (artist, songTitle) => {
	return new Promise(async (resolve, reject) => {
		try {
			const lyricsPageUrl = await getLyricsPageUrl(artist, songTitle);
			const html = await util.getHtmlFromUrl(lyricsPageUrl);
			const soup = new util.JSSoup(html);
			const lyricBox = soup.find('div', {class: 'lyric-box'});
			let lyrics = '';

			lyricBox.contents.forEach((content) => {
				lyrics += util.getSoupStrings(content);
			});

			lyrics = util.removeDoubleNewline(lyrics);

			const editLyricsIndex = lyrics.indexOf('Edit Lyrics');
			lyrics = lyrics.substr(0, editLyricsIndex);

			resolve(lyrics);
		}
		catch(err) {
			reject(`Could not get html: ${err}`);
		}
	});
};
