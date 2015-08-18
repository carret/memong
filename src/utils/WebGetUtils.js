var ServerReceiveActionCreator = require('../actions/ServerReceiveActionCreator');
var request = require('superagent');
var Constants = require('../constants/Constants');

var WebGetUtils = {
    getNoteWithMemos: function(_token, _noteID) {
        request
            .get(Constants.API.GET_NOTE_WITH_MEMO)
            .query({userToken: _token, noteId: _noteID})
            .set('API-Key', 'GET_NOTE_WITH_MEMO')
            .set('Accept', 'application/json')
            .end(function(err,res) {
                if (res.ok) {
                    console.log("받음");
                    console.log(res);

                    ServerReceiveActionCreator.receiveNote(res.body.note);
                    ServerReceiveActionCreator.receiveMemo(res.body.memos);
                }
                else {
                    // Show Notification
                }
            });
    },

    getDirectory: function() {
        request
            .get(Constants.API.GET_DIRECTORY)
            .set('API-Key', 'GET_DIRECTORY')
            .set('Accept', 'application/json')
            .end(function(err,res) {
                if (res.ok) {
                    ServerReceiveActionCreator.receiveDirectory(res.tree);
                }
                else {
                    // Show Notification
                }
            })
    },

    getHashTable: function() {
        request
            .get(Constants.API.GET_HASH_TABLE)
            .set('API-Key', 'GET_DIRECTORY')
            .set('Accept', 'application/json')
            .end(function(err,res) {
                if (res.ok) {
                    ServerReceiveActionCreator.receiveHashTable(res.hashTable);
                }
                else {
                    // Show Notification
                }
            })
    }
};

module.exports = WebGetUtils;