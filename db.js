var mongoose = require('mongoose');
var noteSchema = require('./models/note');
var userSchema = require('./models/user');

mongoose.connect('mongodb://localhost:27017/memong');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
    console.log("mongo db connection OK.");
});

mongoose.model('Note', noteSchema, 'Notes');
mongoose.model('User', userSchema, 'Users');

module.exports = mongoose;