var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var SearchActionCreator = {
    selectMemo: function(_memoId) {
        AppDispatcher.handleClientAction({
            actionType: Constants.SearchActionTypes.SELECT_MEMO,
            memoId: _memoId
        });
    }
};

module.exports = SearchActionCreator;