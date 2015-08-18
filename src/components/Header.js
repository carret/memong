var React = require('react');

var MemoSearcher = require('./MemoSearcher/MemoSearcher');
var Login = require('./Account/Login');
var Logout = require('./Account/Logout');
var Exporter = require('./Exporter/Exporter');
var NoteLoader = require('./NoteLoader/NoteLoader');

var cookie = require('react-cookie');

var Header = React.createClass({

    getInitialState: function() {
        return {
            memoSearcherActive: false,
            logoutActive: false
        };
    },

    _activeMemoSearcher: function() {
        this.setState({
            memoSearcherActive: true
        });
    },
    _disableMemoSearcher: function() {
        this.setState({
            memoSearcherActive: false
        });
    },

    _handleExport: function() {
    },

    _handleLogout: function() {
        this.setState({
            logoutActive: true
        });
    },


    render: function() {
        return (
            <div id="header">
                <div className="header-left">
                    <div id="logo-icon">
                        <img src="./libs/logo.svg" />
                    </div>
                    <a id="logo">memongade</a>
                </div>
                <div className="header-right" >
                    <Exporter handleExport={this._handleExport}  />
                    <MemoSearcher />
                    {this.props.isLogin ? <Logout /> : <Login />}
                </div>
                <NoteLoader />
            </div>
        );
    }
});

module.exports = Header;