import keyMirror from 'keymirror';

const Queries = {
    'MEMO': keyMirror({
        id: null,
        type: null,
        title: null,
        text: null,
        date: null
    }),

    'NOTE': keyMirror({
        id: null,
        title: null,
        date: null,
        memos: null
    }),

    'USER': keyMirror({
        id: null,
        userName: null,
        lastOpenedNote: null,
        noteDirectory: null,
        noteDirectoryTree: null,
        indexingTable: null
    })
};

export default Queries;