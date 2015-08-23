var React = require('react');
var cookie = require('react-cookie');
var jwt = require('jwt-simple');
var pkgInfo = require('../../../package');

var Logout = React.createClass({
    handleLogout: function() {
        location.href = '/logout';
    },

    render : function() {
        var username = jwt.decode(cookie.load('token'), pkgInfo.oauth.token.secret).username;

        return (
            <div className="account" onClick={this.handleLogout}>
                <button className="logout" onClick={this.handleLogout}>
                    <i className="material-icons">&#xE7FD;</i>
                    <span>{username}</span>
                </button>
            </div>
        )
    }
});

module.exports = Logout;