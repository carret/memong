var React = require('react');

var MemoViewer = require('./components/MemoViewer/MemoViewer');
var Editor = require('./components/Editor/Editor');
var MemoActions = require('./actions/MemoActionCreator');
var Treeview = require('react-ui-tree');
var MemoActionCreator = require('./actions/MemoActionCreator');

var Main = require('./components/Main');
var Header = require('./components/Header');

var WebGetUtils = require('./utils/WebGetUtils');

var cookie = require('react-cookie');

WebGetUtils.getNoteWithMemos(cookie.load('token'), null);
var LoginState = (cookie.load('username') == null) ? false : true;

React.render(
    <div id="app-inner">
        <Header isLogin={LoginState} />
        <Main isLogin={LoginState} />
    </div>,
    document.getElementById('app')
);


