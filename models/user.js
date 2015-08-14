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

    selecNote: {

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
