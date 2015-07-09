//========== importing dependencies
var path = require('path');
var config = require('./config.js');
// var cmd = require('./iedCmd.js');
var sqlite3 = require('sqlite3').verbose();
var Promise = require('bluebird');
var moment = require('moment');


if (typeof require !== '') XLS = require('xlsjs');


//========== assigning args
var args = process.argv;
var fileName = path.basename(process.argv[2]);
var file_path = path.join(__dirname, process.argv[2]);
var dirname = path.dirname(file_path);
var fileExt = path.extname(fileName);
var doCmd = process.argv[3];


//========= const & configuration  
var areaCode = fileName.split(".xls")[0];
var validHeaders = config.colHeaders;
var ERR = config.err;
var dbConfig = config.dbConfig;
// var myDB = new sqlite3.Database(path.resolve(dbConfig.path));
var feedFileHeaders = config.feedHeader;



//=============== helper functions
// helper function

var sendResults = function(json) {
	var results = {};
	if (json) {
		results.success = true;
		results.data = json;
	} else
		results.sucess = false;
	return results;
};

var to_csv_rows = function(workbook, addRowID) {
		var result = [];
		workbook.SheetNames.forEach(function(sheetName) {
			var csv = XLS.utils.make_csv(workbook.Sheets[sheetName]);
			// if (csv.length > 0) {
			result.push(csv.toUpperCase().split('\n'));
			//}
		});
		if (addRowID)
			result[0] = result[0].map(function(item, idx) {
				if (item.indexOf('UNIT_CODE') >= 0)
					return 'rowNum,' + item;
				return 'row_' + (idx + 1) + "," + item;
			})
		return result;
	}
	// ============= extracting data
var convertToJson = function(arr, allowedColumns) {

	var headerArr = arr[0];
	var dataArr = arr.slice(1);

	//feedData=dataArr;
	//feedData=arr.concat(dataArr);

	var jsonArr = dataArr.map(function(e) {
		var obj = {};
		e.forEach(function(f, id) {
			if (allowedColumns.indexOf(headerArr[id]) >= 0)
				obj[headerArr[id]] = isNaN(+f) ? f : +f;
		});
		return obj;
	});
	//feedData=dataArr; 
	//feedData[dataArr.length]=headerArr;
	// some side effect happening here - reason unknown - to be fixed
	return jsonArr;
}



// =============== validate  headers
var check_for_size = function(feedData) {
	var headerLength = (feedData[0]).length;
	return feedData.every(function(e) {
		if (e.length != headerLength) ERR.push('table size  mismatch')
		return e.length == headerLength;
	})
}

//========== api start
console.info('Parsing file:', fileName, ' @ ', file_path);
console.info('Area code:', (fileName.split(".xls")[0]));

var workbook = XLS.readFile(file_path);


//============ parsed data
var addRowID = true;
var csvRows = ((to_csv_rows(workbook, addRowID))[0]);

// check for header rows

var headerRowIdx = 0;
var headerPresent = false;
var headerRow;
csvRows.forEach(function(valArr, idx) {
	var val = valArr;
	if (val.indexOf("DISCP") > 0) {
		headerPresent = (val.indexOf("UNIT") && val.indexOf("DCD") && val.indexOf("2015") && val.indexOf("2016") && val.indexOf("2017") && val.indexOf("2018") && val.indexOf("2019")) > 0;
		if (headerPresent) {
			headerRowIdx = idx;
			//console.log(valArr);
		}
	}
	return headerPresent;
});


console.log("header row present:", headerPresent, "located at", headerRowIdx);

// get index of headers
headerRow = csvRows[headerRowIdx].split(",");
var headerIndexes = [];
headerIndexes.push(headerRow.indexOf("UNIT"));
headerIndexes.push(headerRow.indexOf("DCD"));
headerIndexes.push(headerRow.indexOf("2015"));
headerIndexes.push(headerRow.indexOf("2016"));
headerIndexes.push(headerRow.indexOf("2017"));
headerIndexes.push(headerRow.indexOf("2018"));
headerIndexes.push(headerRow.indexOf("2019"));

console.log("indexes:", headerIndexes);

// make into an array

csvRows = csvRows.map(function(val, idx) {
	return val.split(",");
})

// filter all data rows ie. unit column not empty
csvRows = csvRows.filter(function(val) {
	return val[headerIndexes[0]]
})

// convert to json
var dataJson = convertToJson(csvRows, ["row_1", "UNIT", "DCD", "2015", "2016", "2017", "2018", "2019"])
// console.log(dataJson);


// connect to database

var myDB = new sqlite3.Database(path.resolve(dbConfig.path));


// delete all records for the given areacode

var resetSanc = function(obj) {
	console.log('deleting  records for area :', obj);

	var p = new Promise(function(resolve, reject) {
		var db = myDB;
		//db.on('profile', function(stmt, time) {
		//	console.info("executed in ", time, "ms : ", stmt)
		//});
		db.serialize(function() {
			var stmt = db.prepare('delete from sanc where substr(unit,2,2)=? and year not in (?)');
			stmt.run([obj, 2015], function(err, result) {
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
	return p;
}




// inserting records

var insertInSanc = function(obj) {
console.log('inserting records');
var db = myDB;
var row_num;
var cb = function(err, result) {
	if(err)
	console.log("err@", err, result);
};

//var stmt = db.prepare("Insert or replace into sanc values ( ?,?,?,?)");
var q="Insert or replace into sanc values ( ?,?,?,?)";
  db.on('trace', console.info);
db.serialize(function() {
	obj.forEach(function(item, idx) {
		row_num = item.row_1;
		var val = [item];

		// console.log('inserting record :',item,(+item['2016'])>0);

		if ((+item['2016'])>0) {
			db.run(q,[2016, item.UNIT, item.DCD, +(item['2016'])], cb);
			//stmt.finalize();
		}
		if ((+item['2017'])>0) {
			db.run(q,[2017, item.UNIT,item.DCD, +(item['2017'])], cb);
			//stmt.finalize();
		}
		if ((+item['2018'])>0) {
			db.run(q,[2018, item.UNIT, item.DCD, +(item['2018'])], cb);
			//stmt.finalize();
		}
		if ((+item['2019'])>0) {
			db.run(q,[2019, item.UNIT, item.DCD, +(item['2019'])], cb);
			//stmt.finalize();
		}

	})

});
};

resetSanc(areaCode).then(function(){
insertInSanc(dataJson);	
});
