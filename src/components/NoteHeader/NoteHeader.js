var React = require('react');

var ToggleAsideButton = require('./ToggleAsideButton');

var NoteHeader = React.createClass({
    render: function() {
        return(
            <div id="note-header">
                <ToggleAsideButton toggleAsideVisible={this.props.toggleAsideVisible} asideVisible={this.props.asideVisible} />
                <span className="title">노트 타이틀</span>
                <div className="menu">
                </div>
            </div>
        );
    }
});


module.exports = NoteHeader;