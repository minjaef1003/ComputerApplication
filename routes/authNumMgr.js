// 인증번호 Mgr

// 인증번호 라우팅 함수
var withdrawmobileatmaccount = function(req, res) {
    var countNum = req.body.count_num || req.query.count_num;
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<head><title>모바일ATM 출금화면</title>');
    res.write("<script src='https://code.jquery.com/jquery-3.3.1.min.js'></script><script>");
    res.write('var authNum;');
    res.write('var tempString = "";');
    res.write('var limitTime = 60;');
    res.write('var countNum = ' + countNum + ';');
    res.write('var timestamp;');
    res.write('function generateAuthNum(accNum, timestamp) {');
    res.write('var tmp = (accNum * timestamp) % 1000000;');
    res.write('if (tmp < 100000) tmp += 100000;');
    res.write('return tmp; }');
    res.write("function timerStart() { tid = setInterval('timer()', 1000) };");
    res.write('function timer() {');
    res.write('var msg = "남은 시간 : " + limitTime + "초";');
    res.write('document.all.limitTime.innerHTML = msg;');
    res.write('if (limitTime > 0) {');
    res.write('limitTime--; } }');
    res.write('$(document).ready(function() {');
    res.write('timestamp = new Date().getTime();');
    res.write('authNum = generateAuthNum(countNum, timestamp);');
    res.write('tempString = "인증번호 : " + authNum;');
    res.write('$("#auth_num").text(tempString);');
    res.write("timerStart();");
    res.write('$("#regenerate").click(function(){');
    res.write('timestamp = new Date().getTime();');
    res.write('authNum = generateAuthNum(countNum, timestamp);');
    res.write('tempString = "인증번호 : " + authNum;');
    res.write('$("#auth_num").text(tempString);');
    res.write('limitTime = 60;');
    res.write("timerStart(); }); }); </script></head><body>");
    res.write('<h1>모바일ATM 출금</h1>');
    res.write('<div id="auth_num"></div><br>');
    res.write('<div id="limitTime"></div><br>');
    res.write('<button id="regenerate">인증번호 다시 받기</button></body>');
    res.end();
};

module.exports.withdrawmobileatmaccount = withdrawmobileatmaccount;