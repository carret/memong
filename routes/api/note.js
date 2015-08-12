/**
 * Created by Jaewook on 2015-08-01.
 */

var db = require('../../db');
var Note = db.model('Note');

var note = new Note();

exports.doRoutes = function(app) {
    app.get('/note', getNote)
    app.post('/note/add', addNote)
    app.post('/dic/add', addDir)
};

var getNote = function(req, res) {

    // '_id'를 통해  noteStore에서 가져옴
};

var addNote = function(req ,res) {

    note.name = 'child';

    note.save(function(err, note) {
        if ( err )
            console.log (err)
        res.json(201, note);
    })
};

var addDir = function(req, res) {




};
