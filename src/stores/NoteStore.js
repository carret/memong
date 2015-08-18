var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Constants = require('../constants/Constants');

var _ = require('underscore');
var sui = require('simple-unique-id');


//Note Data
var selectNote = {};

//Memo Data
var memos = [];
var globalEditMemo = {
    key: sui.generate("globalEditMemo"),
    title: null,
    text: "",
    mtype: Constants.MemoType.GLOBAL_EDIT_MEMO,
    date: null
};



//Private Function
//비공개 함수 영역입니다. 데이터를 수정합니다.

//서버로부터 불러온 초기 메모 데이터 설정
function initMemo(_memos) {
    _.each(_memos, function(memo) {
        memo.key = sui.generate(memo.text + (new Date()).toString());
    });
    memos = memos.concat(_memos);
    memos.push(_.extend({}, globalEditMemo));
}

function initNote(_selectNote) {
    selectNote = _selectNote;
}

function addMemo(_targetEditMemo, _context) {
    var index = _indexOf(memos, _targetEditMemo.key, "key");
    var newMemo = _.extend({}, {
        text: _context
    });
    var _newMemos = _parseMemo(newMemo);
    var len = _newMemos.length;

    for (var idx=0; idx<len; idx++) {
        memos.splice(index+idx, 0, _newMemos[idx]);
    }
}

function addNewMemo(_targetEditMemo, _context) {
    var index = _indexOf(memos, _targetEditMemo.key, "key");
    var newMemo = _.extend({}, {
        text: _context
    });
    var _newMemos = _parseMemo(newMemo);
    var len = _newMemos.length;

    for (var idx=0; idx<len; idx++) {
        memos.splice(index+idx+1, 0, _newMemos[idx]);
    }
}

function deleteMemo(_targetMemo) {
    var index = _indexOf(memos, _targetMemo.key, "key");
    memos.splice(index, 1);
}

function startEditMemo(_targetCompleteMemo) {
    var index = _indexOf(memos, _targetCompleteMemo.key, "key");
    _targetCompleteMemo.mtype = Constants.MemoType.EDIT_MEMO;
    console.log(_targetCompleteMemo);
    memos[index] = _.extend({}, memos[index], _targetCompleteMemo);
}

function endEditMemo(_targetEditMemo) {
    var index = _indexOf(memos, _targetEditMemo.key, "key");
    var _newMemos = _parseMemo(_targetEditMemo);
    var len = _newMemos.length;

    for (var idx=0; idx<len-1; idx++) {
        memos.splice(index+idx, 0, _newMemos[idx]);
    }

    memos[index + len - 1] = _.extend({}, memos[index + len - 1], _newMemos[len - 1]);
}




//Helper Function
//도우미 함수입니다.
// _indexOf: 메모의 위치를 찾습니다.
// _parseMemo: 메모의 내용을 입력받아 저장 가능한 메모로 반환합니다.
function _indexOf(arr, searchId, property) {
    for(var i = 0, len = arr.length; i < len; i++) {
        if (arr[i][property] === searchId) return i;
    }
    return -1;
}

function _parseMemo(_unParsedMemo) {
    var resultMemos = new Array();
    var protoMemo = {
        key: null,
        title: null,
        text: "",
        mtype: Constants.MemoType.NONE_MEMO,
        date: null
    };

    var regEx = /^[^#\s]?(#)[ \t].+/gm;
    var _arr, result = new Array();
    while ((_arr = regEx.exec(_unParsedMemo.text)) !== null) {
        result.push({
            _title: _arr[0],
            _index: _arr.index
        });
    }
    var len = result.length;

    if (len == 0) {
        var memo = _.extend(protoMemo, {
            title: "(No Title)",
            mtype: Constants.MemoType.NONE_MEMO,
            text: _unParsedMemo.text,
            date: new Date()
        });
        resultMemos.push(memo);
    }
    else {
        var index = 0;
        var text;
        for (var idx=0; idx<len; idx++) {
            if (idx == len-1) {
                text = (_unParsedMemo.text).slice(index, (_unParsedMemo.text).length);
            }
            else {
                text = (_unParsedMemo.text).slice(index, result[idx + 1]._index);
                index = result[idx+1]._index;
            }

            var _memo = _.extend(protoMemo, {
                title: (result[idx]._title).slice(2, (result[idx]._title).length),
                text: text,
                mtype: Constants.MemoType.COMPLETE_MEMO,
                date: new Date()
            });
            resultMemos.push(_memo);
        }
    }

    if (resultMemos.length == 0) {
        throw Error("Fatal Error: 잘못된 메모입니다. 다시 코딩하세요. 이 오류는 나와서는 안됩니다.");
    }
    else {
        for (var idx=0; idx<resultMemos.length; idx++) {
            resultMemos[idx] = _.extend({}, resultMemos[idx], {
                key: sui.generate(resultMemos[idx].text + resultMemos[idx].date.toString())
            });
        }
    }
    return resultMemos;
}





//Public Function
//공개 함수 영역입니다. 데이터를 반환합니다.
var NoteStore = _.extend({}, EventEmitter.prototype, {
    getMemo: function() {
        return memos;
    },

    getNoteID: function() {
        return selectNote.idAttribute;
    },

    getNoteTitle: function() {
        return selectNote.title;
    },

    emitChange: function() {
        this.emit('change'); //데이터가 변경됬을 때, 이벤트를 발생합니다.
    },

    emitAutoSaveRequest: function() {
        this.emit('auto-save-request');
    },

    emitAutoSaveReceive: function() {
        this.emit('auto-save-receive');
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },

    addAutoSaveRequestListener: function(callback) {
        this.on('auto-save-request', callback);
    },

    removeAutoSaveRequestListener: function(callback) {
        this.removeListener('auto-save-request', callback);
    },

    addAutoSaveReceiveListener: function(callback) {
        this.on('auto-save-receive', callback);
    },

    removeAutoSaveReceiveListener: function(callback) {
        this.removeListener('auto-save-receive', callback);
    }
});


//Regist Callback Function
//디스패처에 Store의 콜백 함수를 등록합니다.
AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
        case Constants.NoteActionTypes.RECEIVE_NOTE:
            initNote(action.selectNote);
            console.log("initNote");
            break;

        case Constants.MemoActionTypes.RECEIVE_MEMO:
            initMemo(action.memos);
            console.log("initMemo");
            break;

        case Constants.AutoSaveActionTypes.RECEIVE_SAVE:
            NoteStore.emitAutoSaveReceive();
            break;

        case Constants.MemoActionTypes.ADD_MEMO:
            addMemo(action.targetEditMemo, action.context);
            NoteStore.emitAutoSaveRequest();
            break;

        case Constants.MemoActionTypes.ADD_NEW_MEMO:
            addNewMemo(action.targetEditMemo, action.context);
            NoteStore.emitAutoSaveReceive();
            break;

        case Constants.MemoActionTypes.DELETE_MEMO:
            deleteMemo(action.targetCompleteMemo);
            NoteStore.emitAutoSaveRequest();
            break;

        case Constants.MemoActionTypes.START_EDIT_MEMO:
            startEditMemo(action.targetCompleteMemo);
            break;

        case Constants.MemoActionTypes.END_EDIT_MEMO:
            endEditMemo(action.targetEditMemo);
            NoteStore.emitAutoSaveRequest();
            break;

        default:
            return true;
    }

    if (action.actionType != Constants.MemoActionTypes.RECEIVE_SAVE) {
        NoteStore.emitChange();
    }

    return true;
});


module.exports = NoteStore;