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
                },
                main: {
                    type: String,
                    required: true
                },
                tag: {
                    type: Array
                }

                // Ÿ�� �߰�
            }
        ]
};
module.exports = Note;
