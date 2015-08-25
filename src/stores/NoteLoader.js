var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var WebGetUtils = require('../utils/WebGetUtils');

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

var NoteLoader = {};


NoteLoader.dispatcherToken = AppDispatcher.register(function(payload) {
    var action = payload.action;
    console.log(action);

    switch(action.actionType) {
        case Constants.AutoSaveActionTypes.REQUEST_SAVE:
            console.log("NoteLoader REQUEST_SAVE");
            wait();
            break;

        case Constants.AutoSaveActionTypes.RECEIVE_SAVE:
            console.log("NoteLoader RECEIVE_SAVE");
            autoSaveComplete();
            break;

        case Constants.DirectoryAction.SELECT_NOTE:
            console.log("NoteLoader SELECT_NOTE");
            selectNote(action.nodeId);
            break;

        default:
            return true;
    }
    return true;
});

module.exports = NoteLoader;