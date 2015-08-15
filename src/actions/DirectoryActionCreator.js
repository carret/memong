var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var WebGetUtils = require('../utils/WebGetUtils');


var DirectoryActionCreator = {
    requestDirectory: function() {
        AppDispatcher.handleClientAction({
            actionType: Constants.NoteActionTypes.REQUEST_NOTE
        });
        WebGetUtils.getDirectory();
    }
};

module.exports = DirectoryActionCreator;