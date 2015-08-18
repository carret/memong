
var db = require('../db');
var User = db.model('User');

exports.doRoutes = function(app) {
    app.get ('/', index);
    require('./api/login').doRoutes(app);
    require('./api/note').doRoutes(app);
    require('./api/memo').doRoutes(app);
};

var index = function(req, res) {
    if (req.session.passport.user == null) {
        var cookieEmail = req.signedCookies.username;
        //이전에 Login을 한 경우
        if (cookieEmail != null) {
            var cookieToken = req.cookies.token;
            User.find({username: cookieEmail}, function (err, users) {
                if (users.length > 0) {
                    if (users[0].token.token != cookieToken) {
                        console.log(users[0].token.token);
                        console.log(cookieToken);
                        console.log('unAuthorized 비정상 접근입니다.');
                        res.send(401);
                        return;
                    }
                    else {
                        res.render('index', {title: "memong"});
                    }
                }
                else {
                    res.render('index', {title: "memong"});
                }
            });
        }
        else {
            res.render('index', {title: "memong"});
        }
    } else {
        res.render('index', {title: "memong"});
    }
};