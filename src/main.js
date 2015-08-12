var React = require('react');

var MemoViewer = require('./components/MemoViewer/MemoViewer');
var Editor = require('./components/Editor/Editor');
var MemoActions = require('./actions/MemoActions');
var Treeview = require('react-ui-tree');

MemoActions.initMemo([]);

React.render(
<div className="app">

    <MemoViewer />
    <Editor />
    </div>,
    document.getElementById('app')
);