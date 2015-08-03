var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionConstants = require('../constants/ActionConstants');

var AppActions = {
    initMemo: function(_memos) {
        AppDispatcher.handleClientAction({
            actionType: ActionConstants.INIT_MEMO,
            memos: _memos
        });
    },

    addMemo: function(_targetEditMemo, _context) {
        AppDispatcher.handleClientAction({
            actionType: ActionConstants.ADD_MEMO,
            targetEditMemo: _targetEditMemo,
            context: _context
        });
    },

    startEditMemo: function(_targetCompleteMemo) {
        AppDispatcher.handleClientAction({
            actionType: ActionConstants.START_EDIT_MEMO,
            targetCompleteMemo: _targetCompleteMemo
        });
    },

    completeEditMemo: function(_targetEditMemo) {
        AppDispatcher.handleClientAction({
            actionType: ActionConstants.END_EDIT_MEMO,
            targetEditMemo: _targetEditMemo
        });
    }
};

module.exports = AppActions;