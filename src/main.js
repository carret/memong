var React = require('react');

var MemoViewer = require('./components/MemoViewer/MemoViewer');
var Editor = require('./components/Editor/Editor');
var MemoActions = require('./actions/MemoActionCreator');
var Treeview = require('react-ui-tree');
var MemoActionCreator = require('./actions/MemoActionCreator');

var Main = require('./components/Main');
var Header = require('./components/Header');

var WebGetUtils = require('./utils/WebGetUtils');


WebGetUtils.getNoteWithMemos("CAAM44zR7hJgBAEuKs0fyKduTBF9CKauvkhjcZAGQ9ZC57jivTgWtjAY1eSvcDOkj1ZAl4mYcqkwPkDYEOEpgt6cOccpJp25P2cT7Qx5GbqZAPoDhokHZBT2FYHbhwDhYCrrqX04IxQ7J3ZC9qBBIEz2Oy02zvRZAxhq2Yfs5AT6ZBo6xp4yXCgIJbCLZCxwx6L18ZD", null);


React.render(
    <div id="app-inner">
        <Header />
        <Main />
    </div>,
    document.getElementById('app')
);


