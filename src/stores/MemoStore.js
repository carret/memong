var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MemoActionConstants = require('../constants/MemoActionConstants');
var MemoTypeConstants = require('../constants/MemoTypeConstants');
var _ = require('underscore');
var sui = require('simple-unique-id');


//Memo Data
var _memos = [];
var globalEditMemo = {
    id: sui.generate("globalEditMemo"),
    title: null,
    value: "",
    type: MemoTypeConstants.GLOBAL_EDIT_MEMO,
    date: null
};



//Private Function
//비공개 함수 영역입니다. 데이터를 수정합니다.

//서버로부터 불러온 초기 메모 데이터 설정
function initMemo(memos) {
    _memos = _memos.concat(memos);
    _memos.push(_.extend({}, globalEditMemo));
}

function addMemo(_targetEditMemo, _context) {
    var index = _indexOf(_memos, _targetEditMemo.id, "id");
    var newMemo = _.extend({}, {
        value: _context
    });
    var _newMemos = _parseMemo(newMemo);
    var len = _newMemos.length;

    for (var idx=0; idx<len; idx++) {
        _memos.splice(index+idx, 0, _newMemos[idx]);
    }
}

function deleteMemo(_targetMemo) {
    var index = _indexOf(_memos, _targetMemo.id, "id");
    _memos.splice(index, 1);
}

function startEditMemo(_targetCompleteMemo) {
    var index = _indexOf(_memos, _targetCompleteMemo.id, "id");
    _targetCompleteMemo.type = MemoTypeConstants.EDIT_MEMO;
    _memos[index] = _.extend({}, _memos[index], _targetCompleteMemo);
}

function endEditMemo(_targetEditMemo) {
    var index = _indexOf(_memos, _targetEditMemo.id, "id");
    var _newMemos = _parseMemo(_targetEditMemo);
    var len = _newMemos.length;

    for (var idx=0; idx<len-1; idx++) {
        _memos.splice(index+idx, 0, _newMemos[idx]);
    }

    _memos[index + len - 1] = _.extend({}, _memos[index + len - 1], _newMemos[len - 1]);
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

function _parseMemo(memo) {
    var resultMemos = new Array();
    var _proto_memo = {
        id: null,
        title: null,
        value: "",
        type: MemoTypeConstants.NONE_MEMO,
        date: null
    };

    var regEx = /^[^#\s]?(#)[ \t].+/gm;
    var _arr, result = new Array();
    while ((_arr = regEx.exec(memo.value)) !== null) {
        result.push({
            _title: _arr[0],
            _index: _arr.index
        });
    }
    var len = result.length;

    if (len == 0) {
        var _memo = _.extend(_proto_memo, {
            title: "(No Title)",
            type: MemoTypeConstants.NONE_MEMO,
            value: memo.value,
            date: new Date()
        });
        resultMemos.push(_memo);
    }
    else {
        var index = 0;
        var value;
        for (var idx=0; idx<len; idx++) {
            if (idx == len-1) {
                value = (memo.value).slice(index, (memo.value).length);
            }
            else {
                value = (memo.value).slice(index, result[idx + 1]._index);
                index = result[idx+1]._index;
            }

            var _memo = _.extend(_proto_memo, {
                title: (result[idx]._title).slice(2, (result[idx]._title).length),
                value: value,
                type: MemoTypeConstants.COMPLETE_MEMO,
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
                id: sui.generate(resultMemos[idx].value + resultMemos[idx].date.toString())
            });
        }
    }
    return resultMemos;
}





//Public Function
//공개 함수 영역입니다. 데이터를 반환합니다.
var MemoStore = _.extend({}, EventEmitter.prototype, {
    getMemo: function() {
        return _memos;
    },

    emitChange: function() {
        this.emit('change'); //데이터가 변경됬을 때, 이벤트를 발생합니다.
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    }
});


//Regist Callback Function
//디스패처에 Store의 콜백 함수를 등록합니다.
AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
        case MemoActionConstants.INIT_MEMO:
            initMemo(action.memos);
            break;

        case MemoActionConstants.ADD_MEMO:
            addMemo(action.targetEditMemo, action.context);
            break;

        case MemoActionConstants.DELETE_MEMO:
            deleteMemo(action.targetCompleteMemo);
            break;

        case MemoActionConstants.START_EDIT_MEMO:
            startEditMemo(action.targetCompleteMemo);
            break;

        case MemoActionConstants.END_EDIT_MEMO:
            endEditMemo(action.targetEditMemo);
            break;

        default:
            return true;
    }

    MemoStore.emitChange(); //데이터가 변경됬음을 ControllView(components/Editor)에 알립니다.
    return true;
});


module.exports = MemoStore;