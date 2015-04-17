// Controls the interface between fonts.com and our application

var request = require('request')
	, fs = require('fs')
	, crypto = require('crypto');



var options = {
	host: 'https://api.fonts.com',
	path: '/rest/json/',
	method: 'GET',
	headers: {
		'Content-Type': 'application/json'
	}
};

var configFile = require('../../config/service-creds')['fonts_com'];

console.log(configFile);


var authKey = null; //null until we get it back from fonts.com

function getAuthKey () {

	var authOptions = {
			url: options.host + options.path + 'GetToken/', //set url to send request to
			qs: {
				'wfsemail':		configFile.email //query string operations
			},
			method: options.method,
			headers: {
				'Content-Type':	options.headers['Content-Type'],
				'AppKey':		configFile.app_key, // add the header params as specified in the docs http://www.fonts.com/web-fonts/developers/api/get-token
				'Password':		configFile.password
			}
		};

	request(authOptions, authResponse);

}


function authResponse(error, response, body) {

	// if no error is returned
	if (error === null) {

		var authorisation = JSON.parse(body);
		authKey = authorisation.Accounts.Account.AuthorizationKey;

	} else {

		console.log('Error: ' + error);

	}

	getFonts();

}


function isAuthKey () {

	// if we have a valid authKey, then we can get a list of fonts
	if (authKey !== null) {
		return true;
	} else {
		//else return with error message
		console.log('Cannot find authorization key for fonts.com');
		return false;
	}

}


function getAuthorisationHash(msg) {

	//console.log(authKey);

	//split our auth into 2 parts
	// [0] = public key
	// [1] = private key
	var keySplit = authKey.split('--');

	var hash64 = crypto.createHmac("md5", keySplit[1])
						.update(keySplit[0] + "|" + msg)
						.digest("base64");

	var urlencodedAuth = encodeURIComponent( keySplit[0] + ':' + hash64 );

	return urlencodedAuth;

}


function getFonts () {

	if (isAuthKey) {

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

	// TODO: Check server time, only run once per hour

	// if now running

	// First, we need to get our fonts.com authorisation key
	// commented out for now so doesnt hit service all the time
	//getAuthKey();

}