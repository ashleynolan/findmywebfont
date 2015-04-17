
/**
 * Handles the db setup - adds the questions to the database if not there already
 * and handles the db connection
 */

var express = require('express')
	, pkg = require('../package.json')
	, Promise = require('es6-promise').Promise

	, sqlite3 = require('sqlite3').verbose()
	, fs = require("fs")
	, file = 'fontstack.db'
	, exists = fs.existsSync(file)
	, db

	, fontController = require('../app/controllers/fontController')
	, _this = this;

if (!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
} else {
	console.log('DB file already exists');
}

exports.createDBStructure = function (db) {

	return new Promise(function (resolve, reject) {

		// run the following commands in a series (in order)

		//create our tables, if they don't already exist

		// //create our Font Table – stores font information
		// Fields:
		// fontID : PrimaryKey
		// fontName : Name of the font
		//
		db.run("create table if not exists Font (fontID INTEGER PRIMARY KEY, fontName TEXT)");

		// //create our Service table – stores information on the font services themselves
		// Fields:
		// serviceID : PrimaryKey
		// serviceName : Name of the service i.e. fonts.com
		// url : URL to the homepage of the font service
		// lastCrawled : the date/time the service was last crawled so we dont hit it too often
		//
		//db.run("create table if not exists Service (serviceID INTEGER PRIMARY KEY, serviceName TEXT, url TEXT, lastCrawled)");

		// //create our link table – if a key pairing exists in this table, then the font exists for that service, with a URL for more info
		// Fields:
		// serviceID : ForeignKey
		// fontID : ForeignKey
		// url : URL to the specific font on that font service (if one exists)
		//
		// db.run("create table if not exists FontForService (,url TEXT)");

	});

}

module.exports = function (app, config) {

	db = new sqlite3.Database(file);

	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function callback () {
		// yay!
		console.log('Connnected to DB\n');

		//Once the DB is open, we need to check if our tables have been created
		_this.createDBStructure(db)

		.then(function () {
			console.log('yay');
			//can start sending requests to the font services (if we need to)
			fontController.getServiceData(app, db, config);
		})
		.catch(function (err) {
			console.log('ERR' + err);
		});

	});

	return db;
}


