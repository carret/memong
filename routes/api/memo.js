/**
 * Created by Jaewook on 2015-08-01.
 */

var mongoose = require('../../db');
var Note = mongoose.model('noteSchema');

exports.doRoutes = function(app) {
    app.get('/memo', getMemo);
    app.post('/memo/add', addMemo);
}

var getMemo = function(req, res) {


};

var addMemo = function(req ,res) {

};