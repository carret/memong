var React = require('react');

var MemoAction = require('./actions/MemoActions');

var Main = require('./components/Main');
var Header = require('./components/Header');


MemoAction.initMemo([]);

React.render(
    <div id="app-inner">
        <Header />
        <Main />
    </div>,
    document.getElementById('app')
);

