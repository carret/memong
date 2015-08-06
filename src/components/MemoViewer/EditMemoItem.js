var React = require('react');

var EditMemoItem = React.createClass({
    render: function() {
        return (
            <div className="memo-viewer-edit-item">
                <div className="memo-viewer-edit-item-name">
                    <h3>{this.props.memo.name}</h3>
                </div>
            </div>
        );
    }
});

module.exports = EditMemoItem;