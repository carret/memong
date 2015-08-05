var React = require('react');
var MemoActions = require('../../actions/MemoActions');
var MemoActionConstants = require('../../constants/MemoActionConstants');
var MemoTypeConstants = require('../../constants/MemoTypeConstants');
var _ = require('underscore');

var Textarea = require('react-textarea-autosize');


var regEx = /^(#)[ \t].+/gm;
var matches = new Array();


var GlobalEditMemo = React.createClass({
    getInitialState: function() {
        return {
            value: this.props.memo.value,
            actionType: MemoActionConstants.END_EDIT_MEMO
        };
    },

    componentDidMount: function() {
        var value = this.props.memo.value;
        React.findDOMNode(this.refs._textarea).selectionStart = value.length;
        React.findDOMNode(this.refs._textarea).selectionEnd = value.length;
        React.findDOMNode(this.refs._textarea).focus();
    },

    _handleValueInput: function(_value) {
        this.setState({value: _value});

        var value = this.state.value;
        matches = value.match(regEx);

        if (matches != undefined) {
            if (matches.length == 2) {
                this.setState({actionType: MemoActionConstants.ADD_MEMO}, function () {
                    React.findDOMNode(this.refs._textarea).blur();
                });
            }
        }
    },

    _handleAction: function() {
        var value = this.state.value;
        var result = "";
        var updateValue = "";

        switch(this.state.actionType) {
            case MemoActionConstants.END_EDIT_MEMO :
                if (value == "") {
                    return;
                }
                result = value;
                this.setState({value: ""});
                break;

            case MemoActionConstants.ADD_MEMO :
                matches = value.match(regEx);
                result = value.slice(0, (value.indexOf(matches[1], matches[0].length)));
                updateValue = value.slice(value.indexOf(matches[1], matches[0].length), value.length);
                this.setState({
                    value: updateValue,
                    actionType: MemoActionConstants.END_EDIT_MEMO
                });
                break;
        }
        MemoActions.addMemo(_.extend(this.props.memo, {
            value: updateValue
        }), result);
        React.findDOMNode(this.refs._textarea).focus();
    },

    render: function() {
        var valueLink = {
            value: this.state.value,
            requestChange: this._handleValueInput
        };
        return(
            <div className="global-edit-memo">
                <Textarea ref="_textarea"
                          className="global-edit-memo-textarea"
                          valueLink={valueLink}
                          onBlur={this._handleAction}
                    />
            </div>
        );
    }
});

module.exports = GlobalEditMemo;