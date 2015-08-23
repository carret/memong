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

    category : [
        {
            /* file && note categories */
            name: {
                type: String,
                required: true
            },
            type: {
                /*  type ::  dir / note */
                type: String,
                required: true
            },
            nid:{
                type : ObjectId
            },
            parent: {
                type: String,
                required : true
            }
        }
    ],

    hashtable :
        [
            {

            }
        ]
};

module.exports = User;