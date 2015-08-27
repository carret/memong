var React = require('react');

var EditMemoItem = React.createClass({
    componentDidMount: function() {
        $(React.findDOMNode(this.refs._editMemoItem)).focus();
        if (!this.props.memo.haveToFocus) {
            setTimeout(function() {
                var position = $(React.findDOMNode(this.refs._editMemoItem)).offset().top;
                var height = $(React.findDOMNode(this.refs._editMemoItem)).height();
                this.props.scrollAndFocusTarget(position - height);
            }.bind(this), 300);
        }
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