
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Constants = require('../constants/Constants');

var _ = require('underscore');

var result;

function setIndexingTable(table) {
    result = table;
}

var SearchStore = _.extend({}, EventEmitter.prototype, {
    getSearchResult : function() {
        return result;
    },
    addChangeListener: function(callback) {
        this.on('change', callback);
    },
    emitChange: function() {
        this.emit('change'); //데이터가 변경됬을 때, 이벤트를 발생합니다.
    }

})

AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
        case Constants.SearchActionTypes.RECEIVE_INDEXING_TABLE:
            setIndexingTable(action.indexingTable);
            break;
    }

    SearchStore.emitChange();
});

module.exports = SearchStore;