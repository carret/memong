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
    value: "",
    type: Constants.MemoType.GLOBAL_EDIT_MEMO,
    date: null
};



//Private Function
//비공개 함수 영역입니다. 데이터를 수정합니다.

//서버로부터 불러온 초기 메모 데이터 설정
function initMemo(_memos) {
    _.each(_memos, function(memo) {
        memo.key = sui.generate(memo.value + memo.date.toString());
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
        value: _context
    });
    var _newMemos = _parseMemo(newMemo);
    var len = _newMemos.length;

    for (var idx=0; idx<len; idx++) {
        memos.splice(index+idx, 0, _newMemos[idx]);
    }
}

function deleteMemo(_targetMemo) {
    var index = _indexOf(memos, _targetMemo.key, "key");
    memos.splice(index, 1);
}

function startEditMemo(_targetCompleteMemo) {
    var index = _indexOf(memos, _targetCompleteMemo.key, "key");
    _targetCompleteMemo.type = Constants.MemoType.EDIT_MEMO;
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
        value: "",
        type: Constants.MemoType.NONE_MEMO,
        date: null
    };

    var regEx = /^[^#\s]?(#)[ \t].+/gm;
    var _arr, result = new Array();
    while ((_arr = regEx.exec(_unParsedMemo.value)) !== null) {
        result.push({
            _title: _arr[0],
            _index: _arr.index
        });
    }
    var len = result.length;

    if (len == 0) {
        var memo = _.extend(protoMemo, {
            title: "(No Title)",
            type: Constants.MemoType.NONE_MEMO,
            value: _unParsedMemo.value,
            date: new Date()
        });
        resultMemos.push(memo);
    }
    else {
        var index = 0;
        var value;
        for (var idx=0; idx<len; idx++) {
            if (idx == len-1) {
                value = (_unParsedMemo.value).slice(index, (_unParsedMemo.value).length);
            }
            else {
                value = (_unParsedMemo.value).slice(index, result[idx + 1]._index);
                index = result[idx+1]._index;
            }

            var _memo = _.extend(protoMemo, {
                title: (result[idx]._title).slice(2, (result[idx]._title).length),
                value: value,
                type: Constants.MemoType.COMPLETE_MEMO,
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
                key: sui.generate(resultMemos[idx].value + resultMemos[idx].date.toString())
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
        return selectNote.id;
    },

    getNoteTitle: function() {
        return selectNote.title;
    },

    emitChange: function() {
        this.emit('change'); //데이터가 변경됬을 때, 이벤트를 발생합니다.
    },

    emitMemoChange: function() {
        this.emit('memo-change');
    },

    emitMemoSaveComplete: function() {
        this.emit('memo-complete');
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },

    addMemoChangeListener: function(callback) {
        this.on('memo-change', callback);
    },

    removeMemoChangeListener: function(callback) {
        this.removeListener('memo-change', callback);
    },

    addMemoSaveCompleteListener: function(callback) {
        this.on('memo-complete', callback);
    },

    removeMemoSaveCompleteListener: function(callback) {
        this.removeListener('memo-complete', callback);
    }
});


//Regist Callback Function
//디스패처에 Store의 콜백 함수를 등록합니다.
AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
        case Constants.NoteActionTypes.RECEIVE_NOTE:
            initNote(action.selectNote);
            break;

        case Constants.MemoActionTypes.RECEIVE_MEMO:
            initMemo(action.memos);
            break;

        case Constants.MemoActionTypes.RECEIVE_SAVE:
            NoteStore.emitMemoSaveComplete();
            break;

        case Constants.MemoActionTypes.ADD_MEMO:
            addMemo(action.targetEditMemo, action.context);
            NoteStore.emitMemoChange();
            break;

        case Constants.MemoActionTypes.DELETE_MEMO:
            deleteMemo(action.targetCompleteMemo);
            NoteStore.emitMemoChange();
            break;

        case Constants.MemoActionTypes.START_EDIT_MEMO:
            startEditMemo(action.targetCompleteMemo);
            NoteStore.emitMemoChange();
            break;

        case Constants.MemoActionTypes.END_EDIT_MEMO:
            endEditMemo(action.targetEditMemo);
            NoteStore.emitMemoChange();
            break;

        default:
            return true;
    }

    NoteStore.emitChange();

    return true;
});


module.exports = NoteStore;