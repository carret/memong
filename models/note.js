/**
 * Created by cho on 2015-08-05.
 */

var Note = {

    /* _id �ڵ����� */
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
