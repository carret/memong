/**
 * Created by cho on 2015-08-05.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var User = {

    username : {
        type : String,
        required:true
    },

    selectNoteId: {
        type: Object
    },

    tree : {
        type : String,
        required : true
    },

    treeTable : [{

        id : {
            type : String,
            required : true
        },

        nid : {
            type : ObjectId
        }
    } ],

    hashtable :
    [
        {

        }
    ]
};

module.exports = User;
