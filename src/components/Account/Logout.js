var React = require('react');

//var Logout = React.createClass({
//    render: function() {
//        return(
//            <div className="account" onClick={this.props.handleLogout} >
//                <button className="logout">
//                    <i className="material-icons">&#xE7FD;</i>
//                    <span>석주 나</span>
//                </button>
//            </div>
//        );
//    }
//});

var Logout = React.createClass({
    handleLogout: function() {
        location.href = '/logout';
    },

    render : function() {
        return (
            <div className="account" onClick={this.handleLogout}>
                <button className="logout" onClick={this.handleLogout}>
                    <i className="material-icons">&#xE7FD;</i>
                    <span>Seokju Na</span>
                </button>
            </div>
        )
    }
});

module.exports = Logout;