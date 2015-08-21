
var request = require('superagent');


var WebPostUtils = {

    /*
    postNoteWithMemo: function(_noteId, _memos) {
        var memos = new Array();
        for (var idx=0,len=_memos.length; idx<len; idx++) {
            if (_memos[idx].mtype != Constants.MemoType.GLOBAL_EDIT_MEMO) {
                if (_memos[idx].mtype == Constants.MemoType.EDIT_MEMO) {
                    _memos[idx].mtype = Constants.MemoType.COMPLETE_MEMO;
                }
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
    },*/

    postDirectory: function(_username) {

       /* var _escapedTree = (function() {

        })(_tree); */

        request
            .post('/note/load')
            .send({username: _username})
            .set('API-Key', '/note/load')
            .set('Accept', 'application/json')
            .end(function(err,res) {
                if (res.ok) {
                    console.log(res.body);
                }
                else {

                }
            });
    }
};

module.exports = WebPostUtils;