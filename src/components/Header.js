var React = require('react');

var MemoSearcher = require('./MemoSearcher/MemoSearcher');
var Login = require('./Account/Login');
var Logout = require('./Account/Logout');
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
                        <img src="./logo.svg" />
                    </div>
                    <a id="logo">memong</a>
                </div>
                <div className="header-right" >
                    {this.props.isLogin ? <MemoSearcher /> : <div></div>}
                    {this.props.isLogin ? <Logout /> : <Login />}
                </div>
                <NoteLoader />
            </div>
        );
    }
});

module.exports = Header;