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
    name: {
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
                header: {
                    type: String,
                    default: 'test h'
                },
                main: {
                    type: String,
                    required: true,
                    default: 'test m'
                },
                tag: {
                    type: Array
                }
            }
        ]
};
module.exports = Note;
