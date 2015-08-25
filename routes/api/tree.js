var Constants = require('../../src/constants/Constants');
var async = require('async');
var db = require('../../db');

var Schema = db.Schema,
    ObjectId = Schema.ObjectId;

var Note = db.model('Note');
var User = db.model('User');

var jwt = require('jwt-simple');
var pkgInfo = require('../../package');


exports.doRoutes = function(app) {
    app.get(Constants.API.POST_ROAD_DIRECTORY, loadTree);
    app.post(Constants.API.POST_DIRECTORY, postDir);
};

var postDir = function(req ,res){

    var userToken =  req.body.token;
    var _action = req.body.action;

    var userName;
    if ( userToken != null ) {
        userName = jwt.decode(userToken, pkgInfo.oauth.token.secret).username;
    }

    switch (_action.type){

        case Constants.DirectoryAPIType.ADD_NOTE :
            addNoteToTree(userName, _action.tree, _action.data, res);
            break;

        case Constants.DirectoryAPIType.RENAME_NOTE :
            renameNoteToTree(userName, _action.tree, _action.data, _action.data2, res);
            break;

        case Constants.DirectoryAPIType.ADD_FOLDER :
            addFolderToTree(userName, _action.tree, res);
            break;

        case Constants.DirectoryAPIType.CHANGE_TREE :
            renameFolder_movingTreeToTree(userName, _action.tree, res);
            break;

        case Constants.DirectoryAPIType.DELETE_FOLDER :
            deleteFolderToTree(userName, _action.tree, _action.data, res);
            break;

        case Constants.DirectoryAPIType.DELETE_NOTE :
            deleteNoteToTree(userName, _action.tree, _action.data, res);
            break;

        default : break;
    }
};

/* FOR USER EVENT API*/
var addNoteToTree = function(_username, _tree, _noteTitle, res) {
    async.waterfall(
        [
            function (callback) {
                User.findOne({ username: _username }, function( err, validUser) {
                    if (err) callback(err);
                    if (validUser === null) callback(true, false);
                    else
                        callback(null,validUser.treeTable);
                });
            },

            function (_treeTable, callback) {
                var newNote = new Note({
                    title: _noteTitle,
                    memos: [{
                        title: '새로운 메모',
                        text: '# 새로운 메모\n이 메모를 클릭하여 편집하세요.',
                        mtype: Constants.MemoType.COMPLETE_MEMO
                    }]
                });

                newNote.save(function (err, savedNote) {
                    if (err)
                        callback(err);

                    User.update({username: _username}, {
                        $push: {
                            treeTable : {
                                id: _treeTable.length,
                                nid: savedNote['_id']
                            }
                        }
                    }, {upsert: true}, function (err, user) {
                        if (err)
                            callback(err);
                        console.log(savedNote._id);
                        callback(null, savedNote._id);
                    });

                });
            },

            function (_noteId, callback) {
                User.update({username: _username},  {
                    tree : _tree,
                    selectNoteId: _noteId
                }, {upsert: true}, function (err, user) {
                    if (err)
                        callback(err);
                    callback(null, _noteId);
                }); }
        ],

        function (err, _noteId) {
            if (err) {
                if(_noteId == false) res.send('Unregistered User');
                else {
                    console.log(err);
                    res.send('error');
                }
            }
            else res.send({noteId: _noteId});
        });
};

var addFolderToTree = function(_username, _tree, res){
    async.waterfall(
        [
            function (callback) {
                User.findOne({ username: _username }, function( err, validUser) {
                    if (err) callback(err);
                    if (validUser === null) callback(true, false);
                    else {
                        callback(null,validUser.treeTable);
                    }
                });
            },

            function (_treeTable, callback) {

                User.update({username: _username}, {
                    $push: {
                        treeTable : {
                            id: _treeTable.length,
                            nid: null
                        }
                    }
                }, {upsert: true}, function (err, user) {
                    if (err)
                        callback(err);
                    callback(null);
                });
            },

            function ( callback) {
                User.update({username: _username},  {
                    tree : _tree
                }, {upsert: true}, function (err, user) {
                    if (err)
                        callback(err);
                    callback(null);
                }); }
        ],

        function (err) {
            if (err) res.send('error');
            else res.send('success');
        });

};

var renameNoteToTree = function(_username, _tree, _newTitle, _id, res) {
    async.waterfall(
        [
            function (callback)
            {
                User.findOne ( {username : _username } , function( err, validUser) {
                    if (err)
                        callback(err);

                    if (validUser === null) callback(true, 'unregistered User');
                    else {
                        var noteId = validUser.treeTable[_id].nid;
                        Note.findOne({ _id : noteId}, function( err, validNote) {
                            if (err)
                                callback(err);
                            if (validNote === null) callback(true, 'unregistered Note');
                            else  callback(null,noteId);
                        });
                    }
                });
            },

            function (_noteId, callback) {
                Note.update({ _id : _noteId }, {$set:{title : _newTitle}} ,{upsert:true}, function(err) {
                    if ( err ) callback(err);
                    else callback(null, _noteId);
                });
            },

            function (_noteId, callback) {
                User.update({username: _username},  {
                    tree : _tree,
                    selectNoteId: _noteId
                }, {upsert: true}, function (err, user) {
                    if (err) callback(err);
                    else callback(null, _noteId);
                });
            }
        ],
        function (err, _noteId) {
            if (err) {
                if(_noteId != null) res.send(_noteId);
                else {
                    console.log(err);
                    res.send('error');
                }
            }
            else res.send({noteId: _noteId});
        });

};

