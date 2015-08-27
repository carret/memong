var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var ServerReceiveActionCreator = {
    receiveMemo: function (_memos) {
        AppDispatcher.handleServerAction({
            actionType: Constants.MemoActionTypes.RECEIVE_MEMO,
            memos: _memos
        });
    },

    receiveNote: function(_selectNote) {
        AppDispatcher.handleServerAction({
            actionType: Constants.NoteActionTypes.RECEIVE_NOTE,
            selectNote: _selectNote
        });
    },

    receiveTree: function(_tree, _selectNodeId) {
        AppDispatcher.handleServerAction({
            actionType: Constants.DirectoryAction.RECEIVE_TREE,
            tree: _tree,
            selectNodeId: _selectNodeId
        });
    },

    receiveIndexingTable: function(_indexingTable) {
        AppDispatcher.handleServerAction({
            actionType: Constants.SearchActionTypes.RECEIVE_INDEXING_TABLE,
            indexingTable: _indexingTable
        });
    },

    receiveAutoSaveComplete: function() {
        AppDispatcher.handleServerAction({
            actionType: Constants.AutoSaveActionTypes.RECEIVE_SAVE
        });
    }
};

module.exports = ServerReceiveActionCreator;