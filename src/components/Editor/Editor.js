//Component Type: Controll View

var React = require('react');
var MemoStore = require('../../stores/MemoStore');
var MemoTypeConstants = require('../../constants/MemoTypeConstants');
var _ = require('underscore');

var CompleteMemo = require('./CompleteMemo');
var EditMemo = require('./EditMemo');
var GlobalEditMemo = require('./GlobalEditMemo');
var NoneMemo = require('./NoneMemo');


function getMemos() {
    return {
        memos: MemoStore.getMemo()
    };
}

var EditorDOM;

var Editor = React.createClass({
    getInitialState: function() {
        return getMemos();
    },

    componentDidMount: function() {
        EditorDOM = $(React.findDOMNode(this.refs._editor));

        MemoStore.addChangeListener(this._onChange); //Store의 데이터 변경을 감지하는 Listener 등록
    },

    componentWillUnmount: function() {
        MemoStore.removeChangeListener(this._onChange); //Listener 삭제
    },

    _preventFocusScroll: function(position) {
        EditorDOM.scrollTop(position);
    },

    _scrolltoTarget: function(targetTop) {
        console.log(targetTop);
        console.log(EditorDOM.scrollTop());
    },

    render: function() {
        var items = _.map(this.state.memos, function(memo) {
            var type = memo.type;
            switch(type) {
                case MemoTypeConstants.COMPLETE_MEMO :
                    return <CompleteMemo memo={memo} key={memo.id}/>;

                case MemoTypeConstants.EDIT_MEMO :
                    return <EditMemo memo={memo} key={memo.id} scrolltoTarget={this._scrolltoTarget} />;

                case MemoTypeConstants.NONE_MEMO :
                    return <NoneMemo memo={memo} key={memo.id}/>;

                case MemoTypeConstants.GLOBAL_EDIT_MEMO :
                    return <GlobalEditMemo memo={memo} key={memo.id} scrolltoTarget={this._scrolltoTarget} />;
            }
        }.bind(this));

        return (
            <div id="editor" ref="_editor">{items}</div>
        );
    },

    _onChange: function() {
        this.setState(getMemos()); //Store의 데이터가 변경되었을 시 데이터를 불러온다.
    }
});

module.exports = Editor;