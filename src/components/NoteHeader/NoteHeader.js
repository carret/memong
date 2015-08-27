var React = require('react');

var AutoSaver = require('../AutoSaver/AutoSaver');

var NoteStore = require('../../stores/NoteStore');

var ToggleAsideButton = require('./ToggleAsideButton');
var HowToUse = require('./HowToUse');


function getNoteTitle() {
    return {
        noteTitle: NoteStore.getNoteTitle(),
        date: NoteStore.getNoteDate()
    }
}

var NoteHeader = React.createClass({
    getInitialState: function() {
        return {
            noteTitle: NoteStore.getNoteTitle(),
            date: NoteStore.getNoteDate()
        };
    },

    componentDidMount: function() {
        NoteStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        NoteStore.removeChangeListener(this._onChange);
    },

    render: function() {
        var date = new Date(this.state.date);
        console.log(this.state.date);
        var dateItem = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

        return(
            <div id="note-header">
                <ToggleAsideButton toggleAsideVisible={this.props.toggleAsideVisible} asideVisible={this.props.asideVisible} />
                <span className="title">{this.state.noteTitle}</span>
                <AutoSaver />
                <div className="date">
                    <span>{dateItem}</span>
                </div>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getNoteTitle());
    }
});


module.exports = NoteHeader;