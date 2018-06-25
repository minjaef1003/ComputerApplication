var mysql = require('mysql');

//===== MySQL 데이터베이스 연결 설정 =====//
var connection      =    mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'cjswo465',
    database : 'computerapplication',
});

connection.connect();

// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static');

//===== Passport 사용 =====//
var passport = require('passport');
var flash = require('connect-flash');

// Session 미들웨어 불러오기
var expressSession = require('express-session');

// 익스프레스 객체 생성
var app = express();

// 기본 속성 설정 (localhost:3000)
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: true }));

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json());

// cookie-parser 설정
app.use(cookieParser());

// public 폴더를 웹 서버의 루트 패스로 접근 가능 (ex:localhost:3000/main.html)
app.use(static(path.join(__dirname, 'public')));

// 세션 설정
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//===== Passport 사용 설정 =====//
// Passport의 세션을 사용할 때는 그 전에 Express의 세션을 사용하는 코드가 있어야 함
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//===== 라우팅 함수 등록 =====//

// 라우터 객체 참조
var router = express.Router();

var accountMgr = require('./routes/accountMgr');
var exchange = require('./routes/exchange');
var mobileATMMgr = require('./routes/mobileATMMgr');
var authNumMgr = require('./routes/authNumMgr');
var loginmgr = require('./routes/loginmgr');      
var card = require('./routes/card')(app);

// 라우터 객체 등록
app.use('/', router);
app.use('/process/card', card);

// 계좌 함수 라우팅 모듈 호출
router.route('/process/routeCheckAllAccount').post(accountMgr.routeCheckAllAccount);
router.route('/process/routeCheckMyAccount').post(accountMgr.routeCheckMyAccount);
router.route('/process/routeRegistAccount').post(accountMgr.routeRegistAccount);
router.route('/process/routeDeleteAccount').post(accountMgr.routeDeleteAccount);
router.route('/process/routeDepositAccount').post(accountMgr.routeDepositAccount);
router.route('/process/routewithdrawAccount').post(accountMgr.routewithdrawAccount);
router.route('/process/routeTransferAccount').post(accountMgr.routeTransferAccount);

// 모바일ATM 함수 라우팅 모듈 호출
router.route('/process/showmobileatmaccount').post(mobileATMMgr.showmobileatmaccount);
router.route('/process/shownomobileatmaccount').post(mobileATMMgr.shownomobileatmaccount);
router.route('/process/addmobileatmaccount').post(mobileATMMgr.addmobileatmaccount);
router.route('/process/deletemobileatmaccount').post(mobileATMMgr.deletemobileatmaccount);
router.route('/process/sendaccountnumber').post(authNumMgr.withdrawmobileatmaccount);

// 환전 함수 라우팅 모듈 호출
router.route('/process/showexchangeratedate').post(exchange.showexchangeratedate);
router.route('/process/showexchangeratecurrency').post(exchange.showexchangeratecurrency);
router.route('/process/showexchangeratelatest').post(exchange.showexchangeratelatest);
router.route('/process/checkAccount').post(exchange.checkAccount);
router.route('/process/showStoreList').post(exchange.showStoreList);
router.route('/process/createstorereservation').post(exchange.createstorereservation);
router.route('/process/createairportreservation').post(exchange.createairportreservation);
router.route('/process/createdeliveryreservation').post(exchange.createdeliveryreservation);

router.route('/process/signUp').post(loginmgr.signUp);   

// 로그인 화면 - login.ejs 템플릿을 이용해 로그인 화면이 보이도록 함
router.route('/').get(function(req, res) {
	console.log('/login 패스 요청됨.');
	res.render('login.ejs', {message: req.flash('loginMessage')});
});

router.route('/logout').get(function(req, res) {
    console.dir(req.user.id);
	console.log('/logout 패스 요청됨.');
    
	req.logout();
	res.redirect('/');
});

router.route('/main').get(function(req, res) {
    console.dir(req.user.id);
	res.render('main.ejs');
});

// 사용자 인증 - POST로 요청받으면 패스포트를 이용해 인증함
// 성공 시 /profile로 리다이렉트, 실패 시 /login으로 리다이렉트함
// 인증 실패 시 검증 콜백에서 설정한 플래시 메시지가 응답 페이지에 전달되도록 함
router.route('/login').post(passport.authenticate('local-login', {
    successRedirect : '/main', 
    failureRedirect : '/', 
    failureFlash : true 
}));

router.route('/authenticate').get(function(req, res) {
	res.render('authenticate.ejs');
    console.log(req.user);
});

router.route('/process/authenticate').post(function(req, res) {
   console.log('/authenticate 패스 요청됨.');
    console.log(req.user[0]["id"]);
    console.log(req.body["id"]);
    
    if (req.user[0]["password"] == req.body["password"]) {
        console.log('사용자 인증 완료.');
        res.redirect('/main');
    }
   
   else {
      console.log('비밀번호 틀림.');
      res.redirect('/authenticate');
   }
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  /* db 에서 id를 이용하여 user를 얻어서 done을 호출합니다 */
    done(null, user);
});

//===== Passport Strategy 설정 =====//

var LocalStrategy = require('passport-local').Strategy;

//패스포트 로그인 설정
passport.use('local-login', new LocalStrategy({
		usernameField : 'id',
		passwordField : 'password',
		passReqToCallback : true   // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
	}, function(req, id, password, done) { 
		console.log('passport의 local-login 호출됨 : ' + id + ', ' + password);
    
	    connection.query('SELECT * FROM profiles WHERE `id`=?', [id], function(err, user) {
	    	if (err) { return done(err); }

	    	// 등록된 사용자가 없는 경우
	    	if (!user) {
	    		console.log('계정이 일치하지 않음.');
	    		return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));  // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
	    	}
	    	
	    	// 비밀번호 비교하여 맞지 않는 경우
			if (!( user[0].password == password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
			
			// 정상인 경우
			console.log('계정과 비밀번호가 일치함.');
			return done(null, user);  // 검증 콜백에서 두 번째 파라미터의 값을 user 객체로 넣어 인증 성공한 것으로 처리
	    });

	}));

// 등록되지 않은 패스에 대해 페이지 오류 응답
app.all('*', function(req, res) {
	res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
});

//===== 서버 시작 =====//

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
});

// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
