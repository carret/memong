var keyMirror = require('react/lib/keyMirror');

var APIRoot = "/api";

module.exports = {
    API: {
        LOGIN_FACEBOOK: APIRoot + "/login/facebook",
        LOGIN_GOOGLE: APIRoot + "/login/google",
        LOGOUT: APIRoot + "/logout",
        GET_NOTE_WITH_MEMO: APIRoot + "/getNoteWithMemo",
        GET_DIRECTORY: APIRoot + "/getDirectory",
        GET_HASH_TABLE: APIRoot + "/getHashTable",
        POST_NOTE_WITH_MEMO: APIRoot + "/postNoteWithMemo",
        POST_DIRECTORY: APIRoot + "/postDirectory",
        POST_ROAD_DIRECTORY: APIRoot + "/loadDirectory"
        // 나머지...
    },

    DirectoryAPI: {
        LOGIN_GOOGLE: APIRoot + "/login/google",
        LOGOUT: APIRoot + "/logout",
        GET_NOTE_WITH_MEMO: APIRoot + "/getNoteWithMemo",
        GET_DIRECTORY: APIRoot + "/getDirectory",
        GET_HASH_TABLE: APIRoot + "/getHashTable",
        POST_NOTE_WITH_MEMO: APIRoot + "/postNoteWithMemo",
        POST_DIRECTORY: APIRoot + "/postDirectory",
    },
    // ActionTypes

    AccountActionTypes : keyMirror({
        REQUEST_ACCOUNT : null
    }),

    NoteActionTypes: keyMirror({
        REQUEST_NOTE_WITH_MEMO: null,
        RECEIVE_NOTE: null
    }),

    AutoSaveActionTypes: keyMirror({
        REQUEST_SAVE: null,
        RECEIVE_SAVE: null
    }),

    MemoActionTypes: keyMirror({
        RECEIVE_MEMO: null,
        ADD_MEMO: null,
        ADD_MEMO_IN_EDIT_MEMO: null,
        ADD_NEW_MEMO: null,
        DELETE_MEMO: null,
        START_EDIT_MEMO: null,
        START_EDIT_MEMO_FROM_MEMO_VIEWER: null,
        END_EDIT_MEMO_AND_START_NEXT_EDIT_MEMO: null,
        END_EDIT_MEMO_AND_START_PREVIOUS_EDIT_MEMO: null,
        END_EDIT_MEMO: null
    }),

    DirectoryAction : keyMirror({
        RECEIVE_TREE: null,
        MOVE_TREE: null,

        ADD_NOTE: null,
        RENAME_NOTE: null,
        DELETE_NOTE: null,

        DELETE_FOLDER: null,
        ADD_FOLDER: null,
        RENAME_FOLDER: null,

        SELECT_NOTE: null
    }),

    DirectoryAPIType : keyMirror({
        ADD_NOTE: 'addNote',
        RENAME_NOTE: 'renameNote',
        DELETE_NOTE: 'deleteNote',

        ADD_FOLDER: 'addFolder',
        DELETE_FOLDER: 'deleteFolder',
        CHANGE_TREE: 'updateTree' /* Folder Event + Move Event */
    }),

    SearchActionTypes: keyMirror({
        RECEIVE_HASH_TABLE: null
        // 나머지...
    }),


    //Object Types
    MemoType: keyMirror({
        COMPLETE_MEMO: null,
        EDIT_MEMO: null,
        NONE_MEMO: null,
        GLOBAL_EDIT_MEMO: null
    }),

    NodeType: keyMirror({
        NOTE: null,
        FOLDER: null,
        NEED_RENAME_NODE: null
    }),

    DirectoryItemType: keyMirror({
        NOTE: null,
        FOLDER: null
    }),

    AutoSaverStatusType: keyMirror({
        COMPLETE: null,
        SAVING: null
    }),

    KeyCode: {
        ENTER: 13,
        TAB: 9,
        ARROW_DOWN: 40,
        ARROW_UP: 38,
        BACKSPACE: 8
    }
};