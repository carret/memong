var Note = {
    date: {
        type: Date,
        required: true,
        default: Date.now
    },

    title: {
        type: String,
        required: true
    },

    memos:
        [
            {
                date: {
                    type: Date,
                    required: true,
                    default: Date.now
                },
                title: {
                    type: String
                },
                text: {
                    type: String,
                    required: true
                },
                mtype : {
                    type : String
                }
            }
        ]
};
module.exports = Note;
