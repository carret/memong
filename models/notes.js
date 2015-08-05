/**
 * Created by cho on 2015-08-05.
 */

var db = require('../db');

var noteSchema = new mongoose.Schema({

    /* _id 자동생성 */
    date : {
        type : Date,
        required:true
    },
    nname : {
        type : String,
        required : true
    },

    memos : { // 타입 추가하기treeview.html
        /* unique id 자동생성 */
        date : {
            type : Date,
            required:true
        },
        header : {
            type : String,
            required:true
        },
        main : {
            type : String,
            required:true
        },
        tags : {
            tag : {
                type : Array,
                required:true
            }
        }
    }

}, {collection : 'Notes'});

module.exports = noteSchema;
