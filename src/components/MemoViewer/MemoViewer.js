var React = require('react');
var NoteStore = require('../../stores/NoteStore');
var Constants = require('../../constants/Constants');
var _ = require('underscore');

var MemoItem = require('./MemoItem');
var EditMemoItem = require('./EditMemoItem');


var MemoViewerDOM;

function getMemos() {
    return {
        memos: NoteStore.getMemo()
    };
}

var MemoViewer = React.createClass({
    getInitialState: function() {
        return getMemos();
    },

    componentDidMount: function() {
        MemoViewerDOM = React.findDOMNode(this.refs._memoViewer);
        NoteStore.addChangeListener(this._onChange); //Store의 데이터 변경을 감지하는 Listener 등록
    },

    componentWillUnmount: function() {
        NoteStore.removeChangeListener(this._onChange); //Listener 삭제
    },


    render: function() {
        var items = _.map(this.state.memos, function(memo) {
            switch (memo.mtype) {
                case Constants.MemoType.COMPLETE_MEMO:
                    return <MemoItem memo={memo} key={memo.key} />;

                case Constants.MemoType.NONE_MEMO:
                    return <MemoItem memo={memo} key={memo.key} />;

                case Constants.MemoType.EDIT_MEMO:
                    return <EditMemoItem memo={memo} key={memo.key} scrollAndFocusTarget={this._scrollAndFocusTarget} />;
            }
        }.bind(this));

        if (typeof items[0] === "undefined") {
            items = <div className="no-memo"><span>NO</span><span>MEMO</span></div>;
        }


        return (
            <div id="memo-viewer">
                <div className="header">메모</div>
                <div ref="_memoViewer" className="content">
                    {items}
                </div>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getMemos()); //Store의 데이터가 변경되었을 시 데이터를 불러온다.
    },

    _scrollAndFocusTarget: function(position) {
        $(MemoViewerDOM).stop().animate({
            scrollTop: position
        }, 450, 'swing');
    }
});

module.exports = MemoViewer;