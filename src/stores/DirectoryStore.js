var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Constants = require('../constants/Constants');

var _ = require('underscore');


var tree = {};

function init(_tree) {
    tree = _tree;
}

function addItem(_targetActiveItem, _name, _itemType) {
    var parent = (_targetActiveItem.parent == null) ? tree : _targetActiveItem;
    parent.children.push({
        module: _name,
        parent: parent.module,
        type: _itemType
    });
}





function _findItem(_tree, searchID, property) {
    var resultNode = (function resque(arr, i) {
        if (arr[property] == searchID) {
            return _tree[i];
        }
        var children = arr.children;
        if (children == undefined) return ;
        for (var idx=0, len=children.length; idx<len; idx++) {
            resque(children, idx);
        }
    })([_tree], 0);

    return resultNode;
}





var DirectoryStore = _.extend({}, EventEmitter.prototype, {
    getDirectoryTree: function() {
        return tree;
    },

    emitChange: function() {
        this.emit('change');
    },

    addChangeListener: function() {
        this.on('change', callback);
    },

    removeChangeListener: function() {
        this.removeListener('change', callback);
    }
});



AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
        case Constants.DirectoryActionTypes.RECEIVE_DIRECTORY:
            init(action.tree);
            break;

        case Constants.DirectoryActionTypes.CHANGE_DIRECTORY:
            init(action.newTree);
            break;

        case Constants.DirectoryActionTypes.ADD_ITEM:
            addItem(action.targetActiveItem, action.name, action.itemType);
            break;

        default:
            return true;
    }

    DirectoryStore.emitChange();

    return true;
});


module.exports = DirectoryStore;