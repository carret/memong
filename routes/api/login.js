/**
 * Created by Jaewook on 2015-08-01.
 */
var passport=require('../../passports');

exports.doRoutes = function(app) {
    app.get('/login/google', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));
    app.get('/login/google/callback', passport.authenticate('google', {successRedirect:'/login/google/success', failureRedirect:'/login/google/fail'}));
    app.get('/login/google/success', ensureAuthenticated, function(req,res,next) {
        res.send(req.user);
    });
    app.get('/login/facebook', passport.authenticate('facebook'));
    app.get('/login/facebook/callback',passport.authenticate('facebook', {successRedirect:'/login/facebook/success', failureRedirect:'/login/facebook/fail'}));
    app.get('/login/facebook/success', ensureAuthenticated, function(req, res) {
        res.send(req.user);
    });
    app.get('/logout', function(req, res){
        console.log('logout');
        req.logout();
        res.redirect('/');
    });

    function ensureAuthenticated(req, res, next) {
        // 로그인이 되어 있으면, 다음 파이프라인으로 진행
        if (req.isAuthenticated()) {
            return next();
        }
        // 로그인이 안되어 있으면, login 페이지로 진행
        else {
            res.redirect('/');
        }
    }
}