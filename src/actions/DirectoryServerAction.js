var AppDispatcher = require('../dispatcher/AppDispatcher');
var WebPostUtils = require('../utils/WebPostUtils');
var Constants = require('../constants/Constants');

var _username = 'true';

var DirectoryServerAction = {

    successNoteUpdate: function(_tree) {
        AppDispatcher.handleClientAction({
            actionType: Constants.DirectoryServerAction.UPDATE_NOTE,
            tree: _tree
        });
    },

    successTreeUpdate: function(_tree) { /* Folder + move Update*/
        AppDispatcher.handleClientAction({
            actionType: Constants.DirectoryServerAction.UPDATE_TREE,
            tree: _tree
        });
    }
};

module.exports = DirectoryAction;