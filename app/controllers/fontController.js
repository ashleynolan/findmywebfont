
/*!
 * Module dependencies.
 */

var async = require('async');


/**
 * Controls the getting and setting of fonts from different services
 */

module.exports = function (app, config) {

	// TODO: Check server time, only run once per hour

	require('../fontServices/fonts_com')(app, config);

}