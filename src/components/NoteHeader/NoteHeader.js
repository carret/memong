var React = require('react');

var AutoSaver = require('../AutoSaver/AutoSaver');

var NoteStore = require('../../stores/NoteStore');

var ToggleAsideButton = require('./ToggleAsideButton');


function getNoteTitle() {
    return {
        noteTitle: NoteStore.getNoteTitle()
    }
}

var NoteHeader = React.createClass({
    getInitialState: function() {
        return {
            noteTitle: NoteStore.getNoteTitle()
        };
    },

    componentDidMount: function() {
        NoteStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        NoteStore.removeChangeListener(this._onChange);
    },

    render: function() {
        return(
            <div id="note-header">
                <ToggleAsideButton toggleAsideVisible={this.props.toggleAsideVisible} asideVisible={this.props.asideVisible} />
                <span className="title">{this.state.noteTitle}</span>
                <AutoSaver />
                <div className="menu">
                </div>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getNoteTitle());
    }
});


module.exports = NoteHeader;