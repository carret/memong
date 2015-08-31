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
            expires: new Date(Date.now() + 60*60*24*3*30*1000)
        });
        //next();
    }

    function writeDB(req, res, next) {
        async.waterfall([
            function (callback) {
                client.set(token, req.session.passport.user.email, redis.print);
                client.expire(token, 60*60*24*3*30);
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
                        title: "memong 사용법",
                        memos: [
                        {
                            "mtype" : "COMPLETE_MEMO",
                            "text" : "# Hello, memong!\n안녕하세요! memong에 오신 것을 환영합니다.\n\n![memong logo](./memong-x256.png)\n\nmemong은 **웹 클라우드 텍스트 에디터**입니다. 노트에 생각을 적고, 생각을 메모로 나누세요! 모든 것이 타이핑으로 이루어집니다. 에버노트와 뭐가 다르냐고요?\n",
                            "title" : "Hello, memong!"
                        },
                        {
                            "mtype" : "COMPLETE_MEMO",
                            "text" : "# memong은 마크다운 에디터입니다.\nmemong은 마크다운 에디터(Markdown Editor)입니다. \n마크다운은 타이핑만으로도 빠르고 아름다운 타이포그래피를 만들어 줍니다.\n\n## 1. 제목(Headers)\n제목은 '#'을 사용해주세요. 앞에 #을 쓰면 제목으로 바뀝니다.\n``## 제목2`` \n``### 제목3`` \n``#### 제목4`` \n``##### 제목5`` \n``###### 제목6``\n\n**# 제목1**은 조금 특별합니다. ``# 제목1``은 여러분들을 **글을 메모로 나누는 기준**이 됩니다.\n생각을 메모로 분리해야 할 때 사용해주세요!\n\n## 2. 목록(Lists)\n순서가 없는 목록은 문장 앞에 ``*``을 입력해주세요.\n\n* 목록1\n* 목록2\n     * 목록3\n     * 목록4\n* 목록5\n\n순서가 있는 목록은 문장 앞에 숫자를 입력해주세요.\n1. 목록1\n2. 목록2\n    2-1. 목록2-1\n    2-2. 목록2-2\n5. 목록5\n\n## 3. 인용구(Blockquotes)\n인용구는 `>`을 이용합니다. 문장 앞에 ``>``을 입력하면 해당 문장은 인용구가 됩니다.\n\n> 문장 앞에 ``>``을 입력해서 인용구를 만드세요!\n\n## 4. 인라인 코드(Inline Code)\n해당 문장을 인라인 코드로 바꾸고 싶은 경우 `을 사용합니다.\n\n## 5. 강조(Emphasis)\n글자를 기울게 하고 싶은 경우 `*기울이기*`와 같이, 글자를 굵게 하고 싶은 경우 `**굵게**`와 같이 사용합니다.\n`*기울이기*` -> *기울이기*\n`**굵게**` -> **굵게**\n\n## 6. 링크(Links)\n메모에 링크를 넣고 싶은 경우, [`링크 내용`](`링크 주소`)와 같이 입력합니다.\n`[Google](https://google.com/)` -> [Google](https://google.com/)\n\n## 7. 이미지(Images)\n메모에 이미지를 넣고 싶은 경우, !['이미지 이름']('이미지 경로')와 같이 입력합니다.\n`![메몽 로고](./favicon/android-icon-48x48.png)` -> ![메몽 로고](./favicon/android-icon-48x48.png)",
                            "title" : "memong은 마크다운 에디터입니다."
                        },
                        {
                            "mtype" : "COMPLETE_MEMO",
                            "text" : "# memong은 메모 단위로 글을 구분합니다\n하나의 노트에는 여러 메모를 입력할 수 있습니다. 노트라는 하나의 주제에서 내용을 메모로 분리하세요!\n메모를 만드는 방법은 다음과 같이 2가지 방법이 있습니다.\n\n1. ``# 제목1``은 메모를 구분하는 기준이 됩니다. ``# 제목1``을 입력하여 메모를 생성합니다.\n2. 다음과 같이 ``새로운 메모 추가하기``버튼을 클릭하여 메모를 생성합니다.\n![메모 생성하기](./how-to-use1.png)\n\n메모는 옆의 메모 뷰어에서 관리가 가능합니다.",
                            "title" : "memong은 메모 단위로 글을 구분합니다"
                        },
                        {
                            "mtype" : "COMPLETE_MEMO",
                            "text" : "# memong은 타이핑을 중시합니다\nmemong은 불필요한 마우스 사용과 빠른 타이핑을 위해 단축키를 제공합니다.\n1. ``TAB`` : 메모 편집을 끝내고 다음 메모로 이동합니다.\n2. ``Shift + Enter`` : 메모 편집을 끝냅니다.\n\n여러분들은 손을 키보드에서 뗄 필요가 없습니다. 오직 타이핑만으로 빠르게 메모를 작성하세요!",
                            "title" : "memong은 타이핑을 중시합니다"
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
                    {label: 'memong 사용법', id: 2, type: 'note'}
                ]
            }
        ]
    }
];

