// 계좌 Mgr

//===== MySQL 데이터베이스를 사용할 수 있도록 하는 mysql 모듈 불러오기 =====//
var mysql = require('mysql');

//===== MySQL 데이터베이스 연결 설정 =====//
var pool      =    mysql.createPool({
    connectionLimit : 10, 
    host     : 'localhost',
    user     : 'root',
    password : 'cjswo465',
    database : 'computerapplication',
    debug    :  false
});

// 전체 계좌를 보여주는 함수
var checkAllAccount = function(callback) {
	
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            callback(err, null);
            return;
        }   
          
        var columns = ['count_date', 'count_rate', 'count_num', 'count_bal', 'count_type', 'count_owner', 'count_ownerID', 'isMobileATM'];
        var tablename = 'countinformation';
 
        // SQL 문을 실행합니다.
        var exec = conn.query("select ?? from ?? ", [columns, tablename], function(err, rows) {
            conn.release();  // 반드시 해제해야 함
            console.log('실행 대상 SQL : ' + exec.sql);
            
            if (rows.length > 0) {
    	    	callback(null, rows);
            } else {
    	    	callback(null, null);
            }
        });

        conn.on('error', function(err) {      
            console.log('데이터베이스 연결 시 에러 발생함.');
            console.dir(err);
            
            callback(err, null);
      });
    });
	
}

// 내 계좌 목록을 보여주는 함수
var checkMyAccount = function(ID, callback) {
	
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            callback(err, null);
            return;
        }   
          
        var columns = ['count_date', 'count_rate', 'count_num', 'count_bal', 'count_type', 'count_owner', 'count_ownerID', 'isMobileATM'];
        var tablename = 'countinformation';
        
        
        // SQL 문을 실행합니다.
        var exec = conn.query("select ?? from ?? where count_ownerID = ?", [columns, tablename, ID], function(err, rows) {
            conn.release();  // 반드시 해제해야 함
            console.log('실행 대상 SQL : ' + exec.sql);
            
            if (rows.length > 0) {
    	    	callback(null, rows);
            } else {
    	    	callback(null, null);
            }
        });

        conn.on('error', function(err) {      
            console.log('데이터베이스 연결 시 에러 발생함.');
            console.dir(err);
            
            callback(err, null);
      });
    });
	
}

//계좌를 등록하는 함수
var registAccount = function(count_rate, count_type, count_owner, count_ownerID, callback) {
    
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            
            callback(err, null);
            return;
        }   

    	// 데이터를 객체로 만듦
    	var data = {count_rate:count_rate, count_bal:0, count_type:count_type, count_owner:count_owner, count_ownerID:count_ownerID};
    	
        // SQL 문을 실행함
        var exec = conn.query('insert into countinformation set count_date = curdate(), ?', data, function(err, result) {
        	conn.release();  // 반드시 해제해야 함
        	console.log('실행 대상 SQL : ' + exec.sql);
        	
        	if (err) {
        		console.log('SQL 실행 시 에러 발생함.');
        		console.dir(err);
        		
        		callback(err, null);
        		
        		return;
        	}
        	
        	callback(null, result);
        	
        });
        
        conn.on('error', function(err) {      
              console.log('데이터베이스 연결 시 에러 발생함.');
              console.dir(err);
              
              callback(err, null);
        });
    });
	
}

// 계좌를 해지하는 함수
var deleteAccount = function(count_num, callback) {
    
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            
            callback(err, null);
            return;
        }   
        
        var tablename = 'countinformation';
    	
        // SQL 문을 실행함
        var exec = conn.query("delete from ?? where count_num=?", [tablename, count_num], function(err, result) {
        	conn.release();  // 반드시 해제해야 함
        	console.log('실행 대상 SQL : ' + exec.sql);
        	
        	if (err) {
        		console.log('SQL 실행 시 에러 발생함.');
        		console.dir(err);
        		
        		callback(err, null);
        		
        		return;
        	}
        	
        	callback(null, result);
        	
        });
        
        conn.on('error', function(err) {      
              console.log('데이터베이스 연결 시 에러 발생함.');
              console.dir(err);
              
              callback(err, null);
        });
    });
	
}

