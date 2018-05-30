// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static');

// Session 미들웨어 불러오기
var expressSession = require('express-session');

// 익스프레스 객체 생성
var app = express();

// 기본 속성 설정 (localhost:3000)
app.set('port', process.env.PORT || 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

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

//===== 라우팅 함수 등록 =====//

// 라우터 객체 참조
var router = express.Router();

var mobileATM = require('./routes/mobileATM');

// 라우터 객체 등록
app.use('/', router);

// 모바일ATM 함수 라우팅 모듈 호출
router.route('/process/showmobileatmaccount').post(mobileATM.showmobileatmaccount);
router.route('/process/shownomobileatmaccount').post(mobileATM.shownomobileatmaccount);
router.route('/process/issueaccount').post(mobileATM.issueaccount);
router.route('/process/addmobileatmaccount').post(mobileATM.addmobileatmaccount);
router.route('/process/deletemobileatmaccount').post(mobileATM.deletemobileatmaccount);

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