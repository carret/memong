var React = require('react');
var MemoActionCreator = require('../../actions/MemoActionCreator');
var Constants = require('../../constants/Constants');

var _ = require('underscore');

var Textarea = require('react-textarea-autosize');

var TextareaDOM;


var regEx = /^[^#\s]?(#)[ \t].+/gm;
var matches = new Array();

var EditMemo = React.createClass({
    getInitialState: function() {
        return {
            text: this.props.memo.text
        };
    },

    componentDidMount: function() {
        var text            = this.props.memo.text,
            KEYCODE_ENTER   = 13,
            KEYCODE_TAB     = 9;


        TextareaDOM = React.findDOMNode(this.refs._textarea);
        TextareaDOM.selectionStart = text.length;
        TextareaDOM.selectionEnd = text.length;
        TextareaDOM.focus();

        $(TextareaDOM).on("keydown", function(event) {

            if (this._isEnter(event.keyCode)) {
                var text = $(TextareaDOM).val();
                matches = text.match(regEx);

                if (matches != undefined) {
                    if (matches.length >= 2) {
                        var result;
                        var updateValue;

                        var _arr;
                        var index = new Array();
                        while ((_arr = regEx.exec(text)) !== null) {
                            index.push(_arr.index);
                        }
                        var len = index.length;

                        result = text.slice(0, index[len-1]);
                        updateValue = text.slice(index[len-1], text.length);

                        MemoActionCreator.addMemo(this.props.memo, result);
                        $(TextareaDOM).val(updateValue);
                        TextareaDOM.focus();
                    }
                }
            }
            if (event.keyCode == KEYCODE_TAB) {
                event.preventDefault();
                var text = $(TextareaDOM).val();
                var result = text;
                if (result == "") {
                    MemoActionCreator.deleteMemo(this.props.memo);
                }
                else {
                    MemoActionCreator.completeEditMemo(_.extend({}, this.props.memo, {
                        text: result
                    }));
                }
            }
        }.bind(this))
    },

    isEnter: function(nKeyCode) {
        return (nKeyCode == 13);
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