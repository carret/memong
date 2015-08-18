var Constants = require('../constants/Constants');
var request = require('superagent');

var ServerReceiveActionCreator = require('../actions/ServerReceiveActionCreator');
var DirectoryActionCreator = require('../actions/DirectoryActionCreator');


var WebPostUtils = {
    postNoteWithMemo: function(_noteId, _memos) {
        var memos = new Array();
        for (var idx=0,len=_memos.length; idx<len; idx++) {
            if (_memos[idx].mtype != Constants.MemoType.GLOBAL_EDIT_MEMO) {
                memos.push(_memos[idx]);
            }
        }

        request
            .post(Constants.API.POST_NOTE_WITH_MEMO)
            .send({noteId: _noteId, memos: memos})
            .set('API-Key', 'POST_NOTE_WITH_MEMO')
            .set('Accept', 'application/json')
            .end(function(err,res) {
                if (res.ok) {
                    ServerReceiveActionCreator.receiveAutoSaveComplete();
                    console.log("receiveAutoSave");
                }
                else {
                    // Show Notification
                }
            });
    },

    postDirectory: function(_tree) {
        var _escapedTree = (function() {

        })(_tree);

        request
            .post(Constants.API.POST_DIRECTORY)
            .send({tree: _escapedTree})
            .set('API-Key', 'POST_DIRECTORY')
            .set('Accept', 'application/json')
            .end(function(err,res) {
                if (res.ok) {
                    DirectoryActionCreator.requestDirectory();
                }
                else {
                    // Show Notification
                }
            });
    }
};

module.exports = WebPostUtils;