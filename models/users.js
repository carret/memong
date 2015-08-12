/**
 * Created by cho on 2015-08-05.
 */

var db = require('../db');

var userSchema = new mongoose.Schema({

    _id : {
        type : String,
        unique : true,
        required : true
    },
    username : {
        type : String,
        required:true
    },

    usercategory : { /* file && note categories */

        cname : {
            type : String,
            required : true
        }, /* dir name - user defined
             note - unique id */
        type : { /*  type ::  dir / note */
            type : String,
            required : true
        },
        parent : {
            type : String /* null -- Root */
        }
    }
}, {collection : 'Users'});

module.exports = userSchema;
