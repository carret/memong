var React = require('react');
var AppActions = require('../../actions/AppActions');
var MemoTypeConstants = require('../../constants/MemoTypeConstants');
var ActionConstants = require('../../constants/ActionConstants');
var _ = require('underscore');


var regEx = /# .+/g;
var matches = new Array();

var EditMemo = React.createClass({
    getInitialState: function() {
        return {
            value: this.props.memo.value,
            actionType: ActionConstants.END_EDIT_MEMO
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
                this.setState({actionType: ActionConstants.ADD_MEMO}, function() {
                    React.findDOMNode(this.refs._textarea).blur();
                });
            }
        }
    },

    _handleAction: function() {
        var value = this.state.value;
        var result = "";

        switch(this.state.actionType) {
            case ActionConstants.END_EDIT_MEMO :
                result = value;
                AppActions.completeEditMemo(_.extend({}, this.props.memo, {
                    value: result
                }));
                break;

            case ActionConstants.ADD_MEMO :
                matches = value.match(regEx);
                result = value.slice(0, (value.indexOf(matches[1], matches[0].length)));
                this.setState({value: value.slice((value.indexOf(matches[1], matches[0].length), value.length))});

                AppActions.addMemo(this.props.memo, result);
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
            <div className="eidt-memo">
                <textarea ref="_textarea"
                          className="edit-memo-textarea"
                          valueLink={valueLink}
                          onBlur={this._handleAction}
                    />
            </div>
        );
    }
});


module.exports = EditMemo;