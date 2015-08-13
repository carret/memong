var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var WebGetUtils = require('../utils/WebGetUtils');


var NoteActionCreator = {
    requestNoteWithMemo: function(_noteID) {
        AppDispatcher.handleClientAction({
            actionType: Constants.NoteActionTypes.REQUEST_NOTE
        });
        WebGetUtils.getNoteWithMemos(_noteID);
    }
};

module.exports = NoteActionCreator;