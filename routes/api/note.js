var db = require('../../db');
var Note = db.model('Note');
var User = db.model('User');

var Constants = require('../../src/constants/Constants');

var note = new Note();
var user = new User();

exports.doRoutes = function(app) {
    app.get(Constants.API.GET_NOTE_WITH_MEMO , getNote)
    app.post('/note/dic', addDir)
    app.post('/note/add', addNote)
};

var getNote = function(req, res) {
    var noteID = replaceXss(req.query.noteID);

    /*
    Note.findOne({_id: noteID}, function(err, _Note) {

    })
    */
    if (noteID == null) {
        noteID = user.selectNote.id;
    }



    res.send('noteID: ' + noteID);
};

var addNote = function(req ,res) {

    user.

    note.name = 'child';

    note.save(function(err, note) {
        if ( err )
            console.log (err)
        res.json(201, note);
    })
};

var addDir = function(req, res) {

    user.category.push({

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