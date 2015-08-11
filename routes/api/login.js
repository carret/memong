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
    app.get('/login/facebook', passport.authenticate('facebook'));
    app.get('/login/facebook/callback',passport.authenticate('facebook', {successRedirect:'/login/facebook/success', failureRedirect:'/login/facebook/fail'}));
    app.get('/login/facebook/success', ensureAuthenticated, function(req, res) {
        res.send(req.user);
    });
    app.get('/logout', function(req, res){
        console.log('logout');
        req.logOut();
        //req.session.destroy(function (err) {
        //    res.redirect('/'); //Inside a callback… bulletproof!
        //});
        res.redirect('/');
    });

    function ensureAuthenticated(req, res, next) {
        // �α����� �Ǿ� ������, ���� �������������� ����
        if (req.isAuthenticated()) {
            return next();
        }
        // �α����� �ȵǾ� ������, login �������� ����
        else {
            res.redirect('/');
        }
    }
}