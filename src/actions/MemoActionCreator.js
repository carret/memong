var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var WebGetUtils = require('../utils/WebGetUtils');
var WebPostUtils = require('../utils/WebPostUtils');

var MemoActionCreator = {
    addMemo: function(_targetEditMemo, _context) {
        AppDispatcher.handleClientAction({
            actionType: Constants.MemoActionTypes.ADD_MEMO,
            targetEditMemo: _targetEditMemo,
            context: _context
        });
    },

    addNewMemo: function(_targetEditMemo, _context) {
        AppDispatcher.handleClientAction({
            actionType: Constants.MemoActionTypes.ADD_NEW_MEMO,
            targetEditMemo: _targetEditMemo,
            context: _context
        });
    },

    deleteMemo: function(_targetCompleteMemo) {
        AppDispatcher.handleClientAction({
            actionType: Constants.MemoActionTypes.DELETE_MEMO,
            targetCompleteMemo: _targetCompleteMemo
        });
    },

    startEditMemo: function(_targetCompleteMemo) {
        AppDispatcher.handleClientAction({
            actionType: Constants.MemoActionTypes.START_EDIT_MEMO,
            targetCompleteMemo: _targetCompleteMemo
        });

    },

    completeEditMemo: function(_targetEditMemo) {
        AppDispatcher.handleClientAction({
            actionType: Constants.MemoActionTypes.END_EDIT_MEMO,
            targetEditMemo: _targetEditMemo
        });
    }
};

module.exports = MemoActionCreator;