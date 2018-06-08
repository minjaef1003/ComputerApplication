// 모바일ATM Mgr

//===== MySQL 데이터베이스를 사용할 수 있도록 하는 mysql 모듈 불러오기 =====//
var mysql = require('mysql');

//===== MySQL 데이터베이스 연결 설정 =====//
var pool      =    mysql.createPool({
    connectionLimit : 10, 
    host     : 'localhost',
    user     : 'root',
    password : '1111',
    database : 'mobileatm',
    debug    :  false
});

// 모바일ATM 계좌를 보여주는 함수
var showMobileATMAccount = function(callback) {
	
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            callback(err, null);
            return;
        }   
          
        var columns = ['count_num', 'count_type', 'count_bal'];
        var tablename = 'countinformation';
 
        // SQL 문을 실행합니다.
        var exec = conn.query("select ?? from ?? where isMobileATM = 'O'", [columns, tablename], function(err, rows) {
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

// 모바일ATM 등록되지 않은 계좌를 보여주는 함수
var showNoMobileATMAccount = function(callback) {
	
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            callback(err, null);
            return;
        }   
          
        var columns = ['count_num', 'count_type', 'count_bal'];
        var tablename = 'countinformation';
 
        // SQL 문을 실행합니다.
        var exec = conn.query("select ?? from ?? where isMobileATM is null", [columns, tablename], function(err, rows) {
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

//임시 계좌 발급하는 함수
var addAccount = function(count_num, count_rate, count_type, count_bal, callback) {
    
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
    	var data = {count_num:count_num, count_rate:count_rate, count_type:count_type, count_bal:count_bal};
    	
        // SQL 문을 실행함
        var exec = conn.query('insert into countinformation set ?', data, function(err, result) {
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

// 모바일ATM 계좌 등록 함수
var addMobileATMAccount = function(count_num, callback) {
    
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            
            callback(err, null);
            return;
        }   

        var column = 'isMobileATM';
        var tablename = 'countinformation';
    	
        // SQL 문을 실행함
        var exec = conn.query("update ?? set ??='O' where count_num=?", [tablename, column, count_num], function(err, result) {
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

// 모바일ATM 계좌 해제 함수
var deleteMobileATMAccount = function(count_num, callback) {
    
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            
            callback(err, null);
            return;
        }   

        var column = 'isMobileATM';
        var tablename = 'countinformation';
    	
        // SQL 문을 실행함
        var exec = conn.query("update ?? set ??=null where count_num=?", [tablename, column, count_num], function(err, result) {
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

// 모바일ATM 계좌 목록 라우팅 함수
var showmobileatmaccount = function(req, res) {
    console.log('/process/showmobileatmaccount 호출됨.');
    
    // pool 객체가 초기화된 경우, showMobileATMAccount 함수 호출하여 계좌 목록 전송
    if (pool) {
        showMobileATMAccount(function(err, accountList) {
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

// 모바일ATM 등록되지 않은 계좌 목록 라우팅 함수
var shownomobileatmaccount = function(req, res) {
    console.log('/process/shownomobileatmaccount 호출됨.');
    
    // pool 객체가 초기화된 경우, showNoMobileATMAccount 함수 호출하여 계좌 목록 전송
    if (pool) {
        showNoMobileATMAccount(function(err, accountList) {
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
var issueaccount = function(req, res) {
	console.log('/process/issueaccount 호출됨.');

    var paramNum = req.body.count_num || req.query.count_num;
    var paramRate = req.body.count_rate || req.query.count_rate;
    var paramType = req.body.count_type || req.query.count_type;
    var paramBal = req.body.count_bal || req.query.count_bal;
    
    // pool 객체가 초기화된 경우, addAccount 함수 호출하여 계좌 추가
	if (pool) {
		addAccount(paramNum, paramRate, paramType, paramBal, function(err, addedAccount) {
			// 동일한 계좌번호로 추가하려는 경우 에러 발생 - 클라이언트로 에러 전송
			if (err) {
                console.error('계좌 추가 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>계좌 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
            // 결과 객체 있으면 성공 응답 전송
			if (addedAccount) {
				console.dir(addedAccount);

				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>계좌 추가 성공</h2>');
                res.write("<br><br><a href='/mobileATM.html'>모바일ATM 메인화면 돌아가기</a>");
				res.end();
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>계좌 추가 실패</h2>');
				res.end();
			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};

// 모바일ATM 계좌 등록 라우팅 함수
var addmobileatmaccount = function(req, res) {
	console.log('/process/addmobileatmaccount 호출됨.');

    var paramNum = req.body.count_num || req.query.count_num;
    
    // pool 객체가 초기화된 경우, addMobileATMAccount 함수 호출하여 계좌 추가
	if (pool) {
		addMobileATMAccount(paramNum, function(err, addedAccount) {

			if (err) {
                console.error('모바일ATM 계좌 추가 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>모바일ATM 계좌 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
            // 결과 객체 있으면 성공 응답 전송
			if (addedAccount) {
				console.dir(addedAccount);

				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>모바일ATM 계좌 추가 성공</h2>');
                res.write("<br><br><a href='/mobileATM.html'>모바일ATM 메인화면 돌아가기</a>");
				res.end();
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>모바일ATM 계좌 추가 실패</h2>');
				res.end();
			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};

// 모바일ATM 계좌 해제 라우팅 함수
var deletemobileatmaccount = function(req, res) {
	console.log('/process/deletemobileatmaccount 호출됨.');

    var paramNum = req.body.count_num || req.query.count_num;
    
    // pool 객체가 초기화된 경우, deleteMobileATMAccount 함수 호출하여 계좌 해제
	if (pool) {
		deleteMobileATMAccount(paramNum, function(err, deletedAccount) {

			if (err) {
                console.error('모바일ATM 계좌 해제 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>모바일ATM 계좌 해제 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
            // 결과 객체 있으면 성공 응답 전송
			if (deletedAccount) {
				console.dir(deletedAccount);

				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>모바일ATM 계좌 해제 성공</h2>');
                res.write("<br><br><a href='/mobileATM.html'>모바일ATM 메인화면 돌아가기</a>");
				res.end();
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>모바일ATM 계좌 해제 실패</h2>');
				res.end();
			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};

module.exports.showmobileatmaccount = showmobileatmaccount;
module.exports.shownomobileatmaccount = shownomobileatmaccount;
module.exports.issueaccount = issueaccount;
module.exports.addmobileatmaccount = addmobileatmaccount;
module.exports.deletemobileatmaccount = deletemobileatmaccount;