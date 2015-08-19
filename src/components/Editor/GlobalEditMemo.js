var React = require('react');
var MemoActionCreator = require('../../actions/MemoActionCreator');
var Constants = require('../../constants/Constants');
var _ = require('underscore');

var Textarea = require('react-textarea-autosize');

var TextareaDOM;


var regEx = /^[^#\s]?(#)[ \t].+/gm;
var headerOneMatches = new Array();


var GlobalEditMemo = React.createClass({
    getInitialState: function() {
        return {
            text: this.props.memo.text
        };
    },

    componentDidMount: function() {
        var text = this.props.memo.text;

        TextareaDOM = React.findDOMNode(this.refs._textarea);
        TextareaDOM.selectionStart = text.length;
        TextareaDOM.selectionEnd = text.length;
        TextareaDOM.focus();

        $(TextareaDOM).on("keydown", function(event) {
            var keyCode = event.keyCode;

            switch(keyCode) {
                case Constants.KeyCode.ENTER:
                    this._handleAddMemo();
                    break;

                case Constants.KeyCode.TAB:
                    event.preventDefault();
                    this._handleCompleteMemo();
                    break;

                case Constants.KeyCode.ARROW_UP:
                    this._handleMoveToPrevious();
                    break;

                case Constants.KeyCode.BACKSPACE:
                    this._handleMoveToPreviousByBackSpace();
                    break;
            }
        }.bind(this));
    },

    componentDidUpdate: function() {
        $(TextareaDOM).focus();
    },


    _handleAddMemo: function() {
        var text = $(TextareaDOM).val();
        headerOneMatches = text.match(regEx);

        if (headerOneMatches != undefined) {
            if (this.__checkIfHeaderAreTwo(headerOneMatches)) {
                var resultContext;
                var updateValue;

                var _arr;
                var index = new Array();
                while ((_arr = regEx.exec(text)) !== null) {
                    index.push(_arr.index);
                }
                var len = index.length;

                resultContext = text.slice(0, index[len-1]);
                updateValue = text.slice(index[len-1], text.length);

                MemoActionCreator.addMemo(this.props.memo, resultContext);
                $(TextareaDOM).val(updateValue);
                TextareaDOM.focus();
            }
        }
    },

    _handleCompleteMemo: function() {
        var text = $(TextareaDOM).val();
        if (text == "") {
            return;
        }
        else {
            MemoActionCreator.addMemo(_.extend(this.props.memo, {
                text: ""
            }), text);
            $(TextareaDOM).val("");
            TextareaDOM.focus();
        }
    },

    _handleMoveToPrevious: function() {
        if (0 == TextareaDOM.selectionStart) {
            this.props.memo = _.extend(this.props.memo, {
                text: $(TextareaDOM).val()
            });
            $(TextareaDOM).val("");
            MemoActionCreator.endEditMemoAndStartPreviousEditMemo(this.props.memo);
        }
    },

    _handleMoveToPreviousByBackSpace: function() {
        if (0 == TextareaDOM.selectionStart && $(TextareaDOM).val() == "") {
            this.props.memo = _.extend(this.props.memo, {
                text: $(TextareaDOM).val()
            });
            $(TextareaDOM).val("");
            MemoActionCreator.endEditMemoAndStartPreviousEditMemo(this.props.memo);
        }
    },

    _handleClick: function() {
        MemoActionCreator.startEditMemo(this.props.memo);
    },


    __checkIfHeaderAreTwo: function(_headerOneMatches) {
        if (_headerOneMatches.length >= 2) return true;
        return false;
    },

    __focusThis: function() {
        TextareaDOM.focus();
    },

    render: function() {
        return(
            <div className="globaledit-memo">
                <Textarea ref="_textarea"
                          onClick={this._handleClick}
                          minRows={25}
                          className="global-edit-memo-textarea"
                    />
            </div>
        );
    }
});

module.exports = GlobalEditMemo;