var db = require('../../db');
var Note = db.model('Note');
var User = db.model('User');

var Constants = require('../../src/constants/Constants');

var mongoose = require('mongoose');

var async = require('async');

var mecab = require('mecab-ffi');

var jwt = require('jwt-simple');
var pkgInfo = require('../../package');

exports.doRoutes = function(app) {
    app.get(Constants.API.GET_NOTE_WITH_MEMO , getSelectNoteWithMemo);
    app.post(Constants.API.POST_NOTE_WITH_MEMO, saveMemo);

    //app.post('/test/addUser', testAddUser);
    //app.post('/test/addNote', testAddNote);
};

var testAddNote = function(req, res) {
    var note = req.body;
    console.log(note);
    var newNote = new Note({
        title: note.title,
        memos: note["memos"]
    });
    newNote.save(function(err, result) {
        console.log("Note Saved: " + result);
        res.send(result);
    });
};

var testAddUser = function(req, res) {
    var user = req.body;
    var newUser = new User({
        token: user.token,
        username: user.username,
        selectNoteId: mongoose.Types.ObjectId(user.selectNoteId),
        servicetype: user.servicetype
    });
    newUser.save(function(err, result) {
        console.log("User Saved: " + result);
        res.send(result);
    })
};

var getSelectNoteWithMemo = function(req, res) {
    var userToken = replaceXss(req.query.userToken);
    var noteId = replaceXss(req.query.noteId);
    var userName;
    if ( userToken != null )
        userName = jwt.decode(userToken, pkgInfo.oauth.token.secret).username;
    //noteID가 null인 경우, selectNote를 불러옴
    if (noteId == null) {
        async.waterfall([
            function(next) {
                //유저 검색 및
                User.findOne({username: userName}, function(err, result) {
                    if (err) { return next(err); }
                    else {
                        if (result == null) {
                            console.log("유저 없음");
                            return next("유저가 없습니다.");
                        }
                        else {
                            next(null, result.selectNoteId);
                        }
                    }
                });
            },
            function(selectNoteId, next) {
                Note.findOne({_id: mongoose.Types.ObjectId(selectNoteId)}, function(err, result) {
                    if (err) { return next(err); }
                    else {
                        if (result == null) { return next("노트가 없습니다."); }
                        else {
                            var _note = {
                                title: result.title,
                                idAttribute: result._id
                            };
                            var _memos = (function(memos){
                                var arr = new Array();
                                for (var idx=0, len=memos.length; idx<len; idx++) {
                                    var obj = {
                                        date: memos[idx].date,
                                        title: memos[idx].title,
                                        text: memos[idx].text,
                                        mtype: memos[idx].mtype
                                    };
                                    arr.push(obj);
                                }
                                return arr;
                            })(result.memos);

                            next({
                                note: _note,
                                memos: _memos
                            });
                        }
                    }
                });
            }
        ], function(result) {
            res.send(result);
        });
    }
    //noteID가 null이 아닌 경우, 해당 NoteID의 노트를 불러옴
    else {
        async.waterfall([
            function (next) {
                Note.findOne({_id: mongoose.Types.ObjectId(noteId)}, function(err, result) {
                    if (err) { return next(err); }
                    else {
                        if (result == null) { return next("노트가 없습니다."); }
                        else {
                            var _note = {
                                title: result.title,
                                idAttribute: result._id
                            };
                            var _memos = (function(memos){
                                var arr = new Array();
                                for (var idx=0, len=memos.length; idx<len; idx++) {
                                    var obj = {
                                        date: memos[idx].date,
                                        title: memos[idx].title,
                                        text: memos[idx].text,
                                        mtype: memos[idx].mtype
                                    };
                                    arr.push(obj);
                                }
                                return arr;
                            })(result.memos);

                            next({
                                note: _note,
                                memos: _memos
                            });
                        }
                    }
                })
            }
        ], function(result) {
            //console.log(result);
            res.send(result);
        });
    }
};

var saveMemo = function(req, res) {
    var noteId = req.body.noteId;
    var memos = req.body.memos;

    async.waterfall([
        function(callback) {
            Note.findOneAndUpdate(
                {_id: mongoose.Types.ObjectId(noteId)},
                {$set: {memos: memos}},
                function(err, result) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                    else {
                        //next();
                        callback(null, result);
                    }
                }
            )
        }, function(memos, callback) {
            console.log('save memo ' + memos.memos.length);
            console.log(memos.memos);
            callback();
        }
    ], function() {
        res.end();
    });
};




function replaceXss(str){
    if(str == null) {
        return null;
    } else {
        str = str.replace(/&/gi, "&amp;")
            .replace(/</gi, "&lt;")
            .replace(/>/gi, "&gt;")
            .replace(/\"/gi, "&quot;");
    }

    return str;
}