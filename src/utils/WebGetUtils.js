var ServerReceiveActionCreator = require('../actions/ServerReceiveActionCreator');
var request = require('superagent');
var Constants = require('../constants/Constants');
var cookie = require('react-cookie');

var WebGetUtils = {
    getNoteWithMemos: function(_token, _noteID) {
        request
            .get(Constants.API.GET_NOTE_WITH_MEMO)
            .query({userToken: _token, noteId: _noteID})
            .set('API-Key', 'GET_NOTE_WITH_MEMO')
            .set('Accept', 'application/json')
            .end(function(err,res) {
                if (res.ok) {
                    if (res.body.hasOwnProperty("note")) {
                        ServerReceiveActionCreator.receiveNote(res.body.note);
                        ServerReceiveActionCreator.receiveMemo(res.body.memos);
                    }
                    else {
                        throw new Error;
                    }
                }
                else {
                    // Show Notification
                }
            });
    },

    getDirectory: function(callback) {
        request
            .get(Constants.API.POST_ROAD_DIRECTORY)
            .query({username: cookie.load('token') })
            .set('API-Key', Constants.API.POST_ROAD_DIRECTORY)
            .set('Accept', 'application/json')
            .end(function(err,res) {
                if (res.ok) {
                    ServerReceiveActionCreator.receiveTree(res.body.tree);
                    callback(res.body);
                }
                else {
                    callback('error');
                }
            });
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