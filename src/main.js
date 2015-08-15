var React = require('react');

var MemoViewer = require('./components/MemoViewer/MemoViewer');
var Editor = require('./components/Editor/Editor');
var MemoActions = require('./actions/MemoActionCreator');
var Treeview = require('react-ui-tree');
var MemoActionCreator = require('./actions/MemoActionCreator');

var Main = require('./components/Main');
var Header = require('./components/Header');

var WebGetUtils = require('./utils/WebGetUtils');


WebGetUtils.getNoteWithMemos();


React.render(
    <div id="app-inner">
        <Header />
        <Main />
    </div>
    document.getElementById('app')
);


