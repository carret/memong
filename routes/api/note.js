var db = require('../../db');
var Note = db.model('Note');
var User = db.model('User');

var Constants = require('../../src/constants/Constants');

var mongoose = require('mongoose');

var async = require('async');

var jwt = require('jwt-simple');
var pkgInfo = require('../../package');



exports.doRoutes = function(app) {
    app.get(Constants.API.GET_NOTE_WITH_MEMO , getSelectNoteWithMemo);
    app.post(Constants.API.POST_NOTE_WITH_MEMO, saveMemo);

};


var getSelectNoteWithMemo = function(req, res) {
    var userToken = _replaceXss(req.query.userToken);
    var nodeId = _replaceXss(req.query.noteId);

    var userName;
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
                        if (result == null) { return next("노트가 없습니다."); }
                        else {
                            var selectNodeId = _findNodeId(treeTable, selectNoteId.toString());
                            console.log("selectNoteId", selectNoteId);
                            console.log("treeTable", treeTable);
                            console.log("selectNodeId", selectNodeId);
                            var _note = {
                                title: result.title,
                                idAttribute: result._id,
                                nodeId: selectNodeId
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
                                nodeId: nodeId
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
            console.log(result);
            res.send(result);
        });
    }
};

var saveMemo = function(req, res) {
    var noteId = req.body.noteId;
    var memos = req.body.memos;

    console.log("memos", memos);

    async.waterfall([
        function(callback) {
            Note.findOneAndUpdate(
                {_id: mongoose.Types.ObjectId(noteId)},
                {$set: {memos: memos}},
                {upsert: true},
                function(err, result) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                    else {
                        //next();
                        callback(null, result.memos);
                    }
                }
            )
        }, function(memos, callback) {
            console.log("Memo Saved", memos);
            callback();
        }
    ], function() {
        res.end();
    });
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
            console.log("yaho");
            console.log(treeTable[idx]['nid']);
            if (treeTable[idx]['nid'].toString() == targetId) {
                return treeTable[idx]['id'];
            }
        }
    }
}