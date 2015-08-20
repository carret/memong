/**
 * Created by cho on 2015-08-05.
 */

var Node = {

    module : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required:true
    },

    servicetype :  {
        type : String,
        required : true
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
