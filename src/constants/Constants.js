var keyMirror = require('react/lib/keyMirror');

var APIRoot = "/api";

module.exports = {
    API: {
        LOGIN_FACEBOOK: APIRoot + "/login/facebook",
        LOGIN_GOOGLE: APIRoot + "/login/google",
        LOGOUT: APIRoot + "/logout",
        GET_NOTE_WITH_MEMO: APIRoot + "/getNoteWithMemo",
        GET_NOTE_WITH_MEMO_BY_SEARCH: APIRoot + "/getNoteWithMemoBySearch",
        GET_DIRECTORY: APIRoot + "/getDirectory",
        POST_NOTE_WITH_MEMO: APIRoot + "/postNoteWithMemo",
        POST_DIRECTORY: APIRoot + "/postDirectory",
        GET_LOAD_DIRECTORY: APIRoot + "/loadDirectory",
        GET_SEARCH: APIRoot + "/search"
    },

    DirectoryAPI: {
        LOGIN_GOOGLE: APIRoot + "/login/google",
        LOGOUT: APIRoot + "/logout",
        GET_NOTE_WITH_MEMO: APIRoot + "/getNoteWithMemo",
        GET_DIRECTORY: APIRoot + "/getDirectory",
        GET_HASH_TABLE: APIRoot + "/getHashTable",
        POST_NOTE_WITH_MEMO: APIRoot + "/postNoteWithMemo",
        POST_DIRECTORY: APIRoot + "/postDirectory"
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
        ADD_NOTE: null,
        RENAME_NOTE: null,
        DELETE_NOTE: null,

        ADD_FOLDER: null,
        DELETE_FOLDER: null,
        CHANGE_TREE: null /* Folder Event + Move Event */
    }),

    SearchActionTypes: keyMirror({
        RECEIVE_INDEXING_TABLE: null,
        SELECT_MEMO: null
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