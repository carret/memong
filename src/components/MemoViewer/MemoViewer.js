var React = require('react');
var MemoStore = require('../../stores/MemoStore');
var MemoTypeConstants = require('../../constants/MemoTypeConstants');
var _ = require('underscore');

var MemoItem = require('./MemoItem');
var EditMemoItem = require('./EditMemoItem');


function getMemos() {
    return {
        memos: MemoStore.getMemo()
    };
}

var MemoViewer = React.createClass({
    getInitialState: function() {
        return getMemos();
    },

    componentDidMount: function() {
        MemoStore.addChangeListener(this._onChange); //Store의 데이터 변경을 감지하는 Listener 등록
    },

    componentWillUnmount: function() {
        MemoStore.removeChangeListener(this._onChange); //Listener 삭제
    },

    _onChange: function() {
        this.setState(getMemos()); //Store의 데이터가 변경되었을 시 데이터를 불러온다.
    },

    render: function() {
        var items = _.map(this.state.memos, function(memo) {
            switch (memo.type) {
                case MemoTypeConstants.COMPLETE_MEMO:
                    return <MemoItem memo={memo} id={memo.id}/>;
                /*
                case MemoTypeConstants.EDIT_MEMO:
                    return <EditMemoItem memo={memo} id={memo.id}/>;
                    */
            }
        });

        return (
            <div id="memo-viewer">
                <div className="header">메모</div>
                <div className="content">
                    {items}
                </div>
            </div>
        );
    }
});

module.exports = MemoViewer;