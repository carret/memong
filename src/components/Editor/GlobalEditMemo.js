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
            if (event.keyCode == 13) {
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
            if (event.keyCode === 9) {
                var text = $(TextareaDOM).val();
                if (text == "") {
                    return;
                }
                else {
                    var result = text;
                    MemoActionCreator.addMemo(_.extend(this.props.memo, {
                        text: ""
                    }), result);
                    $(TextareaDOM).val("");
                    TextareaDOM.focus();
                }
            }
        }.bind(this));
    },

    render: function() {
        return(
            <div className="globaledit-memo">
                <Textarea ref="_textarea"
                          minRows={25}
                          className="global-edit-memo-textarea"
                    />
            </div>
        );
    }
});

module.exports = GlobalEditMemo;