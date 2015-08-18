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
        TextareaDOM.focus();

        $(TextareaDOM).on("keydown", function(event) {
            var keyCode = event.keyCode;
            if (keyCode == Constants.KeyCode.ENTER) {
                this._handleAddMemo();
            }
            if (keyCode == Constants.KeyCode.TAB) {
                $(TextareaDOM).focusout();
            }
        }.bind(this));

        $(TextareaDOM).focusout(function() {
            this._handleCompleteMemo();
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

    _handleCompleteMemo: function(e) {
        if (e != undefined) {
            e.preventDefault();
        }

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