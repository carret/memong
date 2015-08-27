var React = require('react');
var NoteStore = require('../../stores/NoteStore');
var NoteLoaderStore = require('../../stores/NoteLoaderStore');

var NoteLoader = React.createClass({
    getInitialState: function() {
        return {
            isRequesting: false
        }
    },

    componentDidMount: function() {
        NoteLoaderStore.addWait(this._onRequest);
        NoteLoaderStore.addAutoSaveComplete(this._onReceive);
    },

    componentWillUnmount: function() {
        NoteLoaderStore.removeWait(this._onRequest);
        NoteLoaderStore.removeAutoSaveComplete(this._onReceive);
    },

    render: function() {
        var content = (this.state.isRequesting) ?
            (<div className="progress">
                <div className="indeterminate"></div>
            </div>)
            :
            (<div></div>);

        return(
            <div>
                {content}
            </div>
        );
    },

    _onRequest: function() {
        this.setState({isRequesting: true});
    },

    _onReceive: function() {
        this.setState({isRequesting: false});
    }
});

module.exports = NoteLoader;