//config.js


var columnHeaders = ['UNIT', 'DCD', 'YEAR'];
var dbHeaders = ['YEAR', 'UNIT', 'DCD', 'SAN'];

//var feedHeader=['UNIT_CODE','SECT','GDSCD','DSCD','RM','RF','SM','SF','REMARK']

var db_config = {

	//  	path: '/home/shadowfox/Desktop/umrer_stage_ii/backup_2015_03_07'
	path: "E:\\work\\5yr_Budget-19-20\\upload\\mines"
};

var err = [];

module.exports.colHeaders = columnHeaders;
module.exports.dbConfig = db_config;
module.exports.err = err;
module.exports.dbHeaders = dbHeaders;