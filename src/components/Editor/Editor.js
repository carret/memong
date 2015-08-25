//Component Type: Controll View

var React = require('react');
var NoteStore = require('../../stores/NoteStore');
var Constants = require('../../constants/Constants');
var _ = require('underscore');

var CompleteMemo = require('./CompleteMemo');
var EditMemo = require('./EditMemo');
var GlobalEditMemo = require('./GlobalEditMemo');
var NoneMemo = require('./NoneMemo');


function getMemos() {
    return {
        memos: NoteStore.getMemo(),
        shouldFocus: false
    };
}

var EditorDOM;

var Editor = React.createClass({
    getInitialState: function() {
        return getMemos();
    },

    componentDidMount: function() {
        EditorDOM = React.findDOMNode(this.refs._editor);
        NoteStore.addChangeListener(this._onChange); //Store의 데이터 변경을 감지하는 Listener 등록
    },

    componentWillUnmount: function() {
        NoteStore.removeChangeListener(this._onChange); //Listener 삭제
    },


    render: function() {
        var items;
        if (this.state.memos == null) {
            items = <div>선택된 노트가 없습니다.</div>;
        }
        else {
            items = _.map(this.state.memos, function(memo, index) {
                var type = memo.mtype;
                switch(type) {
                    case Constants.MemoType.COMPLETE_MEMO :
                        if (index == this.state.memos.length - 2) {
                            return <CompleteMemo memo={memo} key={memo.key} enableAddMemo={true}/>;
                        }
                        return <CompleteMemo memo={memo} key={memo.key} enableAddMemo={false} />;

                    case Constants.MemoType.EDIT_MEMO :
                        if (index == 0) {
                            return <EditMemo memo={memo} key={memo.key} scrollAndFocusTarget={this._scrollAndFocusTarget} focusThis={memo.haveToFocus} preventMoveToPrevious={true} />;
                        }
                        return <EditMemo memo={memo} key={memo.key} scrollAndFocusTarget={this._scrollAndFocusTarget} focusThis={memo.haveToFocus} preventMoveToPrevious={false} />;

                    case Constants.MemoType.NONE_MEMO :
                        return <NoneMemo memo={memo} key={memo.key}/>;

                    case Constants.MemoType.GLOBAL_EDIT_MEMO :
                        return <GlobalEditMemo memo={memo} key={memo.key} />;
                }
            }.bind(this));
        }

        return (
            <div id="editor" ref="_editor">{items}</div>
        );
    },

    _onChange: function() {
        this.setState(getMemos()); //Store의 데이터가 변경되었을 시 데이터를 불러온다.
        console.log(this.state.memos);
    },

    _scrollAndFocusTarget: function(position) {
        var scrollTop = $(EditorDOM).scrollTop();
        $(EditorDOM).stop().animate({
            scrollTop: position + scrollTop
        }, 450, 'swing');
    }
});

module.exports = Editor;