var renameFolder_movingTreeToTree = function(_username, _tree, res) {
    async.waterfall(
        [
            function (callback)
            {
                User.findOne ( {username : _username } , function( err, validUser) {
                    if (err)
                        callback(err);

                    if (validUser === null) callback(true, 'unregistered User');
                    else callback(null);
                });
            },

            function (callback) {
                User.update({username: _username},  {
                    tree : _tree
                }, {upsert: true}, function (err, user) {
                    if (err) callback(err);
                    else callback(null);
                });
            }
        ],

        function (err) {
            if (err) res.send('error');
            else res.send('success');
        });
};

var deleteFolderToTree = function(_username, _tree, _children, res) {

    async.waterfall(
        [
            function (callback)
            {
                User.findOne ( {username : _username } , function( err, validUser) {
                    if (err) callback(err);

                    if (validUser === null) callback(true, 'unregistered User');
                    else callback(null, validUser.treeTable);
                });
            },

            function (_treeTable, callback) {
                var i;
                for(i=0;i<_children.length; i++) {
                    if(_children[i].type == "note") {
                        var nid = _treeTable[(_children[i].id)].nid;
                        _treeTable[(_children[i].id)].nid = null;

                        Note.remove({_id: nid}, function (err) {
                            if (err) callback(err);
                            else if(i == _children.length) callback(null, _treeTable);
                        });
                    }
                }
            },

            function (_treeTable, callback) {
                var i, _noteId;
                for( i=0; i<_treeTable.length; i++)
                    if(_treeTable[i].nid != null){
                        _noteId = _treeTable[i].nid;
                        break;
                    }
                if(i==_treeTable.length) _noteId = null;

                console.log('noteId : ',_noteId);

                User.update({username: _username},  {
                    tree : _tree,
                    treeTable : _treeTable,
                    selectNoteId: _noteId
                }, {upsert: true}, function (err, user) {
                    if (err) callback(err);
                    else callback(null, _noteId);
                });
            }
        ],
        function (err, _noteId) {
            if (err) {
                if(_noteId != null) res.send(_noteId);
                else {
                    console.log(err);
                    res.send('error');
                }
            }
            else res.send({noteId: _noteId});
        });
};
var deleteNoteToTree = function(_username, _tree, _id, res) {

    async.waterfall(
        [
            function (callback)
            {
                User.findOne ( {username : _username } , function( err, validUser) {
                    if (err)
                        callback(err);

                    if (validUser === null) callback(true, 'unregistered User');
                    else {
                        var noteId = validUser.treeTable[_id].nid;
                        validUser.treeTable[_id].nid = null;

                        Note.findOne({ _id : noteId}, function( err, validNote) {
                            if (err)
                                callback(err);
                            console.log(validNote);
                            if (validNote === null) callback(true, 'unregistered Note');
                            else  callback(null,noteId,validUser.treeTable);
                        });
                    }
                });
            },

            function (noteId,_treeTable, callback) {
                Note.remove({ _id : noteId}, function (err) {
                    if (err) callback(err);
                    else callback(null, _treeTable);
                });
            },

            function (_treeTable, callback) {

                console.log(_treeTable);


                var i, _noteId;
                for( i=0; i<_treeTable.length; i++)
                    if(_treeTable[i].nid != null){
                        _noteId = _treeTable[i].nid;
                        break;
                    }
                if(i==_treeTable.length) _noteId = null;

                User.update({username: _username},  {
                    tree : _tree,
                    treeTable : _treeTable,
                    selectNoteId: _noteId
                }, {upsert: true}, function (err) {
                    if (err) callback(err);
                    else callback(null, _noteId);
                });
            }
        ],
        function (err, _noteId) {
            if (err) {
                if(_noteId != null) res.send(_noteId);
                else {
                    console.log(err);
                    res.send('error');
                }
            }
            else res.send({noteId: _noteId});
        });
};

/* FOR INIT TREE */
var loadTree = function(req ,res){
    var userToken = req.query.username;
    var _tree, _count;

    var userName;
    if ( userToken != null ) {
        userName = jwt.decode(userToken, pkgInfo.oauth.token.secret).username;
    }

    User.findOne ( {username : userName } , function(err, validUser) {
        if (err) { res.send('error'); }
        if (validUser == null) { res.send('unregistered User'); }
        else {
            var selectNoteId = validUser.selectNoteId;
            var selectNoteNodeId = _findNodeId(validUser.treeTable, selectNoteId);

            _tree = JSON.parse(validUser.tree);
            _count = validUser.treeTable.length;

            res.send({
                tree : _tree,
                count : _count,
                selectNoteNodeId: selectNoteNodeId
            });
        }
    });
};


function _findNodeId(treeTable, targetId) {

    var len = treeTable.length;
    for (var idx=0; idx<len; idx++) {
        if (treeTable[idx]['nid'] == targetId) {
            return treeTable[idx]['id'];
        }
    }
}