// 입금 함수
var depositAccount = function(count_num, depositMoney, callback) {
    
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            
            callback(err, null);
            return;
        }   

        var tablename = 'countinformation';
    	
        // SQL 문을 실행함
        var exec = conn.query("update ?? set count_bal=count_bal + " + depositMoney + " where count_num=?", [tablename, count_num], function(err, result) {
        	conn.release();  // 반드시 해제해야 함
        	console.log('실행 대상 SQL : ' + exec.sql);
        	
        	if (err) {
        		console.log('SQL 실행 시 에러 발생함.');
        		console.dir(err);
        		
        		callback(err, null);
        		
        		return;
        	}
        	
        	callback(null, result);
        	
        });
        
        conn.on('error', function(err) {      
              console.log('데이터베이스 연결 시 에러 발생함.');
              console.dir(err);
              
              callback(err, null);
        });
    });
	
}

// 출금 함수
var withdrawAccount = function(count_num, withdrawMoney, callback) {
    
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            
            callback(err, null);
            return;
        }   

        var tablename = 'countinformation';
    	
        // SQL 문을 실행함
        var exec = conn.query("update ?? set count_bal=count_bal - " + withdrawMoney + " where count_num=?", [tablename, count_num], function(err, result) {
        	conn.release();  // 반드시 해제해야 함
        	console.log('실행 대상 SQL : ' + exec.sql);
        	
        	if (err) {
        		console.log('SQL 실행 시 에러 발생함.');
        		console.dir(err);
        		
        		callback(err, null);
        		
        		return;
        	}
        	
        	callback(null, result);
        	
        });
        
        conn.on('error', function(err) {      
              console.log('데이터베이스 연결 시 에러 발생함.');
              console.dir(err);
              
              callback(err, null);
        });
    });
	
}

