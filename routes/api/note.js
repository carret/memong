var db = require('../../db');
var Note = db.model('Note');
var User = db.model('User');
var Index = db.model('Index');

var Constants = require('../../src/constants/Constants');

var mongoose = require('mongoose');

var async = require('async');

var jwt = require('jwt-simple');
var pkgInfo = require('../../package');
var mecab = require('mecab-ffi');

var userName;



exports.doRoutes = function(app) {
    app.get(Constants.API.GET_NOTE_WITH_MEMO , getSelectNoteWithMemo);
    app.get(Constants.API.GET_NOTE_WITH_MEMO_BY_SEARCH, getNoteWithMemoBySearch);
    app.post(Constants.API.POST_NOTE_WITH_MEMO, saveMemo);

};

var getNoteWithMemoBySearch = function(req, res) {
    var userToken = req.query.userToken;
    var memoId = req.query.memoId;

    var userName;
    if ( userToken != null) {
        userName = jwt.decode(userToken, pkgInfo.oauth.token.secret).username;
    }

    async.waterfall([
        function(callback) {
            Note.findOne(
                {memos: {'$elemMatch': {_id: memoId}} },
                function(err, result) {
                    if (err) { return next(err); }
                    else {
                        var note = {
                            title: result.title,
                            idAttribute: result._id,
                            date: result.date
                        };
                        var memos = (function(memos){
                            var arr = new Array();
                            for (var idx=0, len=memos.length; idx<len; idx++) {
                                var obj = {
                                    _id: memos[idx]._id,
                                    date: memos[idx].date,
                                    title: memos[idx].title,
                                    text: memos[idx].text,
                                    mtype: memos[idx].mtype
                                };
                                arr.push(obj);
                            }
                            return arr;
                        })(result.memos);

                        callback(null, note, memos);
                    }
                }
            )
        },
        function(note, memos, callback) {
            User.findOneAndUpdate(
                {username: userName},
                {selectNoteId: note.idAttribute},
                function(err, result) {
                if (err) { return next(err); }
                else {
                    if (result == null) {
                        console.log("유저 없음");
                        return next("유저가 없습니다.");
                    }
                    else {
                        var selectNodeId = _findNodeId(result.treeTable, note.idAttribute.toString());
                        note.nodeId = selectNodeId;
                        callback({
                            note: note,
                            memos: memos
                        });
                    }
                }
            })
        }
    ], function(result) {
        res.send(result);
    })
};

