var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var WebGetUtils = require('../utils/WebGetUtils');


var DirectoryActionCreator = {
    requestDirectory: function() {
        AppDispatcher.handleClientAction({
            actionType: Constants.NoteActionTypes.REQUEST_NOTE
        });
        WebGetUtils.getDirectory();
    },

    selectNote: function(_noteId) {
        AppDispatcher.handleClientAction({
            actionType: COnstnat.DirectotyActionTypes.SELECT_NOE,
        });
        WebGetUtils.getNoteWithMemos(c, _noteId)
    }
};

module.exports = DirectoryActionCreator;