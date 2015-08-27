var AppDispatcher =require('../dispatcher/AppDispatcher');
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

    getNoteWithMemosBySearch: function(_memoId) {
        request
            .get(Constants.API.GET_NOTE_WITH_MEMO_BY_SEARCH)
            .query({userToken: cookie.load('token'), memoId: _memoId})
            .set('API-Key', 'GET_NOTE_WITH_MEMO_BY_SEARCH')
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
            .get(Constants.API.GET_LOAD_DIRECTORY)
            .query({username: cookie.load('token') })
            .set('API-Key', Constants.API.GET_LOAD_DIRECTORY)
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

    getIndexingTable: function(user, word) {
        request
            .get(Constants.API.GET_SEARCH)
            .query({username: user, word: word})
            .set('Accept', 'application/json')
            .end(function(err,res) {
                if (res.ok) {
                    ServerReceiveActionCreator.receiveIndexingTable(res.body.memos);
                }
                else {
                    console.log('request error');
                    // Show Notification
                }
            })
    }
};

module.exports = WebGetUtils;