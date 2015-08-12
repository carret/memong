/**
 * Created by Jaewook on 2015-08-01.
 */
var passport=require('../../passports');

exports.doRoutes = function(app) {
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
        // �α����� �Ǿ� ������, ���� �������������� ����
        if (req.isAuthenticated()) {
            return next();
        }
        // �α����� �ȵǾ� ������, login �������� ����
        else {
            res.redirect('/');
        }
    }

    function initNotes() // �α��ΰ� ���ÿ� ������ ��� ��Ʈ ������
    {


    }
}