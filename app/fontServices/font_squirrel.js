// Controls the interface between fonts.com and our application

var request = require('request')
	, fs = require('fs')
	, crypto = require('crypto');



var options = {
	host: 'http://www.fontsquirrel.com',
	path: '/api/fontlist/',
	method: 'GET',
	headers: {
		'Content-Type': 'application/json'
	}
};

//dont need any cred for font squirrel as its an open free service


function getFonts () {

	// Check the last crawled time in our db for this service, as we only want to run once every now and then
	//

	var fontRequestOptions = {
		url: options.host + options.path + 'AllFonts/',
		method: options.method,
		headers: {
			'Content-Type': options.headers['Content-Type'],
			'authorization': getAuthorisationHash('/rest/json/AllFonts/'),
			'appkey': configFile.app_key
		}
	};

	request(fontRequestOptions, fontListResponse);

}

function fontListResponse (error, response, body) {

	if (error == null) {

		var fontResponse = JSON.parse(body);

		//save the string response to file
		fs.writeFile('./app/data/fonts_com.json', body, fileHandler);

	}

}

function fileHandler (err, written, buffer) {

	if (err) {
		console.log(err);
	} else {
		console.log("The response was saved to file.");
	}

}




module.exports = function (app, db, config) {

	// makes the base call to get the fonts for the service
	getFonts();

}