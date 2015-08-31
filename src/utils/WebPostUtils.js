var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var request = require('superagent');
var WebGetUtils = require('./WebGetUtils');
var ServerReceiveActionCreator = require('../actions/ServerReceiveActionCreator');
var cookie = require('react-cookie');

var WebPostUtils = {
    postNoteWithMemo: function(_noteId, _memos) {
        var memos = new Array();
        for (var idx=0,len=_memos.length; idx<len-1; idx++) {
                if (_memos[idx].mtype == Constants.MemoType.EDIT_MEMO) {
                    _memos[idx].mtype = Constants.MemoType.COMPLETE_MEMO;
                }
            memos.push(_memos[idx]);
        }

        if (_memos.length == 1) {
            ServerReceiveActionCreator.receiveAutoSaveComplete();
            return;
        }

        request
            .post(Constants.API.POST_NOTE_WITH_MEMO)
            .send({noteId: _noteId, memos: memos})
            .set('API-Key', 'POST_NOTE_WITH_MEMO')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                if (res.ok) {
                    ServerReceiveActionCreator.receiveAutoSaveComplete();
                }
                else {
                    console.log('request error');
                    // Show Notification
                }
            });

    },

    postDirectory: function(_tree , _type, _data, _data2) {
        var _action = {
            type : _type,
            tree : _tree,
            data : _data,
            data2 : _data2
            };


        request
            .post(Constants.API.POST_DIRECTORY)
            .send({
                token: cookie.load('token'),
                action : _action
            })
            .set('API-Key', Constants.API.POST_DIRECTORY)
            .set('Accept', 'application/json')
            .end(function(err,res) {
                if (res.ok){
                    ServerReceiveActionCreator.receiveTree(_tree);
                    if (res.body != null) {
                        if(res.body.hasOwnProperty('noteId')) {
                            WebGetUtils.getNoteWithMemos(cookie.load('token'), null);
                        }
                    }
                }
                else {
                    console.log('request error');
                }
            });
    }
};

module.exports = WebPostUtils;