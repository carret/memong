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
    render : function() {
        return (
            <a href='/logout'>로그아웃</a>
        )
    }
})

module.exports = Logout;