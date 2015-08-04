var AppDispatcher = require('../dispatcher/AppDispatcher');
var MemoActionConstants = require('../constants/MemoActionConstants');

var MemoActions = {
    initMemo: function(_memos) {
        AppDispatcher.handleClientAction({
            actionType: MemoActionConstants.INIT_MEMO,
            memos: _memos
        });
    },

    addMemo: function(_targetEditMemo, _context) {
        AppDispatcher.handleClientAction({
            actionType: MemoActionConstants.ADD_MEMO,
            targetEditMemo: _targetEditMemo,
            context: _context
        });
    },

    deleteMemo: function(_targetCompleteMemo) {
        AppDispatcher.handleClientAction({
            actionType: MemoActionConstants.DELETE_MEMO,
            targetCompleteMemo: _targetCompleteMemo
        });
    },

    startEditMemo: function(_targetCompleteMemo) {
        AppDispatcher.handleClientAction({
            actionType: MemoActionConstants.START_EDIT_MEMO,
            targetCompleteMemo: _targetCompleteMemo
        });
    },

    completeEditMemo: function(_targetEditMemo) {
        AppDispatcher.handleClientAction({
            actionType: MemoActionConstants.END_EDIT_MEMO,
            targetEditMemo: _targetEditMemo
        });
    }
};

module.exports = MemoActions;