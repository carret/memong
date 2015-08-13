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
            <div>
                <div>
                    <a href="/login/facebook">Login Facebook</a>
                </div>
                <div>
                    <a href="/login/google">Login Google</a>
                </div>
            </div>
        );
    }
});

var LoginBtn = React.createClass({
    handleTrigger: function () {
        this.d = showDialog(<DialogContent />,{
            title: <p> Login memong</p>,
            animation: 'zoom',
            maskAnimation: 'fade',
            onBeforeClose: this.beforeClose,
            style: {width: 300}
        });
    },
    render: function () {
        return (
            <div>
                <button className="account" onClick={this.handleTrigger}>로그인</button>
            </div>
        );
    }
});

module.exports = LoginBtn;
