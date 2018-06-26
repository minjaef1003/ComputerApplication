module.exports = function (app) {
    var express = require('express');
    var route = express.Router();
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'cjswo465',
        database: 'computerapplication'
    });
    var bodyParser = require('body-parser');
    app.set('view engine', 'jade');
    app.set('views', './views');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    connection.connect();
    route.post('/request_receiver', function (req, res) {
        var username = req.body.card_user;
        var sex = req.body.card_sex;
        var birthday = req.body.user_birthday;
        var kind = req.body.card_kind;
        var memo = req.body.card_memo;
        var state = 'request';
        var time = new Date();
        var sql = 'INSERT INTO requestinfo (card_user,card_sex,card_birthday,card_kind,card_memo,card_state,request_date) VALUES(?,?,?,?,?,?,?)';
        var params = [username, sex, birthday, kind, memo, state, time];
        connection.query(sql, params, function (err, rows, fields) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('request_complete');
            }
        })
    })
    var outname;
    var birth;
    route.get(['/search_show', '/search_show/:id'], function (req, res) {
        var id = req.params.id;
        if (!id) {
            outname = req.query.search_name;
            birth = req.query.search_birthday;
        }
        var sql = 'SELECT * FROM requestinfo WHERE card_user=? AND card_birthday=?';
        connection.query(sql, [outname, birth], function (err, rows, fields) {
            if (id) {
                var sql = 'SELECT * FROM requestinfo WHERE card_id=?';
                connection.query(sql, [id], function (err, cards, fields) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('search_show', { rows: rows, username: outname, card: cards[0] });
                    }
                })
            } else {
                res.render('search_show', { rows: rows, username: outname });
            }
        })
    });
    route.post('/regist_complete', function (req, res) {
        var username = req.body.regist_name;
        var userbirth = req.body.regist_birthday;
        var cardname = req.body.regist_card;
        var state = 'regist'
        var time = new Date();
        var sql = 'UPDATE requestinfo SET card_state=?,regist_date=? WHERE card_user=? AND card_kind=? AND card_birthday=?';
        connection.query(sql, [state, time, username, cardname, userbirth], function (err, rows, fields) {
            if (err) {
                console.log(err);
            } else {
                res.render('regist_complete', { rows: rows });
            }
        })
    })
    route.post('/pass_regist_complete', function (req, res) {
        var name = req.body.regist_name;
        var birth = req.body.regist_birthday;
        var card = req.body.regist_cardname;
        var password = req.body.regist_password;
        var sql = 'UPDATE requestinfo SET card_password=? WHERE card_user=? AND card_birthday=? AND card_kind=?';
        connection.query(sql, [password, name, birth, card], function (err, rows, fields) {
            if (err) {
                console.log(err);
            } else {
                res.render('pass_regist_complete', { rows: rows });
            }
        })
    })
    route.post('/pass_change_complete', function (req, res) {
        var name = req.body.regist_name;
        var birth = req.body.regist_birthday;
        var card = req.body.regist_cardname;
        var b_password = req.body.before_password;
        var a_password = req.body.after_password;
        var sql = 'SELECT * FROM requestinfo WHERE card_user=? AND card_birthday=? AND card_kind=?';
        var ok = true;
        connection.query(sql, [name, birth, card], function (err, rows, fields) {
            if (err) {
                console.log(err);
            } else {
                if (b_password != rows[0].card_password) {
                    ok = false;
                    res.render('notsame');
                }
            }
        })
        if (ok) {
            var sql = 'UPDATE requestinfo SET card_password=? Where card_user=? AND card_birthday=? AND card_kind=?';
            connection.query(sql, [a_password, name, birth, card], function (err, rows, fields) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('pass_change_complete', { rows: rows });
                }
            })
        }
    })
    route.get('/password_regist', function (req, res) {
        res.render('password_regist');
    })
    route.get('/password_change', function (req, res) {
        res.render('password_change');
    })
    route.get('/card', function (req, res) {
        res.render('card');
    })
    route.get('/card_request', function (req, res) {
        res.render('card_request');
    })
    route.get('/card_search', function (req, res) {
        res.render('card_search');
    })
    route.get('/card_regist', function (req, res) {
        res.render('card_regist');
    })
    route.get('/card_password', function (req, res) {
        res.render('card_password');
    })
    return route;
}
