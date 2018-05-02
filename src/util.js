const request = require('request');
const JSSoup = require('jssoup').default;

const getHtmlFromUrl = (url) => {
	return new Promise((resolve, reject) => {
		request(url, (err, response, body) => {
			if(err)
				reject(err);
			else
				resolve(body);
		});
	});
};

const getSoupStrings = (content) => {
	if(content._text !== undefined)
		return content._text;
	else if(content.name !== undefined) {
		if(content.name == 'br')
			return '\n';
		else if(content.contents !== undefined) {
			let ret = '';

			content.contents.forEach((content) => {
				ret += getSoupStrings(content);
			});

			return ret;
		}
	}

	return '';
};

const removeDoubleNewline = (str) => {
	return str.replace(/\n\n/g, '\n');
};

module.exports = exports = {
	getHtmlFromUrl,
	getSoupStrings,
	removeDoubleNewline,
	JSSoup,
};
