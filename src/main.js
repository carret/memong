var React = require('react');

//var MemoViewer = require('./components/MemoViewer/MemoViewer');
var Editor = require('./components/Editor/Editor');
var AppActions = require('./actions/AppActions');

AppActions.initMemo([]);

React.render(
    <div className="app">
        <Editor />
    </div>,
    document.getElementById('app')
);