var getSelectNoteWithMemo = function(req, res) {
    var userToken = _replaceXss(req.query.userToken);
    var nodeId = _replaceXss(req.query.noteId);

    if ( userToken != null ) {
        userName = jwt.decode(userToken, pkgInfo.oauth.token.secret).username;
    }
    //noteID가 null인 경우, selectNote를 불러옴
    if (nodeId == null) {
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
                            next(null, result.selectNoteId, result.treeTable);
                        }
                    }
                });
            },
            function(selectNoteId, treeTable, next) {
                Note.findOne({_id: mongoose.Types.ObjectId(selectNoteId)}, function(err, result) {
                    if (err) { return next(err); }
                    else {
                        if (result == null) {
                            next({
                                note: null,
                                memos: null
                            });
                        }
                        else {
                            var selectNodeId = _findNodeId(treeTable, selectNoteId.toString());
                            var _note = {
                                title: result.title,
                                idAttribute: result._id,
                                nodeId: selectNodeId,
                                date: result.date
                            };
                            var _memos = (function(memos){
                                var arr = new Array();
                                for (var idx=0, len=memos.length; idx<len; idx++) {
                                    var obj = {
                                        _id: memos[idx]._id,
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
    //noteID가 null이 아닌 경우, 선택된 NoteID의 노트를 불러옴
    else {
        async.waterfall([
            function(next) {
                User.findOne({username: userName}, function(err, result) {
                    if (err) { return next(err); }
                    else {
                        if (result == null) {
                            console.log("유저 없음");
                            return next("유저가 없습니다");
                        }
                        else {
                            var noteId = _findNid(result.treeTable, nodeId);
                            next(null, noteId, nodeId);
                        }
                    }
                })
            },
            function(noteId, nodeId, next) {
                User.update(
                    {username: userName},
                    {selectNoteId: noteId},
                    function(err, result) {
                        if (err) { return next(err); }
                        else {
                            next(null, noteId, nodeId);
                        }
                })
            },
            function (noteId, nodeId, next) {
                Note.findOne({_id: mongoose.Types.ObjectId(noteId)}, function(err, result) {
                    if (err) { return next(err); }
                    else {
                        if (result == null) {
                            next({
                                note: null,
                                memos: null
                            });
                        }
                        else {
                            var _note = {
                                title: result.title,
                                idAttribute: result._id,
                                nodeId: nodeId,
                                date: result.date
                            };
                            var _memos = (function(memos){
                                var arr = new Array();
                                for (var idx=0, len=memos.length; idx<len; idx++) {
                                    var obj = {
                                        _id: memos[idx]._id,
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
                {upsert: true},
                function(err, result) {
                    if (err) { res.send(err); }
                    else {
                        callback(null);
                    }
                }
            )
        },
        function(callback) {
            Note.findOne(
                {_id: mongoose.Types.ObjectId(noteId)},
                function(err, result) {
                    if (err) { res.send(err); }
                    else {
                        callback(null, result.memos);
                    }
                }
            )
        },
        function(memos, callback) {
            //console.log(memos);
            Index.remove({username: userName}).exec();

            User.find({username: userName}, function (err, user) {
                callback(null, user[0].treeTable);
            });
        }, function(noteIds, callback) {
            for ( var i = 0; i < noteIds.length; i++ ) {

                (function (currentI) {
                    if (noteIds[currentI].nid != null) {
                        Note.find({_id: noteIds[currentI].nid}, function (err, note) {
                            memos = note[0].memos;

                            for (var i = 0; i < memos.length; i++) {

                                (function (currentI) {
                                    var memo = memos[currentI];
                                    var splitIndex = memo.text.indexOf("\n");
                                    var content = (memo.text.substring(splitIndex, memo.text.length)).substring(0, 20);
                                    async.waterfall([
                                        function (callback) {
                                            mecab.extractSortedNounCounts(memo.title, function (err, result) {
                                                if (!err) {
                                                    callback(null, result);
                                                }
                                            });
                                        }, function (titleNouns, callback) {
                                            mecab.extractSortedNounCounts(content, function (err, result) {
                                                if (!err) {
                                                    callback(null, titleNouns, result);
                                                }
                                            })
                                        }, function (titleNouns, contentNouns, callback) {
                                            var result = [];
                                            for (var i = 0; i < titleNouns.length; i++) {
                                                var newNoun = {
                                                    noun: titleNouns[i].noun,
                                                    weight: titleNouns[i].count * 5
                                                };
                                                result.push(newNoun);
                                            }
                                            for (var i = 0; i < contentNouns.length; i++) {
                                                var isSame = false;
                                                for (var j = 0; j < result.length; j++) {
                                                    if (result[j].noun == contentNouns[i].noun) {
                                                        result[j].weight += contentNouns[i].count * 3;
                                                        isSame = true;
                                                        break;
                                                    }
                                                }

                                                if (!isSame) {
                                                    var newNoun = {
                                                        noun: contentNouns[i].noun,
                                                        weight: contentNouns[i].count * 3
                                                    };
                                                    result.push(newNoun);
                                                }
                                            }
                                            callback(null, result);
                                        }, function (result, callback) {
                                            console.log(result);
                                            for (var i = 0; i < result.length; i++) {
                                                (function (currentI) {
                                                    Index.update({word: result[currentI].noun, username: userName}, {
                                                        $push: {
                                                            memos: {
                                                                memo: {
                                                                    memoId: memo._id,
                                                                    title: ' ' + memo.title,
                                                                    summary: ' ' + content,
                                                                    weight: ' ' + result[currentI].weight
                                                                }
                                                            }
                                                        }
                                                    }, {upsert: true}, function (err) {
                                                        if (err) {
                                                            console.log(err)
                                                        }
                                                    })
                                                }(i));
                                            }
                                            res.end();
                                            callback();
                                        }
                                    ])

                                }(i));

                            }
                            callback();


                        });
                    }
                }(i))
            }
        }

    ])
};




function _replaceXss(str){
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

function _findNid(treeTable, targetId) {
    var len = treeTable.length;
    for (var idx=0; idx<len; idx++) {
        if (treeTable[idx]['id'] == targetId) {
            return treeTable[idx]['nid'];
        }
    }
}

function _findNodeId(treeTable, targetId) {
    var len = treeTable.length;
    for (var idx=0; idx<len; idx++) {
        if (treeTable[idx]['nid'] != null) {
            if (treeTable[idx]['nid'].toString() == targetId) {
                return treeTable[idx]['id'];
            }
        }
    }
}