var Constants = require('../constants/Constants');
var DirectoryServerAction = require('../actions/DirectoryServerAction');
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
    loadDirectory: function(_username, callback) {

        request
            .post(Constants.API.POST_ROAD_DIRECTORY)
            .send({username: _username })
            .set('API-Key', Constants.API.POST_ROAD_DIRECTORY)
            .set('Accept', 'application/json')
            .end(function(err,res) {
                if (res.ok) callback(res.body);
                else callback('error');
            });
    },

    postDirectory: function(_username, _tree , _type, _data, _data2) {

        var _action = {
            type : _type,
            tree : _tree,
            data : _data,
            data2 : _data2
            } ;

        console.log(_action);
        request
            .post(Constants.API.POST_DIRECTORY)
            .send({
                username: _username,
                action : _action
            })
            .set('API-Key', Constants.API.POST_DIRECTORY)
            .set('Accept', 'application/json')
            .end(function(err,res) {
                if (res.ok){
                    DirectoryServerAction.successTreeUpdate(_tree);
                    if(res.body.noteId != null) console.log(res.body.noteId);
                    // 노트 불러오기
                }
                else console.log('error');
            });
    }
};

module.exports = WebPostUtils;