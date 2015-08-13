var React = require('react');
var MemoActionCreator = require('../../actions/MemoActionCreator');

var MemoItem = React.createClass({
    _onDelete: function() {
        MemoActionCreator.deleteMemo(this.props.memo);
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