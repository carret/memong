/**
 * Created by Jaewook on 2015-08-01.
 */

var db = require('../../db');
var Note = db.model('Note');
var User = db.model('User');

var note = new Note();
var user = new User();


exports.doRoutes = function(app) {
    app.get('/note', getNote)
    app.post('/note/dic', addDir)
    app.post('/note/add', addNote)
};


var getNote = function(req, res) {

    // ���÷� �ٲ� -- '_id'�� ����  noteStore���� ������
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

    user.category.push({

    });
};


