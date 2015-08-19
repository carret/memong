var React = require('react');
var MemoActionCreator = require('../../actions/MemoActionCreator');
var Remarkable = require('remarkable');
var md = new Remarkable({
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
    breaks:       true,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // Autoconvert URL-like text to links
    typographer:  false,
    quotes: '“”‘’'
});


var CompleteMemo = React.createClass({
    startEditMemo: function() {
        MemoActionCreator.startEditMemo(this.props.memo);
    },

    render: function() {
        var context = md.render(this.props.memo.text);

        var _date = new Date(this.props.memo.date);

        var date = _date.getFullYear() + '-'
            + (_date.getMonth() + 1) + '-'
            + _date.getDate();


        return (
            <div ref="_completeMemo" className="complete-memo" >
                <div className="complete-memo-inner" onClick={this.startEditMemo}>
                    <div dangerouslySetInnerHTML={{__html: context}} />
                    <span className="date">{date}</span>
                </div>
                <div className="toolbar">
                    <i onClick={this._handleAddMemo} className="material-icons">&#xE147;</i>
                    <span onClick={this._handleAddMemo}>새로운 메모 추가하기</span>
                </div>
            </div>
        );
    },

    _handleAddMemo: function() {
        var newMemoContext = "# 새로운 메모\n이 메모를 클릭하여 편집하세요.";
        MemoActionCreator.addNewMemo(this.props.memo, newMemoContext);
    }
});

module.exports = CompleteMemo;