// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

var static = require('serve-static');

// 익스프레스 객체 생성
var app = express();

// 기본 속성 설정 (localhost:3000)
app.set('port', process.env.PORT || 3000);

// public 폴더를 웹 서버의 루트 패스로 접근 가능 (ex:localhost:3000/main.html)
app.use(static(path.join(__dirname, 'public')));

// 등록되지 않은 패스에 대해 페이지 오류 응답
app.all('*', function(req, res) {
	res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
});

// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});