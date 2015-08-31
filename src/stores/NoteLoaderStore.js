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

var needToLoadNoteAndMemosBySearch = {
    isTrue: false,
    memoId: null
};


function wait() {
    needToWait = true;
}

function selectMemoInSearch(_memoId) {
    needToLoadNoteAndMemosBySearch.isTrue = true;
    needToLoadNoteAndMemosBySearch.memoId = _memoId;

    if (!needToWait && needToLoadNoteAndMemosBySearch.isTrue) {
        WebGetUtils.getNoteWithMemosBySearch(needToLoadNoteAndMemosBySearch.memoId);
        needToLoadNoteAndMemosBySearch.isTrue = false;
        NoteLoader.emitAutoSaveComplete();
    }
}

function autoSaveComplete() {
    needToWait = false;
    if (needToLoadNoteAndMemos.isTrue == true) {
        WebGetUtils.getNoteWithMemos(cookie.load('token'), needToLoadNoteAndMemos.nodeId);
        needToLoadNoteAndMemos.isTrue = false;
    }
    if (needToLoadNoteAndMemosBySearch.isTrue) {
        WebGetUtils.getNoteWithMemosBySearch(needToLoadNoteAndMemosBySearch.memoId);
        needToLoadNoteAndMemosBySearch.isTrue = false;
    }
}

function selectNote(_nodeId) {
    needToLoadNoteAndMemos.isTrue = true;
    needToLoadNoteAndMemos.nodeId = _nodeId;

    if (!needToWait && needToLoadNoteAndMemos.isTrue == true) {
        WebGetUtils.getNoteWithMemos(cookie.load('token'), needToLoadNoteAndMemos.nodeId);
        needToLoadNoteAndMemos.isTrue = false;
        NoteLoader.emitAutoSaveComplete();
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

    switch(action.actionType) {
        case Constants.AutoSaveActionTypes.RECEIVE_SAVE:
            autoSaveComplete();
            NoteLoader.emitAutoSaveComplete();
            break;

        case Constants.DirectoryAction.SELECT_NOTE:
            NoteLoader.emitWait();
            selectNote(action.nodeId);
            break;

        case Constants.SearchActionTypes.SELECT_MEMO:
            NoteLoader.emitWait();
            selectMemoInSearch(action.memoId);
            break;

    }
});

module.exports = NoteLoader;