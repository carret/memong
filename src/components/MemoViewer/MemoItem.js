var React = require('react');
var MemoActions = require('../../actions/MemoActions');

var MemoItem = React.createClass({
    _onDelete: function() {
        MemoActions.deleteMemo(this.props.memo);
    },

    render: function() {
        return (
        <div className="memo-viewer-item">
            <div className="memo-viewer-item-name">
                <h3>{this.props.memo.name}</h3>
                </div>
            <div>
                <button className="memo-viewer-item-button" onClick={this._onDelete}>삭제</button>
            </div>
        </div>
        );
    }
});

module.exports = MemoItem;