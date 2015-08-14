var React = require('react');

var MemoActionCreator = require('../../actions/MemoActionCreator');
var NoteStore = require('../../stores/NoteStore');
var Constants = require('../../constants/Constants');


var MemoAutoSaver = React.createClass({
    getInitialState: function() {
        return {
            status: Constants.AutoSaverStatusType.COMPLETE
        };
    },

    componentDidMount: function() {
        NoteStore.addMemoChangeListener(this._onChange);
        NoteStore.addMemoSaveCompleteListener(this._onComplete);
    },

    componentWillUnmount: function() {
        NoteStore.removeMemoChangeListener(this._onChange);
        NoteStore.removeMemoSaveCompleteListener(this._onComplete);
    },

    render: function() {
        var statusMessage;

        switch(this.state.status) {
            case Constants.AutoSaverStatusType.COMPLETE:
                statusMessage = "저장됨";
                break;

            case Constants.AutoSaverStatusType.SAVING:
                statusMessage = "저장중...";
                break;
        }

        return (
            <span className="auto-saver">{statusMessage}</span>
        );
    },

    _onChange: function() {
        this.setState({
            status: Constants.AutoSaverStatusType.SAVING
        });
        MemoActionCreator.requestMemoSave(NoteStore.getNoteID(), NoteStore.getMemo());
    },

    _onComplete: function() {
        this.setState({
            status: Constants.AutoSaverStatusType.COMPLETE
        });
    }
});

module.exports = MemoAutoSaver;