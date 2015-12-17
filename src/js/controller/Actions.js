import keyMirror from 'keymirror';

const Actions = {
    MemoActions: keyMirror({
        'ADD_MEMO': null,
        'DELETE_MEMO': null
    }),

    NoteActions: keyMirror({
        'ADD_NOTE': null,
        'DELETE_NOTE': null
    }),

    TestActions: keyMirror({
        'SUBMIT_TEXT': null
    })
};

export default Actions;