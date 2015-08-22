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

/*
DirectoryActionTypes : keyMirror({
    LOAD_TREE: null,
    MOVE_TREE: null,

    ADD_NOTE: null,
    RENAME_NOTE: null,
    DELETE_NOTE: null,

    DELETE_FOLDER: null,
    ADD_FOLDER: null,
    RENAME_FOLDER: null
}),
  */

var postDir = function(req ,res){


    var _username =  req.body.username;
    var _action = req.body.action;

    //console.log(_action.type);
    //console.log(Constants.DirectoryAPIType.ADD_NOTE);
    if(Constants.DirectoryAPIType.ADD_NOTE == _action.type) console.log(true);
    switch (_action.type){

        case Constants.DirectoryAPIType.ADD_NOTE :  addNoteToTree(_username, _action.tree, _action.data, res);

        default : break;
    }

};

var addNoteToTree = function(_username, _tree, _noteTitle, res) {

    console.log('test');
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
                        tree : _tree
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





/*Note API*/
var addNote = function(req ,res) {

    var noteTitle =  (req.body.noteTitle);
    var userName=  (req.body.userName);
    var userCategory ;

    async.waterfall(
        [
            function (callback) {
                User.findOne({ username: userName }, function( err, validUser) {
                    if (err) callback(err);
                    if (validUser === null) callback(true, false);
                    else {
                        userCategory = validUser.category;
                        callback(null, validUser.noteTable);
                    }
                });
            },

            function (callback, _noteTable) {
                var newNote = new Note({
                    title: noteTitle,
                    memos: [{
                        title: 'New Memo',
                        text: 'Text'
                    }]
                });

                newNote.save(function (err, savedNote) {
                    if (err)
                        callback(err);

                    User.update({username: userName}, {
                        $push: {
                            treeTable : {
                                id: _noteTable.length,
                                nid: savedNote['_id']
                            }
                        }
                    }, {upsert: true}, function (err, user) {
                        if (err)
                            callback(err);
                        callback(null, savedNote);
                    });

                });
            },

            function (savedNote, callback) {
                User.findOne({username: userName}, function (err, updatedUser) {
                    if (err)
                        callback(err);
                    callback(null, savedNote, updatedUser);
                }); }
        ],

        function (err, savedNote, updatedUser) {
            if (err) {
                if(savedNote == false) res.send('Unregistered User');
                else {
                    console.log(err);
                    res.send('error');
                }
            }
            else res.send( (savedNote + '|' + userCategory, updatedUser.category));
        });
};

var loadNote = function(req ,res){

    var userName =  (req.body.userName);
    var noteId =  (req.body.noteId);

    async.waterfall(
        [
            function (callback)
            {
                User.findOne ( {username : userName } , function( err, validUser) {
                    if (err)
                        callback(err);
                    if (validUser === null) callback(true, 'unregistered User');
                    else callback(null);
                });
            },

            function (callback) {
                Note.findOne({ _id : noteId }, function( err, validNote) {
                    if (err)
                        callback(err);

                    if (validNote === null) callback(true, 'unregistered Note');
                    else callback(null, validNote);
                });
            }
        ],

        function (err, validNote) {
            if (err) {
                if(validNote != null) res.send(validNote);
                else {
                    console.log(err);
                    res.send('error');
                }
            }
            else res.send( (validNote));
        });
};

var removeNote = function(req ,res){

    var userName =  (req.body.userName);
    var noteId =  (req.body.noteId);
    var userCategory ;

    async.waterfall(
        [
            function (callback)
            {
                User.findOne({ username: userName }, function( err, validUser) {
                    if (err) callback(err);
                    if (validUser === null) callback(true, false);
                    else {
                        userCategory = validUser.category;
                        Note.findOne({ _id : ObjectId(noteId)}, function( err, validNote) {
                            if (err) callback(err);
                            if (validNote === null) callback(true, 'unregistered Note');
                            else callback(null, validUser, validNote);
                        });
                    }
                });
            },

            function (validUser,validNote, callback) {
                validNote.remove(function (err) {
                    if (err)
                        callback(err);
                    callback(null,validUser);
                });
            },

            function (validUser, callback) {
                for(var i=validUser.category.length-1; i >=0 ;  i--)
                    if(validUser.category[i].nid == noteId) validUser.category.splice(i, 1);

                User.update({username : userName},validUser, {upsert: true}, function (err) {
                    if (err)
                        callback(err);
                    callback(null);
                });
            },

            function (callback) {
                User.findOne({username: userName}, function (err, updatedUser) {
                    if (err)
                        callback(err);
                    callback(null,updatedUser);
                });
            }
        ],

        function (err, updatedUser) {
            if (err) {
                if(updatedUser != null) res.send(updatedUser);
                else {
                    console.log(err);
                    res.send('error');
                }
            }
            else res.send(((userCategory, updatedUser.category)));
        });
};

var renameNote =  function(req ,res) {

    var newTitle =  (req.body.newTitle);
    var userName =  (req.body.userName);
    var noteId =  (req.body.noteId);

    async.waterfall(
        [
            function (callback)
            {
                User.findOne ( {username : userName } , function( err, validUser) {
                    if (err)
                        callback(err);

                    if (validUser === null) callback(true, 'unregistered User');
                    else {
                        Note.findOne({ _id : noteId}, function( err, validNote) {
                            if (err)
                                callback(err);
                            if (validNote === null) callback(true, 'unregistered Note');
                            else callback(null, validUser);
                        });
                    }
                });
            },

            function (validUser,callback) {

                for(var i=0;i<validUser.category.length;i++)
                    if(validUser.category[i].nid == noteId) validUser.category[i].name = newTitle;

                User.update({username : userName},validUser, {upsert: true}, function (err) {
                    if ( err ) callback(err);
                    else {
                        Note.update({ _id : noteId }, {$set:{title : newTitle}} ,{upsert:true}, function(err) {
                            if ( err ) callback(err);
                            else callback(null);
                        }); }
                });
            },

            function (callback) {
                User.findOne ( {username : userName } , function( err, validUser) {
                    if (err) callback(err);
                    if (validUser === null) callback(true, 'unregistered User');
                    else callback(null, validUser.category);
                });
            }
        ],
        function (err, updatedCate) {
            if (err) {
                if(updatedCate != null) res.send(updatedCate);
                else {
                    console.log(err);
                    res.send('error');
                }
            }
            else res.send((updatedCate));
        });
};

/////////////////////////////////////////////////////////////////////////////////////

/*Folder API*/
var addFolder = function(req ,res) {

    var userName =  (req.body.userName);
    var newTitle =  (req.body.newTitle);
    var folderParent =  (req.body.folderParent);
    var userCategory;

    async.waterfall(
        [
            function (callback) {
                User.findOne({ username: userName }, function( err, validUser) {
                    if (err) callback(err);
                    if (validUser === null) callback(true, 'Unregistered User');
                    else {
                        userCategory = validUser.category;
                        callback(null);
                    }
                });
            },

            function (callback) {
                User.update({username: userName}, {
                    $push: {
                        category: {
                            name: newTitle,
                            type: 'folder',
                            parent: folderParent
                        } }
                }, {upsert: true}, function (err, user) {
                    if (err) callback(err);
                    callback(null);
                });
            },

            function (callback) {
                User.findOne({username: userName}, function (err, updatedUser) {
                    if (err) callback(err);
                    callback(null, updatedUser);
                });
            }
        ],
        function (err, updatedUser) {
            if (err) {
                if(updatedUser !=  null) res.send('Unregistered User');
                else {
                    console.log(err);
                    res.send('error');
                }
            }
            else res.send(un ((userCategory, updatedUser.category)));
        });
};

var removeFolder = function(req ,res){
    var userName = (req.body.userName);
    var folderId = (req.body.folderId);
    var userCategory ;
    var i;

    async.waterfall(
        [
            function (callback) {
                User.findOne({ username: userName }, function( err, validUser) {
                    if (err) callback(err);
                    if (validUser === null) callback(true, 'unregistered User');
                    else {
                        userCategory = validUser.category;
                        for(i=validUser.category.length-1; i>=0 ;i--) {
                            console.log(validUser.category[i]);
                            if (validUser.category[i]._id == folderId) {
                                validUser.category.splice(i, 1);
                                break;
                            }
                        }
                        if(i >= 0) callback(null, validUser);
                        else callback(true, 'unregistered Folder');
                    }
                });
            },
            function (validUser, callback) {
                User.update({username : userName},validUser, {upsert: true}, function (err) {
                    if (err) callback(err);
                    callback(null);
                });
            },
            function (callback) {
                User.findOne({username: userName}, function (err, updatedUser) {
                    if (err)  callback(err);
                    callback(null,updatedUser);
                });
            }
        ],

        function (err, updatedUser) {
            if (err) {
                if(updatedUser != null) res.send(updatedUser);
                else {
                    console.log(err);
                    res.send('error');
                }
            }
            else res.send(((userCategory, updatedUser.category)));
        });
};

var renameFolder =  function(req ,res) {

    var userName =  (req.body.userName);
    var folderId =  (req.body.folderId);
    var newTitle =  (req.body.newTitle);
    var userCategory ;
    var i;

    async.waterfall(
        [
            function (callback) {
                User.findOne({ username: userName }, function( err, validUser) {
                    if (err) callback(err);
                    if (validUser === null) callback(true, 'unregistered User');
                    else {
                        userCategory = validUser.category;
                        for(i=validUser.category.length-1; i>=0 ;i--) {
                            if (validUser.category[i]._id == folderId) {
                                validUser.category[i].name = newTitle;
                                break;
                            }
                        }
                        if(i >= 0) callback(null, validUser);
                        else callback(true, 'unregistered Folder');
                    }
                });
            },
            function (validUser, callback) {
                User.update({username : userName},validUser, {upsert: true}, function (err) {
                    if (err) callback(err);
                    callback(null);
                });
            },
            function (callback) {
                User.findOne({username: userName}, function (err, updatedUser) {
                    if (err)  callback(err);
                    callback(null,updatedUser);
                });
            }
        ],

        function (err, updatedUser) {
            if (err) {
                if(updatedUser != null) res.send(updatedUser);
                else {
                    console.log(err);
                    res.send('error');
                }
            }
            else res.send(((userCategory, updatedUser.category))
            );
        });
};

/*
 * User.findOne ( {username : userName, category : { $all : [
 { $elemMatch : { nid : noteId} }]}} , function( err, validUser) {
 if (err)
 callback(err);
 if (validUser === null) callback(true, 'invalid access');
 else callback(null);
 });*/
