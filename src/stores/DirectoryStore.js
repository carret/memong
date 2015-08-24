var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Constants = require('../constants/Constants');

var _ = require('underscore');


var tree = {};

function reloadTree(_tree){
    tree = _tree;
}

//Public Function
var DirectoryStore = _.extend({}, EventEmitter.prototype, {
    getTree: function() {
        return tree;
    },

    emitChange: function() {
        this.emit('change'); //데이터가 변경됬을 때, 이벤트를 발생합니다.
    },

    addTreeChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeTreeChangeListener: function(callback) {
        this.removeListener('change', callback);
    }
});


AppDispatcher.register(function(payload) {
    var action = payload.action;

    if (action.actionType == Constants.DirectoryAction.RECEIVE_TREE){
        reloadTree(action.tree);
    }

    DirectoryStore.emitChange();

    return true;
});

module.exports = DirectoryStore;