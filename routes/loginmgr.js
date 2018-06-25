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


var signup = function (id, password, Name, Address, Eaddress, Birth, phone, callback) {
         pool.getConnection(function(err, conn) {
        if(err) {
            if(conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        
        var exec = conn.query("insert into profiles(id, password, Name, Address, Eaddress, Birth, phone) values('" + id + "', '" + password + "', '" + Name + "', '" + Address + "', '" + Eaddress +  "', '" + Birth + "', '" + phone + "')", function(err, rows) {
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


var signUp = function(req, res) {
    console.log('/process/signUp called');
    
    var id = req.body.id || req.query.id;
    var password = req.body.password || req.query.password;
    var Name = req.body.Name || req.query.Name;
    var Address = req.body.Address || req.query.Address;
    var Eaddress = req.body.Eaddress || req.query.Eaddress;
    var Birth = req.body.Birth || req.query.Birth;
    var phone = req.body.phone || req.query.phone;

    
    if (pool) {
        signup(id, password, Name, Address, Eaddress, Birth, phone, function(err, callback) {
            if (err) {
                console.error('회원가입 중 에러 발생 : ' + err.stack);
                  
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>회원가입 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
            
            if (callback) {
                console.log('회원가입 성공');
                
				res.send(callback);
				res.end();

            } else {
                console.log('회원가입 실패');
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>회원가입 실패</h2>');
				res.end();            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패');
	}
}





//var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
//router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), // 인증 실패 시 401 리턴, {} -> 인증 스트레티지
  //function (req, res) {
 //   res.redirect('/home');
 // });

module.exports.signUp = signUp;
