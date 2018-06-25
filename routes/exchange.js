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

//환율조회-날짜 함수
//일자 입력 후 조회 버튼 선택 시 디비에 조회. 결과는 테이블로 
var showExchangeRateDate = function(dateString, callback) {
    // 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            callback(err, null);
            return;
        }   
          
        var columns = ['date', 'tableName'];
        var tablename = 'listExchangeRateRecordDate';
        var date = dateString.toString();
        
        // SQL 문을 실행합니다.
        var exec = conn.query("select ?? from ?? where date = '" + date + "';", [columns, tablename], function(err, rows) {
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
};

//환율조회-통화 함수
//테이블 네임을 통해 해당 날짜의 모든 통화와 환율을 조회.
var showExchangeRateCurrency = function(tableName, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            if(conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        
        var exec = conn.query(" select * from ??", [tableName], function(err, rows) {
//         var exec = conn.query("select * from ??", [tableName], function(err, rows) {
            conn.release();
            console.log('실행 대상 SQL : ' + exec.sql);
            
            if(rows.length > 0) {
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
};

// showExchangeRateDate, showExchangeCurrency 라우팅 함수
var showexchangeratedate = function(req, res) {
    console.log('/process/showexchangeratedate called');
    
    var dateString = req.body.dateString || req.query.dateString;
   
    // pool 객체가 초기화된 경우, showExchangeRateDate 함수 호출하여 환율 목록 전송
    if (pool) {
        showExchangeRateDate(dateString, function(err, tableName) {
            if (err) {
                console.error('환율 조회 - 날짜 불러오는 중 에러 발생 : ' + err.stack);
                return;
            }
            
            if (tableName) {
                console.log('환율 조회 - 날짜 불러오기 성공');
                //환울 조회 - 통화
               
                var tN = tableName[0]['tableName'].toString();
               
                showExchangeRateCurrency(tN, function(err, exchangeRateList) {
                    if (err) {
                        console.error('환율 조회 - 통화 불러오는 중 에러 발생 : ' + err.stack);
                        return;
                    }
                    
                    if(exchangeRateList) {
                        console.log('환율 조회 - 통화 불러오기 성공');
                        res.send(exchangeRateList);
                        res.end();
                    }
                    else {
                        console.log('환율 조회-통화 불러오기 실패');
                        res.send(200, false);
                        res.end();
                    }
                });
            } else {
                console.log('환율 조회 - 날짜 불러오기 실패');
                res.send(200, false);
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
};

//최근 환율날짜조회 함수
var showExchangeRateDateLatest = function(callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            if(conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        
        var exec = conn.query("select tableName from listexchangeraterecorddate order by date desc", function(err, rows) {
            conn.release();
            console.log('실행 대상 SQL : ' + exec.sql);
            
            if(rows.length > 0) {
                callback(null, rows[0]);
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
};

//최근 환율날짜통화조회 함수
var showExchangeRateCurrencyLatest = function(tableName, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            if(conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        
        var exec = conn.query("select currency from ??", [tableName], function(err, rows) {
            conn.release();
            console.log('실행 대상 SQL : ' + exec.sql);
            
            if(rows.length > 0) {
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
};

// showExchangeRateDateLatest, showExchangeRateCurrencyLatest 라우팅 함수
var showexchangeratecurrency = function(req, res) {
    console.log('/process/showexchangeratecurrency called');
   
    // pool 객체가 초기화된 경우, showExchangeRateDate 함수 호출하여 환율 목록 전송
    if (pool) {
        showExchangeRateDateLatest(function(err, tableName) {
            if (err) {
                console.error('환율 최근 날짜 조회 불러오는 중 에러 발생 : ' + err.stack);
                return;
            }
            
            if (tableName) {
                console.log('환율 최근 날짜 조회 - 날짜 불러오기 성공');
                //환울 조회 - 통화
               
                var tN = tableName['tableName'].toString();
               
                showExchangeRateCurrencyLatest(tN, function(err, exchangeRateCurrencyList) {
                    if (err) {
                        console.error('환율 최근 날짜 통화 조회 - 통화 불러오는 중 에러 발생 : ' + err.stack);
                        return;
                    }
                    
                    if(exchangeRateCurrencyList) {
                        console.log('환율 최근 날짜 통화 조회 - 통화 불러오기 성공');
                        res.send(exchangeRateCurrencyList);
                        res.end();
                    }
                    else {
                        console.log('환율 최근 날짜 통화 조회-통화 불러오기 실패');
                        res.send(200, false);
                        res.end();
                    }
                });
            } else {
                console.log('환율 최근 날짜 조회 - 날짜 불러오기 실패');
                res.send(200, false);
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
};

//최근환율 조회 - 통화를 받아 조회함.
var showExchangeRateLatest = function(tableName, currency, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            if(conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        
        var exec = conn.query("select exchangeRate from ?? where currency = '" + currency + "'", [tableName], function(err, rows) {
            conn.release();
            console.log('실행 대상 SQL : ' + exec.sql);
            
            if(rows.length > 0) {
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
};

// showExchangeRateDateLatest, showExchangeRateLatest 라우팅 함수
var showexchangeratelatest = function(req, res) {
    console.log('/process/showexchangeratelatest called');
    
    var currency = req.body.currency || req.query.currency;

    // pool 객체가 초기화된 경우, showExchangeRateDate 함수 호출하여 환율 목록 전송
    if (pool) {
        showExchangeRateDateLatest(function(err, tableName) {
            if (err) {
                console.error('최근 환율 조회 - 날짜 불러오는 중 에러 발생 : ' + err.stack);
                return;
            }
            
            if (tableName) {
                console.log('환율 최근 날짜 조회 - 날짜 불러오기 성공');
                //환울 조회 - 통화
               
                var tN = tableName['tableName'].toString();
               
                showExchangeRateLatest(tN, currency, function(err, exchangeRate) {
                    if (err) {
                        console.error('최근 환율 조회 - 통화 불러오는 중 에러 발생 : ' + err.stack);
                        return;
                    }
                    
                    if(exchangeRate) {
                        console.log('최근 환율 조회 - 통화 불러오기 성공');
                        res.send(exchangeRate);
                        res.end();
                    }
                    else {
                        console.log('최근 환율 조회 - 통화 불러오기 실패');
                        res.send(200, false);
                        res.end();
                    }
                });
            } else {
                console.log('최근 환율 조회- 날짜 불러오기 실패');
                res.send(200, false);
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
};

// 수령희망점 조회 함수
var selectStoreList = function(callback) {
     pool.getConnection(function(err, conn) {
        if(err) {
            if(conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        
        var exec = conn.query("select * from listStore", function(err, rows) {
//         var exec = conn.query("select * from ??", [tableName], function(err, rows) {
            conn.release();
            console.log('실행 대상 SQL : ' + exec.sql);
            
            if(rows.length > 0) {
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

// selectStoreList 라우팅 함수
var showStoreList = function(req, res) {
    console.log('/process/showStoreList called');
    
    // pool 객체가 초기화된 경우, selectStoreList 함수 호출하여 영업점 목록 조회
    if (pool) {
        selectStoreList(function(err, listStore) {
            if (err) {
                console.error('영업점 목록 조회 불러오는 중 에러 발생 : ' + err.stack);
                return;
            }
            
            if (listStore) {
                console.log('영업점 목록 조회 불러오기 성공');
                res.send(listStore);
                res.end();

            } else {
                console.log('영업점 목록 조회 불러오기 실패');
                res.send(200, false);
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
};

// 영업점에서 수령 예약 생성 함수
var createStoreReservation = function(store, date, money, currency, customer, account, resultMoney, callback) {
     pool.getConnection(function(err, conn) {
        if(err) {
            if(conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        
        var exec = conn.query("insert into listStoreReservation(store, date, money, currency, customer, account, resultMoney) values('" + store + "', '" + date + "', " + money + ", '" + currency + "', '" + customer + "', '" + account + "', " + resultMoney + ")", function(err, rows) {
            conn.release();
            console.log('실행 대상 SQL : ' + exec.sql);
            
            if(err) {
                console.log("SQL 실행 시 에러 발생함");
                console.dir(err);
                callback(err, null);
                
                return;
            }
            
            var msg = {msg : 'success'};
            callback(null, msg);
        });
        
        conn.on('error', function(err) {      
            console.log('데이터베이스 연결 시 에러 발생함.');
            console.dir(err);
            
            callback(err, null);
        });        
    });
}

var seachAccount = function(count_num, callback) {
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
        var exec = conn.query("select ?? from ?? where count_num = ?", [columns, tablename, count_num], function(err, rows) {
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

// 출금
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

// createStoreReservation 라우팅 함수
var createstorereservation = function(req, res) {
    console.log('/process/createstorereservation called');
    
    var store = req.body.store || req.query.store;
    var date = req.body.date || req.query.date;
    var money = req.body.money || req.query.money;
    var currency = req.body.currency || req.query.currency;
    var customer = req.body.customer || req.query.customer;
    var account = req.body.account || req.query.account;
    var resultMoney = req.body.resultMoney || req.query.resultMoney;
    
    var id = req.user[0]["id"];
    
    // pool 객체가 초기화된 경우, createStoreReservation 함수 호출하여 영업점 수령 예약 생성
    if (pool) {
        console.log('계좌 확인');
        seachAccount(account, function(err, callback) {
            if(callback) {
                if(id == callback[0]["count_ownerID"]) {
                    withdrawAccount(account, resultMoney, function(err, callback) {
                        if (err) {
                            console.error('출금 중 에러 발생 : ' + err.stack);
                            return;
                        }

                        if (account) {
                            console.log('출금 성공');
//                            res.send({msg:"success"});
                        } else {
                            console.log('출금 실패');
                            res.send(200, false);
                            res.end();
                        }   
                    });
                    //createStore
                    createStoreReservation(store, date, money, currency, customer, account, resultMoney, function(err, callback) {
                    if (err) {
                        console.error('영업점 수령 예약 생성 불러오는 중 에러 발생 : ' + err.stack);

                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>영업점 수령 예약 생성 중 에러 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();

                        return;
                    }

                    if (callback) {
                        console.log('영업점 수령 예약 생성 불러오기 성공');

                        res.send(callback);
                        res.end();

                    } else {
                        console.log('영업점 수령 예약 생성 불러오기 실패');
                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>영업점 수령 예약 생성 실패</h2>');
                        res.end();            }
                    });
                    
                    
                }
                else {
                    console.log("계좌주 미일치");
                    var msg = {msg : 'account fail'};
                    res.send(msg);
                    res.end();
                }
            } else {
                console.log("계좌 없음");
                 var msg = {msg : 'account nothing'};
                res.send(msg);
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
}

// 인천공항 환전소에서 수령 예약 생성 함수
var createAirportReservation = function(phoneNumber, date, money, currency, customer, account, resultMoney, callback){
     pool.getConnection(function(err, conn) {
        if(err) {
            if(conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        
        var exec = conn.query("insert into listAirportReservation(phoneNumber, date, money, currency, customer, account, resultMoney) values('" + phoneNumber + "', '" + date + "', " + money + ", '" + currency + "', '" + customer + "', '" + account + "', " + resultMoney + ")", function(err, rows) {
            conn.release();
            console.log('실행 대상 SQL : ' + exec.sql);
            
            if(err) {
                console.log("SQL 실행 시 에러 발생함");
                console.dir(err);
                callback(err, null);
                
                return;
            }
            
            var msg = {msg : 'success'};
            callback(null, msg);
        });
        
        conn.on('error', function(err) {      
            console.log('데이터베이스 연결 시 에러 발생함.');
            console.dir(err);
            
            callback(err, null);
        });        
    });
}

// createAirportReservation 라우팅 함수
var createairportreservation = function(req, res) {
    console.log('/process/createairportreservation called');
    
    var phoneNumber = req.body.phoneNumber || req.query.phoneNumber;
    var date = req.body.date || req.query.date;
    var money = req.body.money || req.query.money;
    var currency = req.body.currency || req.query.currency;
    var customer = req.body.customer || req.query.customer;
    var account = req.body.account || req.query.account;
    var resultMoney = req.body.resultMoney || req.query.resultMoney;

    var id = req.user[0]["id"];

    // pool 객체가 초기화된 경우, createStoreReservation 함수 호출하여 영업점 수령 예약 생성
    if (pool) {
        console.log('계좌 확인');
        seachAccount(account, function(err, callback) {
            if(callback) {
                if(id == callback[0]["count_ownerID"]) {
                    withdrawAccount(account, resultMoney, function(err, callback) {
                        if (err) {
                            console.error('출금 중 에러 발생 : ' + err.stack);
                            return;
                        }

                        if (account) {
                            console.log('출금 성공');
//                            res.send({msg:"success"});
                        } else {
                            console.log('출금 실패');
                            res.send(200, false);
                            res.end();
                        }   
                    });

                    //createAirport
                    createAirportReservation(phoneNumber, date, money, currency, customer, account, resultMoney, function(err, callback) {
                        if (err) {
                            console.error('인천공항 환전소 수령 예약 생성 불러오는 중 에러 발생 : ' + err.stack);

                            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                            res.write('<h2>인천공항 환전소 수령 예약 생성 중 에러 발생</h2>');
                            res.write('<p>' + err.stack + '</p>');
                            res.end();

                            return;
                        }

                        if (callback) {
                            console.log('인천공항 환전소 수령 예약 생성 불러오기 성공');

                            res.send(callback);
                            res.end();

                        } else {
                            console.log('인천공항 환전소 수령 예약 생성 불러오기 실패');
                            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                            res.write('<h2>인천공항 환전소 수령 예약 생성 실패</h2>');
                            res.end();            
                        }
                    });
                }
                else {
                    console.log("계좌주 미일치");
                    var msg = {msg : 'account fail'};
                    res.send(msg);
                    res.end();
                }
            } else {
                console.log("계좌 없음");
                 var msg = {msg : 'account nothing'};
                res.send(msg);
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
}

// 배달 예약 생성 함수
var createDeliveryReservaion = function(address, date, money, currency, receiver, phoneNumber, account, resultMoney, callback) {
     pool.getConnection(function(err, conn) {
        if(err) {
            if(conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        
        var exec = conn.query("insert into listDeliveryReservation(address, date, money, currency, receiver, phoneNumber, account, resultMoney) values('" + address + "', '" + date + "', " + money + ", '" + currency + "', '" + receiver + "', '" + phoneNumber + "', '" + account + "', " + resultMoney + ")", function(err, rows) {
            conn.release();
            console.log('실행 대상 SQL : ' + exec.sql);
            
            if(err) {
                console.log("SQL 실행 시 에러 발생함");
                console.dir(err);
                callback(err, null);
                
                return;
            }
            
            var msg = {msg : 'success'};
            callback(null, msg);
        });
        
        conn.on('error', function(err) {      
            console.log('데이터베이스 연결 시 에러 발생함.');
            console.dir(err);
            
            callback(err, null);
        });        
    });
}

// createDeliveryReservaion 라우팅 함수
var createdeliveryreservation = function(req, res) {
    console.log('/process/createdeliveryreservation called');
    
    var address = req.body.address || req.query.address;
    var phoneNumber = req.body.phoneNumber || req.query.phoneNumber;
    var date = req.body.date || req.query.date;
    var money = req.body.money || req.query.money;
    var currency = req.body.currency || req.query.currency;
    var receiver = req.body.receiver || req.query.receiver;
    var account = req.body.account || req.query.account;
    var resultMoney = req.body.resultMoney || req.query.resultMoney;

    var id = req.user[0]["id"];

    // pool 객체가 초기화된 경우, createStoreReservation 함수 호출하여 영업점 수령 예약 생성
    if (pool) {
                console.log('계좌 확인');
        seachAccount(account, function(err, callback) {
            if(callback) {
                if(id == callback[0]["count_ownerID"]) {
                    withdrawAccount(account, resultMoney, function(err, callback) {
                        if (err) {
                            console.error('출금 중 에러 발생 : ' + err.stack);
                            return;
                        }

                        if (account) {
                            console.log('출금 성공');
//                            res.send({msg:"success"});
                        } else {
                            console.log('출금 실패');
                            res.send(200, false);
                            res.end();
                        }   
                    });
                    //createDelivery
                    createDeliveryReservaion(address, date, money, currency, receiver, phoneNumber, account, resultMoney, function(err, callback) {
                        if (err) {
                            console.error('배달 예약 생성 불러오는 중 에러 발생 : ' + err.stack);

                            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                            res.write('<h2>배달 예약 생성 중 에러 발생</h2>');
                            res.write('<p>' + err.stack + '</p>');
                            res.end();

                            return;
                        }

                        if (callback) {
                            console.log('배달 예약 생성 불러오기 성공');

                            res.send(callback);
                            res.end();

                        } else {
                            console.log('배달 예약 생성 불러오기 실패');
                            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                            res.write('<h2>배달 예약 생성 실패</h2>');
                            res.end();            }
                    });
                } else {
                    console.log("계좌주 미일치");
                    var msg = {msg : 'account fail'};
                    res.send(msg);
                    res.end();
                }
            } else {
                console.log("계좌 없음");
                 var msg = {msg : 'account nothing'};
                res.send(msg);
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
}
//exchangeRate.html
module.exports.showexchangeratedate = showexchangeratedate;
//exchangeMgr.html, currency, exchangeRate
module.exports.showexchangeratecurrency = showexchangeratecurrency;
module.exports.showexchangeratelatest = showexchangeratelatest;
//exchangeMgr.html account
//storeInput.html, storeList
module.exports.showStoreList = showStoreList;
//storeInput.html, storeReservation
module.exports.createstorereservation = createstorereservation;
//airportInput.html, airportReservation
module.exports.createairportreservation = createairportreservation;
//deliveryInput.html, deliveryReservaion
module.exports.createdeliveryreservation = createdeliveryreservation;