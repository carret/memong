var React = require('react');

var MemoViewer = require('./components/MemoViewer/MemoViewer');
var Editor = require('./components/Editor/Editor');
var MemoActions = require('./actions/MemoActions');
var Header = require('./components/Header/Header');
MemoActions.initMemo([]);

React.render(
    <div className="app">
        <Header />
        <div className="content">
            <MemoViewer />
            <Editor />
        </div>
    </div>,
    document.getElementById('app')
);
