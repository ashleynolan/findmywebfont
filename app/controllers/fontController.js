
/*!
 * Module dependencies.
 */

var async = require('async'),
	_this = this;


/**
 * Controls the getting and setting of fonts from different services
 * This will then be stored in my DB – currentl SQLite
 */

exports.getServiceData = function(app, db, config) {

	// TODO: Check server time, only run once per hour
	// will be stored in the DB for each service

	// get fonts.com fonts
	require('../fontServices/fonts_com')(app, db, config);

	//require font_squirrel fonts
	require('../fontServices/font_squirrel')(app, db, config);

}

exports.canWeCrawlService = function (serviceName) {

}