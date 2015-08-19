var React = require('react');

var EditMemoItem = React.createClass({
    componentWillReceiveProps: function() {
        $(React.findDOMNode(this.refs._editMemoItem)).focus();

    },

    render: function() {
        return (
            <div ref="_editMemoItem" className="memo-viewer-edit-item">
                <div className="memo-viewer-overlay"></div>
                <span className="title">{this.props.memo.title}</span>
                <span className="editing">편집중...</span>
            </div>
        );
    }
});

module.exports = EditMemoItem;