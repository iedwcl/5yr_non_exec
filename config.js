//config.js


var columnHeaders = ['UNIT', 'DCD', 'YEAR'];
var dbHeaders = ['YEAR', 'UNIT', 'DCD', 'SAN'];

//var feedHeader=['UNIT_CODE','SECT','GDSCD','DSCD','RM','RF','SM','SF','REMARK']

var db_config = {

	  	path: '/home/shadowfox/Desktop/Work/MPB_15-2020/github/mines'
	// path: "E:\\work\\5yr_Budget-19-20\\upload\\mines"
};

var err = [];

module.exports.colHeaders = columnHeaders;
module.exports.dbConfig = db_config;
module.exports.err = err;
module.exports.dbHeaders = dbHeaders;
