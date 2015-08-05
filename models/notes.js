/**
 * Created by cho on 2015-08-05.
 */

var db = require('../db');

var noteSchema = new mongoose.Schema({

    /* _id �ڵ����� */
    date : {
        type : Date,
        required:true
    },
    nname : {
        type : String,
        required : true
    },

    memos : { // Ÿ�� �߰��ϱ�treeview.html
        /* unique id �ڵ����� */
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
