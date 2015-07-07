var queryList = {
	getDcd: "SELECT DISTINCT   gdesig name,    substr( d.dscd, -5 )  dcd  FROM desg d",
	getDcdFilter: "SELECT DISTINCT name sect,  gdesig name,  substr( d.dscd, -5 )  dcd  FROM desg d,   sectdesg sd,   section s WHERE sd.DESG = substr( d.dscd, -5 )    AND  s.code = sd.SECTION   AND  s.code = ? GROUP BY substr( d.dscd, -5 ) ORDER BY s.code, d.discp, substr( d.dscd, -5 )",
	getUpdateEmp: "update employee set    dob     =?,    desg    =?, ucde    =?, roll_ucde=?, sect    =?, inService  =?, out_type    =?, transfer_to =?, dor     =?, fit     =?, emp_type    =?, o_dcd =? where eis=?",
	getSanction: "select * from sanc_app where ucde=? order by substr(sect,1,2) desc limit ? offset ?",
	getSanctionCount: "select count(*) from sanc_app where ucde=? order by substr(sect,1,2) desc",
	getUpdateSanc: "Insert or replace into sanc values (? ,?, ?, ?, ?, ?, ?, ?, ?);",
	getConstant: 'select distinct * from const where tname=?',
	chartsumm_chart1: "select * from emp_summ_sys",
	chartsumm_chart2: "select * from emp_summ",
	chartsumm_unit_chart1: "select * from emp_summ_unit_sys where sys_areac=?",
	chartsumm_unit_chart2: "select * from emp_summ_unit where sys_areac=?",
	emp_detail: "select * from emp_final where unit_code=?",
	sanc_detail: "select * from sanc_final where UNIT_CD=? order by substr(sect,1,2) desc",
	findUser: "SELECT * FROM user where eis=?",
	attachAuth: "ATTACH DATABASE './server/data/app_log' as auth;",
	detachAuth: "detach DATABASE auth;",
	attach_appLog: "ATTACH DATABASE './server/data/auth' as app_log;",
	detach_appLog: "detach DATABASE app_log;",
	findUserExists: "SELECT (CASE WHEN (a.eis is  null )THEN 0   ELSE 1    END) as  hasAccount,e.eis  eis ,e.name name FROM employee e left join auth.user a on e.eis=a.eis  where e.eis=?",
	createUser: " INSERT OR REPLACE INTO user VALUES (?,?,?,?,?)"
}
var update = {
	log: {
		alog: {},
		emp: {}
	},
	emp: {
		emp: {
			add_red: 'update employee set inService=?, out_type=? where eis=?;'
		}
	}
};
var insert = {
	log: {
		alog: {},
		emp: {
			add_red: 'Insert into employee values (?,?,DATE(),?,?,?,?);'
		}
	},
	emp: {
		emp: {},
		emp_tran: {
			add_red: 'Insert into emp_transaction values (?,?,?,?,DATE(),?);'
		}

	}
};
var select = {
	log: {
		alog: {
			add_red: ''
		},
		emp: {
			add_red: ''
		}
	},
	emp: {
		emp: {
			getByEIS: 'SELECT * FROM employee where eis=?'
		}
	}

};
var operation = {
		update: update,
		insert: insert,
		select: select
	}
	/**
	 * [queries - wrapper function for retrieving queries]
	 * @param  {[string]} action [update/insert/select]
	 * @param  {[string]} db     [db name]
	 * @param  {[string]} table  [table name]
	 * @param  {[string]} key    [query identifier]
	 * @return {[string]}        [corresponding sql query]
	 */
var queries = function(action,db, table, key) {
	return operation[action][db][table][key];
}


module.exports.queryList = queryList;
module.exports.queries = queries;