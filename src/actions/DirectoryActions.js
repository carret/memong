var AppDispatcher = require('../dispatcher/AppDispatcher');
var DirectoryActionConstants = require('../constants/MemoActionConstants');
var WebPostUtils = require('../utils/WebPostUtils');
var Constants = require('../constants/Constants');

var _username = 'true';

var DirectoryAction = {

    addNote_updateDB: function(_tree , _type, _data) {
        AppDispatcher.handleClientAction({
            actionType: Constants.DirectoryAction.ADD_NOTE,
        });
        WebPostUtils.postDirectory(_username, _tree , _type, _data);
    },

    renameNote_updateDB: function(_tree, _type ,_nodeId) {
        AppDispatcher.handleClientAction({
            actionType: Constants.DirectoryAction.RENAME_NOTE,
        });
        WebPostUtils.postDirectory(_username, _tree, _type, _nodeId)
    },

    deleteNote_updateDB: function(_tree, _type ,_nodeId) {
        AppDispatcher.handleClientAction({
            actionType: Constants.DirectoryAction.DELETE_NOTE,
        });
        WebPostUtils.postDirectory(_username, _tree, _type, _nodeId);
    },

    addFolder_updateDB: function(_tree, _type) {
        AppDispatcher.handleClientAction({
            actionType: Constants.DirectoryAction.ADD_FOLDER,
        });
        WebPostUtils.postDirectory(_username, _tree, _type)
    },
    
    renameFolder_updateDB: function(_tree, _type) {
        AppDispatcher.handleClientAction({
            actionType: Constants.DirectoryAction.RENAME_FOLDER,
        });
        WebPostUtils.postDirectory(_username, _tree, _type)
    },
    
    deleteFolder_updateDB: function(_tree, _type) {
        AppDispatcher.handleClientAction({
            actionType: Constants.DirectoryAction.DELETE_FOLDER,
        });
        WebPostUtils.postDirectory(_username, _tree, _type)
    },
    

    moveNode_updateDB: function(_tree, _type) {
        AppDispatcher.handleClientAction({
            actionType: Constants.DirectoryAction.MOVE_TREE,
        });
        WebPostUtils.postDirectory(_username, _tree, _type)
    }
};

module.exports = DirectoryAction;