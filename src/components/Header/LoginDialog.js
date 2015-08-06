/**
 * Created by Jaewook on 2015-08-01.
 */
var React = require('react');
var mui = require('material-ui');
var Dialog = mui.Dialog;

var LoginDialog = React.createClass({
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    _onDialogSubmit : function() {

    },
    render: function() {

        //Standard Actions
        var standardActions = [
            { text: 'Cancel' },
            { text: 'Submit', onTouchTap: this._onDialogSubmit, ref: 'submit' }
        ];

        return (
            <div>
                <Dialog
                    title="Super Secret Password"
                    actions={standardActions}
                    ref="loginDialog">
                    1-2-3-4-5
                </Dialog>
            </div>
        );
    }
});

module.exports = LoginDialog;