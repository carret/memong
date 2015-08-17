/**
 * Created by Jaewook on 2015-08-01.
 */
var async = require('async');
var db = require('../../db');
var Schema = db.Schema,
    ObjectId = Schema.ObjectId;
var Note = db.model('Note');
var User = db.model('User');

exports.doRoutes = function(app) {
    app.post('/note/load', loadNote)
    app.post('/note/add', addNote)
    app.post('/note/rename', renameNote)
    app.post('/note/remove', removeNote)

    app.post('/folder/add', addFolder)
    app.post('/folder/rename', renameFolder)
    app.post('/folder/remove', removeFolder)

    app.post('/note/test', testNote)
    app.post('/note',allNote)
    app.post('/user',allUser)
};

var updateTree =  function(existingCate, updatedCate){

    // treeview Update

    return updatedCate;
}

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

/*Note API*/
var addNote = function(req ,res) {

    var noteTitle = req.body.noteTitle;
    var noteParent = req.body.noteParent;
    var userToken = req.body.userToken;
    var userCategory ;

    async.waterfall(
        [
            function (callback) {
                User.findOne({ token: userToken }, function( err, validUser) {
                    if (err) callback(err);
                    if (validUser === null) callback(true, false);
                    else {
                        userCategory = validUser.category;
                        callback(null);
                    }
                });
            },

            function (callback) {
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

                    User.update({token: userToken}, {
                        $push: {
                            category: {
                                name: noteTitle,
                                type: 'note',
                                nid: savedNote['_id'],
                                parent: noteParent
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
                User.findOne({token: userToken}, function (err, updatedUser) {
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
            else res.send(savedNote + '|' + updateTree(userCategory, updatedUser.category));
        });
};

var loadNote = function(req ,res){

    var userToken = req.body.userToken;
    var noteId =req.body.noteId;

    async.waterfall(
        [
            function (callback)
            {
                User.findOne ( {token : userToken } , function( err, validUser) {
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
            else res.send(validNote);
        });
};

var removeNote = function(req ,res){

    var userToken = req.body.userToken;
    var noteId = req.body.noteId;
    var userCategory ;

    async.waterfall(
        [
            function (callback)
            {
                User.findOne({ token: userToken }, function( err, validUser) {
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

                User.update({token : userToken},validUser, {upsert: true}, function (err) {
                    if (err)
                        callback(err);
                    callback(null);
                });
            },

            function (callback) {
                User.findOne({token: userToken}, function (err, updatedUser) {
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
            else res.send(updateTree(userCategory, updatedUser.category));
        });
};

var renameNote =  function(req ,res) {

    var newTitle = req.body.newTitle;
    var userToken = req.body.userToken;
    var noteId = req.body.noteId;

    async.waterfall(
        [
            function (callback)
            {
                User.findOne ( {token : userToken } , function( err, validUser) {
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

                User.update({token : userToken},validUser, {upsert: true}, function (err) {
                    if ( err ) callback(err);
                    else {
                        Note.update({ _id : noteId }, {$set:{title : newTitle}} ,{upsert:true}, function(err) {
                            if ( err ) callback(err);
                            else callback(null);
                        }); }
                });
            },

            function (callback) {
                User.findOne ( {token : userToken } , function( err, validUser) {
                    if (err) callback(err);
                    if (validUser === null) callback(true, 'unregistered User');
                    else callback(null, validUser.category);
                });
            }
        ],
        function (err, updatedCate) {
            if (err) {
                if(validNote != null) res.send(validNote);
                else {
                    console.log(err);
                    res.send('error');
                }
            }
            else res.send(updatedCate);
        });
};

/////////////////////////////////////////////////////////////////////////////////////

/*Folder API*/
var addFolder = function(req ,res) {

    var userToken = req.body.userToken;
    var newTitle = req.body.newTitle;
    var folderParent = req.body.folderParent;
    var userCategory;

    async.waterfall(
        [
            function (callback) {
                User.findOne({ token: userToken }, function( err, validUser) {
                    if (err) callback(err);
                    if (validUser === null) callback(true, 'Unregistered User');
                    else {
                        userCategory = validUser.category;
                        callback(null);
                    }
                });
            },

            function (callback) {
                User.update({token: userToken}, {
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
                User.findOne({token: userToken}, function (err, updatedUser) {
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
            else res.send(updateTree(userCategory, updatedUser.category));
        });
};

var removeFolder = function(req ,res){
    var userToken = req.body.userToken;
    var folderId = req.body.folderId;
    var userCategory ;
    var i;

    async.waterfall(
        [
            function (callback) {
                User.findOne({ token: userToken }, function( err, validUser) {
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
                User.update({token : userToken},validUser, {upsert: true}, function (err) {
                    if (err) callback(err);
                    callback(null);
                });
            },
            function (callback) {
                User.findOne({token: userToken}, function (err, updatedUser) {
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
            else res.send(updateTree(userCategory, updatedUser.category));
        });
};

var renameFolder =  function(req ,res) {

    var userToken = req.body.userToken;
    var folderId = req.body.folderId;
    var newTitle = req.body.newTitle;
    var userCategory ;
    var i;

    async.waterfall(
        [
            function (callback) {
                User.findOne({ token: userToken }, function( err, validUser) {
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
                User.update({token : userToken},validUser, {upsert: true}, function (err) {
                    if (err) callback(err);
                    callback(null);
                });
            },
            function (callback) {
                User.findOne({token: userToken}, function (err, updatedUser) {
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
            else res.send(updateTree(userCategory, updatedUser.category));
        });
};

/*
 * User.findOne ( {token : userToken, category : { $all : [
 { $elemMatch : { nid : noteId} }]}} , function( err, validUser) {
 if (err)
 callback(err);
 if (validUser === null) callback(true, 'invalid access');
 else callback(null);
 });*/
