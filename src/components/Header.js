var React = require('react'),
    injectTapEventPlugin = require("react-tap-event-plugin"),
    mui = require('material-ui'),
    ThemeManager = new mui.Styles.ThemeManager(),
    RaisedButton = mui.RaisedButton;

injectTapEventPlugin();

//var MyAwesomeReactComponent = React.createClass({
//
//    childContextTypes: {
//        muiTheme: React.PropTypes.object
//    },
//    getChildContext: function() {
//        return {
//            muiTheme: ThemeManager.getCurrentTheme()
//        };
//    },
//    doLogin : function() {
//        alert('hi');
//    },
//    render: function() {
//        return (
//            <RaisedButton onclick={this.doLogin} label="Default" />
//        );
//    }
//});
var LikeButton = React.createClass({
    getInitialState: function() {
        return {liked: false};
    },
    handleClick: function(event) {
        this.setState({liked: !this.state.liked});
    },
    render: function() {
        var text = this.state.liked ? 'like' : 'havent liked';
        return (
            <p onClick={this.handleClick}>
                You {text} this. Click to toggle.
            </p>
        );
    }
});


module.exports = LikeButton;