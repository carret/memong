/**
 * Created by Jaewook on 2015-08-01.
 */

var Note = require('../../models/note')

exports.doRoutes = function(app) {
    app.get('/note', getNote)
    app.post('/note/add', addNote)
}

var getNote = function(req, res) {
    Note.find(function(err, notes) {
        if ( err )
            console.log(err)
        res.json(notes)
    })
}

var addNote = function(req ,res) {
    var note = new Note({
        name : req.body.name,
        body : req.body.body
    })
    note.save(function(err, note) {
        if ( err )
            console.log (err)
        res.json(201, note);
    })
}