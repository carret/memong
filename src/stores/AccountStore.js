var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Constants = require('../constants/Constants');

var _ = require('underscore');


AppDispatcher.register(function(payload) {
    var action = payload.action;

   switch(action.actionType) {
       case Constants.AccountActionTypes.REQUEST_ACCOUNT :

           break;
   }
});