/**
 * Created by Jaewook on 2015-08-01.
 */
var passport=require('../../passports');
var db = require('../../db');

var User = db.model('User');
var Note = db.model('Note');

var mongoose = require('mongoose');

var Constants = require('../../src/constants/Constants');

var async = require('async');

exports.doRoutes = function(app) {
    app.get('/login/google', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));
    app.get('/login/google/callback', passport.authenticate('google', {successRedirect:'/login/google/success', failureRedirect:'/login/google/fail'}));
    app.get('/login/google/success', ensureAuthenticated, function(req,res,next) {
        //res.send(req.user);
        res.redirect('/');
    });
    app.get('/login/facebook', passport.authenticate('facebook', {scope:['email']}));
    app.get('/login/facebook/callback',passport.authenticate('facebook', {successRedirect:'/login/facebook/success', failureRedirect:'/login/facebook/fail'}));
    app.get('/login/facebook/success', ensureAuthenticated, writeCookie, writeDB, function(req, res) {
        console.log('login success');
        //console.log(req.session);
        res.redirect('/');
    });

    app.get('/logout', ensureAuthenticated, deleteDB, function(req, res){
        console.log('logout');
        res.clearCookie('token');
        res.clearCookie('username');
        req.logout();
        res.redirect('/');
    });

    function ensureAuthenticated(req, res, next) {

        if (req.isAuthenticated()) {
            // 로그인이 되어 있으면, 다음 파이프라인으로 진행
            console.log('hi');
            return next();
        }
        else {
            // 로그인이 안되어 있으면, login 페이지로 진행
            res.clearCookie('username');
            console.log('hello')
            res.redirect('/');
        }
    }

    function writeCookie(req,res,next) {
        console.log('write cookie');
        res.cookie('username', req.session.passport.user.email, {
            expires:new Date(Date.now()+9999999999),
            httpOnly:true,
            signed:true
        });
        res.cookie('token', req.session.passport.user.token, {
            expires:new Date(Date.now()+9999999999),
            httpOnly:true
        });
        res.cookie('servicetype', req.session.passport.user.servicetype, {
            expires:new Date(Date.now()+9999999999),
            httpOnly:true,
            signed:true
        });

        next();
    }

    function writeDB(req, res, next ) {
        console.log('session token : ' + req.session.passport.user.token);
        console.log('cookie token : ' + req.cookies.token);

        async.waterfall([
            function(callback) {
                var model = {
                    username : req.session.passport.user.email,
                    servicetype : req.session.passport.user.servicetype
                };
                User.find(model, function(err, users) {
                    callback(null, users);
                })
            },
            function(users, callback) {
                if ( users.length > 0 ) {
                    console.log('update');
                    var token = {
                        token : {token : req.session.passport.user.token}
                    };
                    User.update({username:req.session.passport.user.email},token,function(err){
                        if(err){
                            console.log(err);
                        }else{
                            console.log("Successfully updated");
                        }
                        res.end();
                    });

                    //User.update({username:req.session.passport.user.email},{$set: {token:{token:req.signedCookies.token}}});
                } else {
                    console.log('save');
                    console.log(req.cookies.token);
                    var user = new User({
                        token: {token : req.session.passport.user.token},
                        username : req.session.passport.user.email,
                        servicetype:req.session.passport.user.servicetype
                    });

                    user.save( function(err, user ) {
                        if ( err ) {
                            console.log(err);
                            res.send(err);
                        } else {
                            callback(null, user._id, true);
                        }
                    });
                }
            },
            function(userId, isFirstUser, callback) {
                if (isFirstUser) {
                    var newNote = new Note({
                        title: "새로운 노트",
                        memos: [
                            {
                                title: "새로운 메모",
                                text: "# 새로운 메모\n이 메모를 클릭하여 편집하세요.",
                                mtype: Constants.MemoType.COMPLETE_MEMO
                            }
                        ]
                    });
                    newNote.save(function(err, result) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        }
                        else {
                            console.log("새로운 노트 저장 성공");
                            callback(null, userId, result._id);
                        }
                    })
                }
            },
            function(userId, newNoteId) {
                User.findOneAndUpdate(
                    {_id: mongoose.Types.ObjectId(userId)},
                    {$set: {selectNoteId: mongoose.Types.ObjectId(newNoteId)}},
                    {upsert: true, 'new': true},
                    function(err, result) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        }
                        else {
                            console.log("새로운 노트: \n"+result);
                            //res.end();
                            next();
                        }
                    }
                )
            }
        ]);

    }

    function deleteDB(req, res, next ) {
        console.log('deleteDB');
        //console.log(req.session);
        var token = {
            token : {token:'1'}
        };
        User.update({username:req.session.passport.user.email},token,function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Successfully updated");
            }
            res.end();
        });

        //User.update({username:req.session.passport.user.email},{$set:{token:{token:'1'}}});
        next();
    }

};