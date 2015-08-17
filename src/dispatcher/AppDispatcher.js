var Dispatcher = require('flux').Dispatcher;

var AppDispatcher = new Dispatcher();

AppDispatcher.handleClientAction = function(action) {
    this.dispatch({
        source: 'VIEW_ACTION',
        action: action
    });
};

AppDispatcher.handleServerAction = function(action) {
    this.dispatch({
        source: 'SERVER_ACTION',
        action: action
    });
};

AppDispatcher.handleAutoSaveAction = function(action) {
    this.dispatch({
        source: 'AUTO_SAVE_ACTION',
        action: action
    });
};

module.exports = AppDispatcher;