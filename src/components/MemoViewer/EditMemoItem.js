var React = require('react');

var EditMemoItem = React.createClass({
    componentDidMount: function() {
        setTimeout(function() {
            var position = $(React.findDOMNode(this.refs._editMemoItem)).offset().top;
            this.props.scrollAndFocusTarget(position - 109);
        }.bind(this), 150);
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