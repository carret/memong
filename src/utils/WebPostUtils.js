var Constants = require('../constants/Constants');
var request = require('superagent');

var ServerReceiveActionCreator = require('../actions/ServerReceiveActionCreator');
var DirectoryActionCreator = require('../actions/DirectoryActionCreator');


var WebPostUtils = {
    postNoteWithMemo: function(_noteID, _memos) {
        var _escapedMemos = (function() {

        })(_memos);

        request
            .post(Constants.API.POST_NOTE_WITH_MEMO)
            .send({noteID: _noteID.escape(), memos: _escapedMemos})
            .set('API-Key', 'POST_NOTE_WITH_MEMO')
            .set('Accept', 'application/json')
            .end(function(err,res) {
                if (res.ok) {
                    ServerReceiveActionCreator.receiveMemoSaveComplete();
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