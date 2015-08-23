var db = require('../db');
var User = db.model('User');

var redis = require("redis");
var client = redis.createClient();


exports.doRoutes = function(app) {
    app.get ('/', index)
    app.get('/typography', function(req,res){
        res.render('__static__typography');
    });
    require('./api/login').doRoutes(app)
    require('./api/note').doRoutes(app)
    require('./api/memo').doRoutes(app)
}

var index = function(req, res) {

    var cookieToken = req.cookies.token;
    //console.log("쿠키 토큰 : " + cookieToken);

    if ( cookieToken != null ) {
        client.get(cookieToken, function(err, name) {
            if ( name == null ) {
                console.log('unAuthorized 비정상 접근입니다.');
                res.status=401;
                res.send('unAuthorized 비정상 접근입니다.');
            } else {
                console.log('token available, render');
                res.render('index', {title: "memong"});
            }
        })
    } else {
        console.log('token null, render');
        res.render('index', {title: "memong"});
    }
    res.render('index', {title: "memong"})
}