var React = require('react');
var Dialog = require('rc-dialog');

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
    render : function() {
        return (
            <div id='loginModel'>
                <div>
                    <a className="facebook-login" href="/login/facebook"><img src="./facebook.png" /><span>Facebook으로 시작하기</span></a>
                </div>
                <div>
                    <a className="google-login" href="/login/google"><img src="./google.png" /><span>Google로 시작하기</span></a>
                </div>
            </div>
        );
    }
});

var LoginBtn = React.createClass({
    handleTrigger: function () {
        this.d = showDialog(<DialogContent />,{
            title: <p className="dialog-title">로그인</p>,
            animation: 'zoom',
            maskAnimation: 'fade',
            onBeforeClose: this.beforeClose,
            style: {width: 400}
        });
    },
    render: function () {
        return (
            <div className="account">
                <button className="login" onClick={this.handleTrigger}><span>로그인</span></button>
            </div>
        );
    }
});

module.exports = LoginBtn;
