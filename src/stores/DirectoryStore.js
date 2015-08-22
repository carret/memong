var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../../constants/Constants');

var _ = require('underscore');
var sui = require('simple-unique-id');


//Memo Data
var _tree= [];

//Private Function
//비공개 함수 영역입니다. 데이터를 수정합니다.



//서버로부터 불러온 초기 메모 데이터 설정
function initTree(tree) {
    _tree = _tree.concat(tree);
}

function reloadTree(tree){
    _tree = JSON.parse(tree);
}

//Public Function
var DirectoryStore = _.extend({}, EventEmitter.prototype, {
    getTree: function() {
        return _tree;
    },

    emitChange: function() {
        this.emit('change'); //데이터가 변경됬을 때, 이벤트를 발생합니다.
    },

    addTreeChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeTreeChangeListener: function(callback) {
        this.removeListener('change', callback);
    }
});

AppDispatcher.register(function(payload) {

    var action = payload.action;

    if ( action == Constants.DirectoryServerAction.UPDATE_NOTE
        || action == Constants.DirectoryServerAction.UPDATE_TREE){
        reloadTree(tree);
        DirectoryStore.emitChange();
    }

    return true;
});

module.exports = DirectoryStore;