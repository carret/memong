var passport = require('../../passports');

var db = require('../../db');
var User = db.model('User');
var Note = db.model('Note');

var mongoose = require('mongoose');
var Constants = require('../../src/constants/Constants');
var async = require('async');

var jwt = require('jwt-simple');
var pkginfo = require('../../package');
var redis = require("redis");
var client = redis.createClient();

var token;


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
        writeCookie(req, res, next);
        writeDB(req, res, next);
        res.redirect('/');
    });

    app.get('/login/facebook', passport.authenticate('facebook', {scope: ['email']}));
    app.get('/login/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/login/facebook/success',
        failureRedirect: '/login/facebook/fail'
    }));
    app.get('/login/facebook/success', ensureAuthenticated, function (req, res, next) {
        writeCookie(req, res, next);
        writeDB(req, res, next);
        res.redirect('/');
    });

    app.get('/logout', function (req, res) {
        res.clearCookie('token');
        req.logout();
        res.redirect('/');
    });


    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
        else {
            res.redirect('/');
        }
    }

    function writeCookie(req, res, next) {
        token = jwt.encode({username: req.session.passport.user.email}, pkginfo.oauth.token.secret);
        res.cookie('token', token, {
            expires: new Date(Date.now() + 99999999999)
        });
        //next();
    }

    function writeDB(req, res, next) {
        async.waterfall([
            function (callback) {
                client.set(token, req.session.passport.user.email, redis.print);
                client.get(token, function (err, name) {
                    User.findOne({username: req.session.passport.user.email}, function (err, user) {
                        if (user == null) {
                            var newUser = new User({
                                username: req.session.passport.user.email
                            });
                            newUser.save(function (err, user) {
                                callback(null, user._id, true);
                            });
                        } else {
                            //next();
                        }
                    })
                });
            },
            function (userId, isFirstUser, callback) {
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
                    newNote.save(function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        }
                        else {
                            callback(null, userId, result._id);
                        }
                    })
                }
            },
            function (userId, newNoteId, callback) {
                User.findOne(
                    {_id: mongoose.Types.ObjectId(userId)},
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        }
                        else {
                            callback(null, userId, result.username, newNoteId);
                        }
                    }
                )
            },
            function (userId, username, newNoteId, callback) {
                _treeProto[0].label = username;
                var treeProto = JSON.stringify(_treeProto);
                var treeTableProto = [
                    {id: 0, nid: null},
                    {id: 1, nid: null},
                    {id: 2, nid: mongoose.Types.ObjectId(newNoteId)}
                ];

                User.update(
                    {_id: mongoose.Types.ObjectId(userId)},
                    {$set: {selectNoteId: mongoose.Types.ObjectId(newNoteId), tree: treeProto, treeTable: treeTableProto}},
                    {upsert: true, 'new': true},
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        }
                        else {
                            callback();
                        }
                    }
                )
            }
        ]);
    }
};


var _treeProto = [
    {
        label: 'root', id: 0, type: 'folder',
        children: [
            {
                label: '새로운 폴더', id: 1, type: 'folder',
                children: [
                    {label: '새로운 노트', id: 2, type: 'note'}
                ]
            }
        ]
    }
];

