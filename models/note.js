/**
 * Created by Jaewook on 2015-08-01.
 */
var db = require('../db');
var Note = db.model('Note', {
    name : {
        type : String,
        required:true
    },
    body : {
        type:String,
        required:true
    },
    date : {
        type : Date,
        required : true,
        default : Date.now
    }
})
module.exports = Note
