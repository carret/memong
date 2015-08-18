var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var WebGetUtils = require('../utils/WebGetUtils');
var WebPostUtils = require('../utils/WebPostUtils');


var AutoSaveActionCreator = {
    requestAutoSave: function(_selectNoteId, _memos) {
        AppDispatcher.handleAutoSaveAction({
            actionType: Constants.AutoSaveActionTypes.REQUEST_SAVE
        });
        console.log("requestAutoSave");
        WebPostUtils.postNoteWithMemo(_selectNoteId, _memos);
    }
};

module.exports = AutoSaveActionCreator;