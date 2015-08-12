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
        res.redirect('/');
    });
    app.get('/login/facebook', passport.authenticate('facebook', {scope:['email']}));
    app.get('/login/facebook/callback',passport.authenticate('facebook', {successRedirect:'/', failureRedirect:'/login/facebook/fail'}));
    //app.get('/login/facebook/success', ensureAuthenticated, function(req, res) {
    //    res.send(req.user);
    //    res.redirect('/');
    //});
    app.get('/logout', function(req, res){
        console.log('logout');
        console.log(req.session);
        req.logout();
        res.redirect('/');
        //req.session.destroy(function(err) {
        //    if ( err )
        //        console.log(err);
        //    else
        //        console.log('logout');
        //});
        //
        //setTimeout(function() {
        //    res.redirect ("/");
        //}, 2000);
    });

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            res.redirect('/');
        }
    }

    function initNotes() // 로그인과 동시에 유저내 모든 노트 가져옴
    {


    }
}