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
    name: null,
    value: "",
    type: MemoTypeConstants.GLOBAL_EDIT_MEMO
};
var matches = [];



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
    _parseMemo(newMemo);

    _memos.splice(index, 0, newMemo);
}

function deleteMemo(_targetMemo) {
    var index = _indexOf(_memos, _targetMemo.id, "id");
    _memos.splice(index, 1);
}

function startEditMemo(_targetCompleteMemo) {
    var index = _indexOf(_memos, _targetCompleteMemo.id, "id");
    if (index == _memos.length - 2) {
        var value = _memos[index].value + (_.last(_memos)).value;
        _memos.splice(index, 2);
        _memos.push(_.extend(globalEditMemo, {
            id: sui.generate(value),
            value: value
        }));
    }
    else {
        _targetCompleteMemo.type = MemoTypeConstants.EDIT_MEMO;
        _memos[index] = _.extend({}, _memos[index], _targetCompleteMemo);
    }
}

function endEditMemo(_targetEditMemo) {
    var index = _indexOf(_memos, _targetEditMemo.id, "id");
    _parseMemo(_targetEditMemo);

    _memos[index] = _.extend({}, _memos[index], _targetEditMemo);
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
    var props = {};

    matches = memo.value.match(/^\s?(#)[ \t].+/gm);

    if (matches != undefined) {
        if (matches.length == 1) {
            props.name = matches[0].slice(2, matches[0].length);
            props.type = MemoTypeConstants.COMPLETE_MEMO;
        }
        else {
            throw Error("Fatal Error: 잘못된 메모입니다. 다시 코딩하세요. 이 오류는 나와서는 안됩니다.");
        }
    }
    else {
        props.name = "none-memo";
        props.type = MemoTypeConstants.NONE_MEMO;
    }

    props.id = sui.generate(props.name);
    return (
        _.extend(memo, props)
    );
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