var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var WebGetUtils = require('../utils/WebGetUtils');

var NoteStore = require('./NoteStore');

var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var cookie = require('react-cookie');


var needToWait = false;
var needToLoadNoteAndMemos = {
    isTrue: false,
    nodeId: null
};


function wait() {
    needToWait = true;
}

function autoSaveComplete() {
    needToWait = false;
    if (needToLoadNoteAndMemos.isTrue == true) {
        WebGetUtils.getNoteWithMemos(cookie.load('token'), needToLoadNoteAndMemos.nodeId);
        needToLoadNoteAndMemos.isTrue = false;
    }
}

function selectNote(_nodeId) {
    needToLoadNoteAndMemos.isTrue = true;
    needToLoadNoteAndMemos.nodeId = _nodeId;

    if (!needToWait && needToLoadNoteAndMemos.isTrue == true) {
        WebGetUtils.getNoteWithMemos(cookie.load('token'), needToLoadNoteAndMemos.nodeId);
        needToLoadNoteAndMemos.isTrue = false;
    }
}

var NoteLoader = _.extend({}, EventEmitter.prototype, {
    emitWait: function() {
        this.emit('wait');
    },

    emitAutoSaveComplete: function() {
        this.emit('auto-save-receive');
    },

    addWait: function(callback) {
        this.on('wait', callback);
    },

    removeWait: function(callback) {
        this.removeListener('wait', callback);
    },

    addAutoSaveComplete: function(callback) {
        this.on('auto-save-receive', callback);
    },

    removeAutoSaveComplete: function(callback) {
        this.removeListener('auto-save-receive', callback);
    }
});

NoteStore.addAutoSaveRequestListener(wait);


AppDispatcher.register(function(payload) {
    var action = payload.action;
    console.log(action);

    switch(action.actionType) {
        case Constants.AutoSaveActionTypes.RECEIVE_SAVE:
            console.log("NoteLoader RECEIVE_SAVE");
            autoSaveComplete();
            NoteLoader.emitAutoSaveComplete();
            break;

        case Constants.DirectoryAction.SELECT_NOTE:
            console.log("NoteLoader SELECT_NOTE");
            NoteLoader.emitWait();
            selectNote(action.nodeId);
            break;
    }
});

module.exports = NoteLoader;