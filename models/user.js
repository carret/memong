/**
 * Created by cho on 2015-08-05.
 */

var User = {

    token : {
        type : Object,
        unique : true,
        required : true
    },
    username : {
        type : String,
        required:true
    },

    category : [
        {
            /* file && note categories */
            name: {
                type: String,
                required: true
            }, /* dir name - user defined
         note - unique id */
            type: {
                /*  type ::  dir / note */
                type: String,
                required: true
            },
            parent: {
                type: String /* null -- Root */
            }
        }
        ]
};

module.exports = User;
