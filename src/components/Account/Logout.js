var React = require('react');
var Dialog = require('rc-dialog');
var cookie = require('react-cookie');
var jwt = require('jwt-simple');
var pkgInfo = require('../../../package');

var container;

function showDialog(content, props) {
    if (!container) {
        container = document.createElement('div');
        document.body.appendChild(container);
    }

    var close = props.onClose;
    props.onClose = function() {
        if(close)
            close();
        React.unmountComponentAtNode(container);
    };

    var dialog = React.render(<Dialog {...props} renderToBody={false}>{content}</Dialog>, container);
    dialog.show();
    return dialog;
}

var DialogContent = React.createClass({
    getInitialState : function() {
        return {
            value:''
        }
    },

    _onClose: function() {
        this.d.close();
    },

    render : function() {
        return (
            <div id='logoutModel'>
                <div className="content">
                    <span>정말 로그아웃 하시겠습니까?</span>
                </div>
                <div className="btn">
                    <a className="logout-ok" href="/logout"><span>로그아웃</span></a>
                    <a className="logout-cancel" onClick={this.props.handleClose}><span>취소</span></a>
                </div>
            </div>
        );
    }
});

var Logout = React.createClass({
    handleTrigger: function () {
        this.d = showDialog(<DialogContent handleClose={this._onClose}  />,{
            title: <p id="logoutModelTitle">로그아웃</p>,
            animation: 'zoom',
            maskAnimation: 'fade',
            onBeforeClose: this.beforeClose,
            style: {width: 350}
        });
    },

    _onClose: function() {
        this.d.close();
    },

    render : function() {
        var username = jwt.decode(cookie.load('token'), pkgInfo.oauth.token.secret).username;

        return (
            <div className="account" onClick={this.handleTrigger}>
                <button className="logout" onClick={this.handleTrigger}>
                    <i className="material-icons">&#xE7FD;</i>
                    <span>{username}</span>
                </button>
            </div>
        )
    }
});

module.exports = Logout;