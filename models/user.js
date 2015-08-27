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


    hashtable : [
            {

            }
    ],


    tree : {
        type : String
    },

    treeTable : [{
        id : {
            type : String,
            required : true
        },

        nid : {
            type : ObjectId
        }
    }]
};

module.exports = User;