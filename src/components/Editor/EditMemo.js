var React = require('react');
var MemoActions = require('../../actions/MemoActions');
var MemoTypeConstants = require('../../constants/MemoTypeConstants');
var MemoActionConstants = require('../../constants/MemoActionConstants');
var _ = require('underscore');

var Textarea = require('react-textarea-autosize');


var regEx = /^\s?(#)[ \t].+/gm;
var matches = new Array();

var EditMemo = React.createClass({
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
                this.setState({actionType: MemoActionConstants.ADD_MEMO}, function() {
                    React.findDOMNode(this.refs._textarea).blur();
                });
            }
        }
    },

    _handleAction: function() {
        var value = this.state.value;
        var result = "";

        switch(this.state.actionType) {
            case MemoActionConstants.END_EDIT_MEMO :
                result = value;
                MemoActions.completeEditMemo(_.extend({}, this.props.memo, {
                    value: result
                }));
                break;

            case MemoActionConstants.ADD_MEMO :
                matches = value.match(regEx);
                result = value.slice(0, (value.indexOf(matches[1], matches[0].length)));
                this.setState({value: value.slice((value.indexOf(matches[1], matches[0].length), value.length))});

                MemoActions.addMemo(this.props.memo, result);
                React.findDOMNode(this.refs._textarea).focus();
                break;
        }
    },

    render: function () {
        var valueLink = {
            value: this.state.value,
            requestChange: this._handleValueInput
        };

        return (
            <div className="edit-memo">
                <Textarea ref="_textarea"
                          className="edit-memo-textarea"
                          valueLink={valueLink}
                          onBlur={this._handleAction}
                    />
            </div>
        );
    }
});


module.exports = EditMemo;