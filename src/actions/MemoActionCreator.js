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

    addMemoInEditMemo: function(_targetEdiMemo, _allContext) {
        AppDispatcher.handleClientAction({
            actionType: Constants.MemoActionTypes.ADD_MEMO_IN_EDIT_MEMO,
            targetEditMemo: _targetEdiMemo,
            allContext: _allContext
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

    startEditMemoFromMemoViewer: function(_targetCompleteMemo) {
        AppDispatcher.handleClientAction({
            actionType: Constants.MemoActionTypes.START_EDIT_MEMO_FROM_MEMO_VIEWER,
            targetCompleteMemo: _targetCompleteMemo
        });
    },

    endEditMemoAndStartNextEditMemo: function(_targetEditMemo) {
        AppDispatcher.handleClientAction({
            actionType: Constants.MemoActionTypes.END_EDIT_MEMO_AND_START_NEXT_EDIT_MEMO,
            targetEditMemo: _targetEditMemo
        });
    },

    endEditMemoAndStartPreviousEditMemo: function(_targetEditMemo) {
        AppDispatcher.handleClientAction({
            actionType: Constants.MemoActionTypes.END_EDIT_MEMO_AND_START_PREVIOUS_EDIT_MEMO,
            targetEditMemo: _targetEditMemo
        });
    },

    completeEditMemo: function(_targetEditMemo) {
        AppDispatcher.handleClientAction({
            actionType: Constants.MemoActionTypes.END_EDIT_MEMO,
            targetEditMemo: _targetEditMemo
        });
    },

    focusGlobalEdit: function() {
        AppDispatcher.handleClientAction({
            actionType: Constants.MemoActionTypes.FOCUS_GLOBAL_EDIT
        });
    }
};

module.exports = MemoActionCreator;