var React = require('react');

var AutoSaveActionCreator = require('../../actions/AutoSaveActionCreator');
var NoteStore = require('../../stores/NoteStore');
var NoteLoaderStore = require('../../stores/NoteLoaderStore');
var Constants = require('../../constants/Constants');


var AutoSaver = React.createClass({
    getInitialState: function() {
        return {
            status: Constants.AutoSaverStatusType.COMPLETE
        };
    },

    componentDidMount: function() {
        NoteStore.addAutoSaveRequestListener(this._onRequest);
        NoteLoaderStore.addAutoSaveComplete(this._onReceive);
    },

    componentWillUnmount: function() {
        NoteStore.removeAutoSaveRequestListener(this._onRequest);
        NoteLoaderStore.removeAutoSaveComplete(this._onReceive);
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

    _onRequest: function() {
        if (this.state.status == Constants.AutoSaverStatusType.SAVING) {
            return ;
        }
        else {
            this.setState({ status: Constants.AutoSaverStatusType.SAVING }, function() {
                setTimeout(function() {
                    AutoSaveActionCreator.requestAutoSave(NoteStore.getNoteID(), NoteStore.getMemo());
                }, 2000);
            });
        }
    },

    _onReceive: function() {
        this.setState({
            status: Constants.AutoSaverStatusType.COMPLETE
        });
    }
});

module.exports = AutoSaver;