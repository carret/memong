var AppDispatcher = require('../dispatcher/AppDispatcher');
var WebPostUtils = require('../utils/WebPostUtils');
var Constants = require('../constants/Constants');


var DirectoryServerAction = {

    successTreeUpdate: function(_tree) {
        AppDispatcher.handleClientAction({
            actionType: Constants.DirectoryServerAction.UPDATE_TREE,
            tree: _tree
        });
    }
};

module.exports = DirectoryServerAction;