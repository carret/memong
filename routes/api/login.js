/**
 * Created by Jaewook on 2015-08-01.
 */
var passport=require('../../passports');
var async = require('async');
var db = require('../../db');
var Note = db.model('Note');
var User = db.model('User');


exports.doRoutes = function(app) {

    app.get('/login/google', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));
    app.get('/login/google/callback', passport.authenticate('google', {
        successRedirect: '/login/google/success',
        failureRedirect: '/login/google/fail'
    }));
    app.get('/login/google/success', ensureAuthenticated, function (req, res, next) {
        res.send(req.user);
        res.redirect('/');
    });
    app.get('/login/facebook', passport.authenticate('facebook', {scope: ['email']}));
    app.get('/login/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login/facebook/fail'
    }));
    //app.get('/login/facebook/success', ensureAuthenticated, function(req, res) {
    //    res.send(req.user);
    //    res.redirect('/');
    //});
    app.get('/logout', function (req, res) {
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


    function initUser(token, name, servicetype) /* 첫 로그인 : 유저 계정 및 루트 폴더와 디폴트 노트 생성*/
    {
        async.waterfall(
            [
                function (callback) {

                    var user = new User();
                    user.token = token;
                    user.username = name;
                    user.servicetype = servicetype;

                    user.save(function(err, user) {
                        if ( err )
                            callback(err);

                        console.log("Successfully added user");
                        callback(null, user);
                    });
                },

                function (user, callback){

                    User.update({_id: user['_id']},{$push: {category:
                    {
                        name : 'root',
                        type : 'folder',
                        parent : 'root'

                    }}},{upsert:true},function(err){
                        if(err)
                            callback(err);

                        console.log("Successfully added folder");
                        callback(null, user);
                    });
                },

                function(user, callback){
                    var note = new Note();
                    note.title = 'new note';

                    note.save(function(err, note) {
                        if ( err )
                            callback(err);

                        console.log("Successfully added note in Note");
                        callback(null, user, note);
                    });
                },
                function (user, note, callback){

                    User.update({_id: user['_id']},{$push: {category:
                    {
                        name : 'new note',
                        type : 'note',
                        nid : note['id'],
                        parent : 'root'

                    }}},{upsert:true},function(err){
                        if(err)
                            callback(err);

                        console.log("Successfully added note in category");
                        callback(null, user);
                    });
                }
            ],

            function (err, result) {
                if(err)
                    console.log (err)
            } );
    }

    function userlogin(tocken) /* 기존 유저 로그인 */
    {
        var user = new User();

        User.findOne({ token : tocken },function(err,loginuser){
            if(err)
                console.err(err);

            user = loginuser;
        });
    }

}