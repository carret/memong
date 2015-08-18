var React = require('react');
var MemoActionCreator = require('../../actions/MemoActionCreator');
var Constants = require('../../constants/Constants');

var _ = require('underscore');

var Textarea = require('react-textarea-autosize');

var TextareaDOM;


var regEx = /^[^#\s]?(#)[ \t].+/gm;
var headerOneMatches = new Array();

var EditMemo = React.createClass({
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
        $(TextareaDOM).focus();

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

                case Constants.KeyCode.ARROW_DOWN:
                    this._handleMoveToNext();
                    break;
            }
        }.bind(this));
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
            MemoActionCreator.deleteMemo(this.props.memo);
        }
        else {
            MemoActionCreator.completeEditMemo(_.extend({}, this.props.memo, {
                text: text
            }));
        }
    },

    _handleMoveToNext: function() {
        var text = $(TextareaDOM).val();
        if (text.length == TextareaDOM.selectionStart) {
            MemoActionCreator.endEditMemoAndStartNextEditMemo(this.props.memo);
        }
    },

    _handleMoveToPrevious: function() {
        if (0 == TextareaDOM.selectionStart) {
            MemoActionCreator.endEditMemoAndStartPreviousEditMemo(this.props.memo);
        }
    },


    __checkIfHeaderAreTwo: function(_headerOneMatches) {
        if (_headerOneMatches.length >= 2) return true;
        return false;
    },


    render: function () {
        return (
            <div className="edit-memo">
                <Textarea ref="_textarea"
                          className="edit-memo-textarea"
                          defaultValue={this.props.memo.text}
                    />
            </div>
        );
    }
});


module.exports = EditMemo;