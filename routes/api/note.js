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

    app.post('/note/dic', addDir)
    app.post('/note/test', testNote)
    app.post('/note/folder/add', addFolder)

};

var updateTree =  function(existingCate, updatedCate){

    // treeview Update

    return updatedCate;
}



var addNote = function(req ,res) { ///// 트리뷰에 추가하는 작업 필요

    var userToken = req.body.userToken;
    var userCategory = req.body.userCategory;
    var noteTitle = req.body.noteTitle;
    var noteParent = req.body.noteParent;

    async.waterfall(
        [
            function (callback)
            {
                User.findOne({ token: userToken }, function( err, validUser) {
                    if (err)
                        console.log(err);

                    if (validUser === null) callback(true, false);
                    else callback(null);
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
                    callback(null, savedNote);
                });
            },

            function (savedNote, callback) {

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
            },

            function (savedNote, callback) {
                User.findOne({token: userToken}, function (err, updatedUser) {
                    if (err)
                        callback(err);
                    callback(null, savedNote, updatedUser);
                });
            }
        ],

        function (err, savedNote, updatedUser) {
            if (err) {
                if(savedNote == false) res.send('Unregistered User');
                else console.log(err);
            }
            else res.send(savedNote + '|' + updateTree(userCategory, updatedUser.category));
        });
};

var loadNote = function(req ,res){

    var userToken = req.body.userToken;
    var noteId = ObjectId(req.body.noteId);

    async.waterfall(
        [
            function (callback)
            {
                User.findOne ( {token : userToken} , function( err, validUser) {
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
                else console.log(err);
            }
            else res.send(validNote);
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

var removeNote = function(req ,res){

    var userToken = req.body.userToken;
    var noteId = req.body.noteId;

    async.waterfall(
        [
            function (callback)
            {
                User.findOne( {token : userToken, category : { $all : [
                { $elemMatch : { nid : ObjectId(noteId)} }]}} ,
                function( err, validUser) {
                    if (err)
                        callback(err);

                    if (validUser === null) callback(true, 'invalid access');
                    else {
                        userCategory = validUser.category;
                        console.log(validUser);
                        callback(null, validUser);
                    }
                });
            },

            function (validUser,callback) {
                Note.findOne({ _id : ObjectId(noteId)}, function( err, validNote) {
                    if (err)
                        callback(err);
                    if (validNote === null) callback(true, 'unregistered Note');
                    else callback(null, validUser, validNote);
                });
            },

            function (validUser,validNote, callback) {
                validNote.remove(function (err) {
                    if (err)
                        callback(err);
                    callback(null,validUser);
                });
            },

            function (validUser,callback) {
                User.update({token : userToken},{ $pull : { category: { }}}, {upsert: true}, function (err) {
                    if (err)
                        callback(err);
                    callback(null, validUser);
                });
            },

            function (validUser, callback) {

                for(var i=validUser.category.length-1; i >=0 ;  i--){
                    console.log(i);
                    if(validUser.category[i].nid == noteId) validUser.category.splice(i, 1);
                }

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
                else console.log(err);
            }
            else res.send(updateTree(userCategory, updatedUser.category));
        });
};

var renameNote =  function(req ,res) {

    var newTitle = req.body.newTitle;
    var userToken = req.body.userToken;
    var noteId = req.body.noteId;

    Note.findOne({ _id : req.body.noteId  }, function( err, validNote) {
        if (err)
            console.log(err);
        console.log( validNote);
    });

    Note.update({ _id : noteId }, {$set : {title : newTitle}} , function(err,w) {
        if ( err )
            console.log (err);
        console.log (w);
    });

    res.end();

    /*

    async.waterfall(
        [
            function (callback)
            {
                User.findOne( { token: userToken, category : {$all : [
                    {"$elemMatch" : {nid : noteId
                    } }]}} , function( err, validUser) {
                    if (err)
                        callback(err);

                    if (validUser === null) callback(true, 'invalid access');
                    else callback(null);
                });
            },

            function (callback) {
                Note.findOne({ _id : noteId}, function( err, validNote) {
                    if (err)
                        callback(err);

                    if (validNote === null) callback(true, 'unregistered Note');
                    else callback(null, validNote);
                });
            },

            function (callack) {

                Note.update({ _id : noteId }, {$set : {title : newTitle}} ,{upsert: true}, function(err) {
                    if ( err )
                        console.log (err);

                });

            }
        ],

        function (err, validNote) {
            if (err) {
                if(validNote != null) res.send(validNote);
                else console.log(err);
            }
            else res.send(validNote);
        });*/
};

/////////////////////////////////////////////////////////////////////////////////////

var addFolder = function(req ,res) { ///// 트리뷰에 추가하는 작업 필요

    var userToken = req.body.userToken;
    var userCategory = req.body.userCategory;
    var folderTitle = req.body.folderTitle;
    var folderParent = req.body.folderParent;

    async.waterfall(
        [
            function (callback)
            {
                User.findOne({ token: userToken }, function( err, validUser) {
                    if (err)
                        console.log(err);

                    if (validUser === null) callback(true, false);
                    else callback(null);
                });
            },

            function (callback) {

                User.update({token: userToken}, {
                    $push: {
                        category: {
                            name: folderTitle,
                            type: 'folder',
                            parent: folderParent
                        }
                    }
                }, {upsert: true}, function (err, user) {
                    if (err)
                        callback(err);
                    callback(null);
                });
            },

            function (callback) {
                User.findOne({token: userToken}, function (err, updatedUser) {
                    if (err)
                        callback(err);
                    callback(null, updatedUser);
                });
            }
        ],

        function (err,updatedUser) {
            if (err) {
                if(savedNote == false) res.send('Unregistered User');
                else console.log(err);
            }
            else res.send(updateTree(userCategory, updatedUser.category));
        });
};



var testNote = function(req, res) {

    console.log(req.body.title);

    var l;
    User.findOne({ username: req.body.title},function(err,loginuser){
        if(err)
            console.err(err);

        console.log(loginuser);
    });
};


var addDir = function(req, res) {

    user.category.push({

    });
};


