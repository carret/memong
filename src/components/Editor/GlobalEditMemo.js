var React = require('react');
var MemoActionCreator = require('../../actions/MemoActionCreator');
var Constants = require('../../constants/Constants');
var _ = require('underscore');

var Textarea = require('react-textarea-autosize');

var TextareaDOM;


var regEx = /^[^#\s]?(#)[ \t].+/gm;
var matches = new Array();


var GlobalEditMemo = React.createClass({
    getInitialState: function() {
        return {
            value: this.props.memo.value,
            actionType: Constants.MemoActionTypes.END_EDIT_MEMO
        };
    },

    componentDidMount: function() {
        var value = this.props.memo.value;
        TextareaDOM = React.findDOMNode(this.refs._textarea);
        TextareaDOM.selectionStart = value.length;
        TextareaDOM.selectionEnd = value.length;
        TextareaDOM.focus();
    },

    _handleValueInput: function(_value) {
        this.setState({value: _value});
    },

    _handleKeyInput: function(event) {
        if (event.keyCode === 13) {
            var value = this.state.value;
            matches = value.match(regEx);

            if (matches != undefined) {
                if (matches.length >= 2) {
                    this.setState({actionType: Constants.MemoActionTypes.ADD_MEMO}, function () {
                        TextareaDOM.blur();
                    });
                }
            }
        }
        if (event.keyCode === 9) {
            event.preventDefault();
            this.setState({actionType: Constants.MemoActionTypes.END_EDIT_MEMO}, function() {
                TextareaDOM.blur();
            });
        }
    },

    _handleAction: function() {
        var value = this.state.value;
        var result = "";
        var updateValue = "";

        switch(this.state.actionType) {
            case Constants.MemoActionTypes.END_EDIT_MEMO :
                if (value == "") {
                    return;
                }
                result = value;
                this.setState({value: ""});
                break;

            case Constants.MemoActionTypes.ADD_MEMO :
                var _arr;
                var index = new Array();
                while ((_arr = regEx.exec(value)) !== null) {
                    index.push(_arr.index);
                }
                var len = index.length;

                result = value.slice(0, index[len-1]);
                updateValue = value.slice(index[len-1], value.length);
                this.setState({
                    value: updateValue,
                    actionType: Constants.MemoActionTypes.END_EDIT_MEMO
                });
                break;
        }

        MemoActionCreator.addMemo(_.extend(this.props.memo, {
            value: updateValue
        }), result);
        TextareaDOM.focus();
    },

    render: function() {
        var valueLink = {
            value: this.state.value,
            requestChange: this._handleValueInput
        };
        return(
            <div className="globaledit-memo">
                <Textarea ref="_textarea"
                          minRows={25}
                          className="global-edit-memo-textarea"
                          valueLink={valueLink}
                          onKeyDown={this._handleKeyInput}
                          onBlur={this._handleAction}
                    />
            </div>
        );
    }
});

module.exports = GlobalEditMemo;