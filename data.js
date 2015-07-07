// =======================
// public lib
// =======================
var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var json2csv = require('json2csv');


// =======================
// private lib
// =======================
var QUERY = require("./queryList.js").queryList;
var config = require('./config.js');
var myDB = new sqlite3.Database(path.resolve(config.dbConfig.path));



var resetSanc = function(obj, callback) {
	console.log('deleting  records for area :', obj);

	var p = new Promise(function(resolve, reject) {

		console.log(obj);

		// delete from sanc where unit=?
		var db = myDB;
		db.on('trace', console.info);
		db.serialize(function() {
			var stmt = db.prepare('delete from sanc where unit=?');
			stmt.run([obj], function(err, result) {
				if (err)
					reject({
						success: false,
						err: err
					});

				resolve(sendResults([result]));
			});
			stmt.finalize();
		});

		//db.close();

	});


	// Manter compatibilidade com callbacks
	if (!callback)
		return p;
	p.then(function(new_name) {
		callback(null, new_name);
	}).catch(function(err) {
		callback(err);
	});
}




// =======================
// public api
// =======================
module.exports.resetSanc=resetSanc;