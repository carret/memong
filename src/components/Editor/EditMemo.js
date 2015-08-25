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

        if (this.props.focusThis) {
            setTimeout(function() {
                var position = $(React.findDOMNode(this.refs._thisEditMemo)).offset().top;
                var height = $(React.findDOMNode(this.refs._thisEditMemo)).height();
                this.props.scrollAndFocusTarget(position - height - 21);
            }.bind(this), 150);
        }

        $(TextareaDOM).on("keydown", function(event) {
            var keyCode = event.keyCode;
            var text = $(TextareaDOM).val();
            this.props.memo.text = text;

            if (event.which == Constants.KeyCode.ENTER && event.shiftKey) {
                event.preventDefault();
                this._handleCompleteMemo();
                return;
            }

            switch(keyCode) {
                case Constants.KeyCode.ENTER:
                    this._handleAddMemo();
                    break;

                case Constants.KeyCode.TAB:
                    event.preventDefault();
                    this._handleMoveToNextByTAB();
                    break;

                case Constants.KeyCode.ARROW_UP:
                    this._handleMoveToPrevious(event, this.props.preventMoveToPrevious);
                    break;


                case Constants.KeyCode.ARROW_DOWN:
                    this._handleMoveToNext(event);
                    break;

                case Constants.KeyCode.BACKSPACE:
                    this._handleMoveToPreviousByBackSpace(this.props.preventMoveToPrevious);
                    break;
            }
        }.bind(this));

    },

    _handleAddMemo: function() {
        var text = $(TextareaDOM).val();
        headerOneMatches = text.match(regEx);

        if (headerOneMatches != undefined) {
            if (this.__checkIfHeaderAreTwo(headerOneMatches)) {
                var _arr;
                var index = new Array();
                while ((_arr = regEx.exec(text)) !== null) {
                    index.push(_arr.index);
                }
                MemoActionCreator.addMemoInEditMemo(this.props.memo, text);
            }
        }
    },

    _handleCompleteMemo: function() {
        var text = $(TextareaDOM).val();
        if (text == "") {
            MemoActionCreator.deleteMemo(this.props.memo);
        }
        else {
            MemoActionCreator.completeEditMemo(_.extend({}, this.props.memo, {text: text}));
        }
    },

    _handleMoveToNext: function(e) {
        var text = $(TextareaDOM).val();
        if (text.length == TextareaDOM.selectionStart) {
            e.preventDefault();
            MemoActionCreator.endEditMemoAndStartNextEditMemo(_.extend({}, this.props.memo, {text: text}));
            return false;
        }
    },

    _handleMoveToNextByTAB: function() {
        var text = $(TextareaDOM).val();
        MemoActionCreator.endEditMemoAndStartNextEditMemo(_.extend({}, this.props.memo, {text: text}));
    },

    _handleMoveToPrevious: function(e, preventMoveToPrevious) {
        if (preventMoveToPrevious) { return; }
        var text = $(TextareaDOM).val();
        if (0 == TextareaDOM.selectionStart) {
            e.preventDefault();
            MemoActionCreator.endEditMemoAndStartPreviousEditMemo(_.extend({}, this.props.memo, {text: text}));
            return false;
        }
    },

    _handleMoveToPreviousByBackSpace: function(preventMoveToPrevious) {
        if (preventMoveToPrevious) { return; }
        var text = $(TextareaDOM).val();
        if (0 == TextareaDOM.selectionStart) {
            if (TextareaDOM.selectionStart == TextareaDOM.selectionEnd){
                MemoActionCreator.endEditMemoAndStartPreviousEditMemo(_.extend(this.props.memo, {text: text}));
            }
        }
    },


    __checkIfHeaderAreTwo: function(_headerOneMatches) {
        if (_headerOneMatches.length >= 2) {
            return true;
        }
        return false;
    },


    render: function () {
        return (
            <div ref="_thisEditMemo" className="edit-memo">
                <Textarea ref="_textarea"
                          className="edit-memo-textarea"
                          defaultValue={this.props.memo.text}
                    />
            </div>
        );
    }
});


module.exports = EditMemo;