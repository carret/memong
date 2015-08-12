var React = require('react');
var MemoActions = require('../../actions/MemoActions');

var MemoItem = React.createClass({
    _onDelete: function() {
        MemoActions.deleteMemo(this.props.memo);
    },

    render: function() {
        return (
        <div className="memo-viewer-item">
            <span className="title">
                {this.props.memo.title}
            </span>
            <div>
                <button className="btn_delete" onClick={this._onDelete}>
                    <i className="material-icons">&#xE872;</i>
                </button>
            </div>
        </div>
        );
    }
});

module.exports = MemoItem;