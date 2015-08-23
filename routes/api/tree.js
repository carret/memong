/**
 * Created by Jaewook on 2015-08-01.
 */

var Constants = require('../../src/constants/Constants');
var async = require('async');
var db = require('../../db');

var Schema = db.Schema,
    ObjectId = Schema.ObjectId;

var Note = db.model('Note');
var User = db.model('User');

var _initData = [
    {
        label: 'root', id: 0, type: 'folder',
        children: [
            {
                label: 'node1', id: 1, type: 'folder',
                children: [
                    {label: 'child1', id: 2, type: 'note'}
                ]
            }
        ]
    }];

exports.doRoutes = function(app) {

    app.post(Constants.API.POST_ROAD_DIRECTORY, loadTree)
    app.post(Constants.API.POST_DIRECTORY, postDir)

    app.post('/note',allNote)
    app.post('/user',allUser)

    app.post('/init',initTreeTest)
};


var postDir = function(req ,res){

    console.log('receive server');

    var _username =  req.body.username;
    var _action = req.body.action;

    console.log(_action.type);

    if(Constants.DirectoryAPIType.ADD_NOTE == _action.type) console.log(true);
    switch (_action.type){

        case Constants.DirectoryAPIType.ADD_NOTE :  addNoteToTree(_username, _action.tree, _action.data, res);
            break;

        case Constants.DirectoryAPIType.RENAME_NOTE :  renameNoteToTree(_username, _action.tree, _action.data, _action.data2, res);
            break;

        case Constants.DirectoryAPIType.ADD_FOLDER : addFolderToTree(_username, _action.tree, res);
            break;

        case Constants.DirectoryAPIType.CHANGE_TREE : renameFolder_movingTreeToTree(_username, _action.tree, res);
            break;

        case Constants.DirectoryAPIType.DELETE_FOLDER : renameFolder_movingTreeToTree(_username, _action.tree, res);
            break;

        case Constants.DirectoryAPIType.DELETE_NOTE : deleteNoteToTree(_username, _action.tree, _action.data, res);
            break;


        default : break;
    }

};

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
                        title: 'New Memo',
                        text: 'Text'
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
                            id: _treeTable.length
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

}

var renameNoteToTree = function(_username, _tree, _newTitle, _id, res) {

    console.log('receive rename server');

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

    console.log('receive rename folder server');

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



var deleteFolderToTree = function(_username, _tree, _children, res)
{
    console.log(_children);
    async.waterfall(
        [
            function (callback)
            {
                User.findOne ( {username : _username } , function( err, validUser) {
                    if (err)
                        callback(err);

                    if (validUser === null) callback(true, 'unregistered User');
                    else callback(null, validUser.treeTable);
                });
            },

            function (_treeTable, callback) {

                for(var i=0;i<_children.length; i++) {

                    if(_children[i].type == "note") {
                        var nid = _treeTable[(_children[i]._id)].nid;

                        Note.remove({_id: nid}, function (err) {
                            if (err) callback(err);
                            else if(i == children.length-1) callback(null);
                        });
                    }
                }
            },

            function (callback) {
                var _noteId = findNote(_tree);

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
}

var deleteNoteToTree = function(_username, _tree, _id, res)
{
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
                            else  callback(null,validNote);
                        });
                    }
                });
            },

            function (_validNote, callback) {

                _validNote.remove(function (err) {
                    if (err) callback(err);
                    else callback(null);
                });
            },

            function (callback) {
                var _noteId = findNote(_tree);
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
}

var findNote = function (_tree){

}

var initTreeTest = function(req ,res){

    var _username = req.body.username;
    var noteTitle =  (req.body.noteTitle);

    User.findOne({ username: _username }, function( err, validUser) {

        var initData = JSON.stringify(_initData);
        validUser.tree = initData;

        User.update({username: _username},
            validUser
        , {upsert: true}, function (err, user) {

            var newNote = new Note({
                title: noteTitle,
                memos: [{
                    title: 'New Memo',
                    text: 'Text'
                }]
            });

            newNote.save(function (err, savedNote) {

                User.update({username: _username}, {
                    $push: {
                        treeTable : {
                            id: 0
                        }
                    }
                }, {upsert: true}, function (err, user) {

                    User.update({username: _username}, {
                        $push: {
                            treeTable : {
                                id: 1
                            }
                        }
                    }, {upsert: true}, function (err, user) {

                        User.update({username: _username}, {
                            $push: {
                                treeTable : {
                                    id: 2,
                                    nid: savedNote['_id']
                                }
                            }
                        }, {upsert: true}, function (err, user) {

                            res.send(user);
                        });

                    });

                });

            });
        });

    });
};

var moveTree = function(req ,res){

    var _username = req.body.username;
    var noteTitle =  (req.body.noteTitle);

};

var initTree = function(user, nid, fid){

    var initData = JSON.stringify(_initData);

    user.category.tree = initData;
    user.category.tree = Date.now;
};

/*Test API*/
var allNote =  function(req ,res){

    Note.find(function(err,test) {
        if (err) {
            console.err(err);
            throw err;
        }
        res.send(test);
    });
}
var allUser =  function(req ,res){

    User.find(function(err,test) {
        if (err) {
            console.err(err);
            throw err;
        }
        res.send(test);
    });
}


var loadTree = function(req ,res){

    var _username = req.body.username;
    var _tree, _count;

    User.findOne ( {username : _username } , function( err, validUser) {
        if (err) res.send('error');
        if (validUser === null) res.send('unregistered User');
        else {
            _tree = JSON.parse(validUser.tree);
            _count = validUser.treeTable.length;
            res.send(
                {
                    tree : _tree,
                    count : _count
                }
            );
        }
    });
};