// 전체 계좌 목록 라우팅 함수
var routeCheckAllAccount = function(req, res) {
    console.log('/process/routeCheckAllAccount 호출됨.');
    
    // pool 객체가 초기화된 경우, checkAllAccount 함수 호출하여 계좌 목록 전송
    if (pool) {
        checkAllAccount(function(err, accountList) {
            if (err) {
                console.error('계좌 목록 불러오는 중 에러 발생 : ' + err.stack);
                return;
            }
            
            if (accountList) {
                console.log('계좌 목록 불러오기 성공');
                res.send(accountList);
                res.end();
            } else {
                console.log('계좌 목록 불러오기 실패');
                res.send(200, false);
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
}

// 내 계좌 목록 라우팅 함수
var routeCheckMyAccount = function(req, res) {
    console.log('/process/routeCheckMyAccount 호출됨.');
    var paramID = req.user[0]["id"];
    // pool 객체가 초기화된 경우, checkMyAccount 함수 호출하여 계좌 목록 전송
    if (pool) {
        checkMyAccount(paramID, function(err, accountList) {
            if (err) {
                console.error('계좌 목록 불러오는 중 에러 발생 : ' + err.stack);
                return;
            }
            
            if (accountList) {
                console.log('계좌 목록 불러오기 성공');
                res.send(accountList);
                res.end();
            } else {
                console.log('계좌 목록 불러오기 실패');
                res.send(200, false);
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
}

// 계좌 등록 라우팅 함수
var routeRegistAccount = function(req, res) {
    console.log('/process/routeRegistAccount 호출됨.');
    
    var paramRate = req.body.count_rate || req.query.count_rate;
    var paramType = req.body.count_type || req.query.count_type;
    var paramName = req.user[0]["Name"];
    var paramID = req.user[0]["id"];
    
    // pool 객체가 초기화된 경우, registAccount 함수 호출하여 계좌 등록
    if (pool) {
        registAccount(paramRate, paramType, paramName, paramID, function(err, addedAccount) {
			// 동일한 계좌번호로 추가하려는 경우 에러 발생 - 클라이언트로 에러 전송
			if (err) {
                console.error('계좌 추가 중 에러 발생 : ' + err.stack);
                return;
            }
			
            // 결과 객체 있으면 성공 응답 전송
			if (addedAccount) {
                console.log('계좌 추가 성공');
                res.send({msg:"success"});
                res.end();
			} else {
				console.log('계좌 추가 실패');
                res.send(200, false);
                res.end();
			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
	
}

// 계좌 해제 라우팅 함수
var routeDeleteAccount = function(req, res) {
    console.log('/process/routeDeleteAccount 호출됨.');
    
    var paramNum = req.body.count_num || req.query.count_num;
    
    // pool 객체가 초기화된 경우, deleteAccount 함수 호출하여 계좌 해지
    if (pool) {
        deleteAccount(paramNum, function(err, account) {
            if (err) {
                console.error('계좌 해지 중 에러 발생 : ' + err.stack);
                return;
            }
            
            if (account) {
                console.log('계좌 해지 성공');
                res.send({msg:"success"});
                res.end();
            } else {
                console.log('계좌 해지 실패');
                res.send(200, false);
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
}

// 입금 라우팅 함수
var routeDepositAccount = function(req, res) {
    console.log('/process/routeDepositAccount 호출됨.');
    
    var paramNum = req.body.count_num || req.query.count_num;
    var paramMoney = req.body.depositMoney || req.query.depositMoney;
    
    // pool 객체가 초기화된 경우, depositAccount 함수 호출하여 입금
    if (pool) {
        depositAccount(paramNum, paramMoney, function(err, account) {
            if (err) {
                console.error('입금 중 에러 발생 : ' + err.stack);
                return;
            }
            
            if (account) {
                console.log('입금 성공');
                res.send({msg:"success"});
                res.end();
            } else {
                console.log('입금 실패');
                res.send(200, false);
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
}

// 출금 라우팅 함수
var routewithdrawAccount = function(req, res) {
    console.log('/process/routewithdrawAccount 호출됨.');
    
    var paramNum = req.body.count_num || req.query.count_num;
    var paramMoney = req.body.withdrawMoney || req.query.withdrawMoney;
    
    // pool 객체가 초기화된 경우, withdrawAccount 함수 호출하여 출금
    if (pool) {
        withdrawAccount(paramNum, paramMoney, function(err, account) {
            if (err) {
                console.error('출금 중 에러 발생 : ' + err.stack);
                return;
            }
            
            if (account) {
                console.log('출금 성공');
                res.send({msg:"success"});
                res.end();
            } else {
                console.log('출금 실패');
                res.send(200, false);
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
}

// 이체 라우팅 함수
var routeTransferAccount = function(req, res) {
    console.log('/process/routeTransferAccount 호출됨.');
    
    var paramNum = req.body.transfer_count_num || req.query.transfer_count_num;
    var paramNum2 = req.body.receiver_count_num || req.query.receiver_count_num;
    var paramMoney = req.body.transferMoney || req.query.transferMoney;
    
    // pool 객체가 초기화된 경우, transferAccount 함수 호출하여 이체
    if (pool) {
        withdrawAccount(paramNum, paramMoney, function(err, account) {
            if (err) {
                console.error('이체 중 에러 발생 : ' + err.stack);
                return;
            }
            if (account) {
                console.log('출금 성공');
            } else {
                console.log('출금 실패');
                res.send(200, false);
                res.end();
            }
        });
        depositAccount(paramNum2, paramMoney, function(err, account) {
            if (err) {
                console.error('이체 중 에러 발생 : ' + err.stack);
                return;
            }
            if (account) {
                console.log('입금 성공');
                var msg ={msg:"success"};
                res.send(msg);
                res.end();
            } else {
                console.log('입금 실패');
                res.send(200, false);
                res.end();
            }
        });

    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
    
}

module.exports.routeCheckAllAccount = routeCheckAllAccount;
module.exports.routeCheckMyAccount = routeCheckMyAccount;
module.exports.routeRegistAccount = routeRegistAccount;
module.exports.routeDeleteAccount = routeDeleteAccount;
module.exports.routeDepositAccount = routeDepositAccount;
module.exports.routewithdrawAccount = routewithdrawAccount;
module.exports.routeTransferAccount = routeTransferAccount;