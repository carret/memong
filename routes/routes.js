var db = require('../db');
var User = db.model('User');

var redis = require("redis");
var client = redis.createClient();

exports.doRoutes = function(app) {
    app.get ('/', index);

    require('./api/login').doRoutes(app);
    require('./api/note').doRoutes(app);
    require('./api/tree').doRoutes(app);
    require('./api/search').doRoutes(app);
};

var index = function(req, res) {
    var cookieToken = req.cookies.token;

    if ( cookieToken != null ) {
        client.get(cookieToken, function(err, name) {
            if ( name == null ) {
                res.status=401;
                res.send('unAuthorized 비정상 접근입니다.');
            } else {
                res.render('index', {title: "memong"});
            }
        })
    } else {
        res.render('index', {title: "memong"});
    }
};
