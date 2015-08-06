var React = require('react')
var LoginDialog = require('./LoginDialog');

var mui = require('material-ui');
var Dialog = mui.Dialog;

var Header = React.createClass({
    render: function() {
        var dialog = (
            <Dialog
                ref="dialog"
                title="Hi Dialog">
            </Dialog>
        )
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand">memong</a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <form className="navbar-form navbar-right">
                            <div className="form-group">
                                <input className="form-control" type="text" placeholder="Search" />
                            </div>
            {dialog}
                            <button type="submit" className="btn btn-success" onClick={this.showLoginDialog}>Sign in</button>
                        </form>
                    </div>
                </div>
            </nav>
        );
    },
    showLoginDialog : function() {
        this.refs.dialog.show();
    }
});


module.exports = Header;