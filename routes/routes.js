
var db = require('../db');
var User = db.model('User');

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
    var cookie;

    if ( req.session.passport.user == null ) {

        var cookieEmail = req.signedCookies.username;
        //이전에 Login을 한 경우
        if ( cookieEmail != null ) {

            var cookieToken = req.cookies.token;
            User.find({username:cookieEmail}, function(err,users) {
                if ( users.length > 0 ) {
                    if (users[0].token.token == cookieToken) {
                        //로그인이 되어있는 경우이므로 메모 작성 화면을 보여준다.
                        console.log('login ok token not null');
                        res.render('index', {title: "memong"})
                    } else {
                        console.log(users[0].token.token);
                        console.log(cookieToken);
                        console.log('unAuthorized');
                        res.send(401);
                    }
                } else {
                    res.send('로그인 하세요');
                }
            })
        } else { //로그인을 한 적이 없는 경우이므로 로그인 창을 보여준다.
            res.send('Login 해주세요');
        }
    } else {
        console.log('d')
        //세션에 로그인 정보가 있으므로 메모 작성 화면을 보여준다.
        console.log('login ok session not null');
        res.render('index', {title : "memong"})
    }

}