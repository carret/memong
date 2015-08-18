var React = require('react');

var EditMemoItem = React.createClass({
    render: function() {
        return (
            <div className="memo-viewer-edit-item">
                <div className="memo-viewer-overlay"></div>
                <span className="title">{this.props.memo.title}</span>
                <span className="editing">편집중...</span>
            </div>
        );
    }
});

module.exports = EditMemoItem;