var React = require('react');
var AppActions = require('../../actions/AppActions');
var Remarkable = require('remarkable');
var md = new Remarkable({
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
    breaks:       true,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // Autoconvert URL-like text to links
    typographer:  false,
    quotes: '“”‘’',
});


var NoneMemo = React.createClass({
    startEditMemo: function() {
        AppActions.startEditMemo(this.props.memo);
    },

    render: function() {
        var context = md.render(this.props.memo.value);
        return (
            <div className="none-memo" onClick={this.startEditMemo} >
                <div dangerouslySetInnerHTML={{__html: context}} />
            </div>
        );
    }
});

module.exports = NoneMemo;