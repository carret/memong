var React = require('react');

var ToggleAsideButton = React.createClass({
    render: function() {
        var icon = (this.props.asideVisible == true) ? <i className="material-icons">&#xE5C4;</i> : <i className="material-icons">&#xE5D2;</i>;

        return(
            <div ref="btn" id="btn_toggle-aside" onClick={this.props.toggleAsideVisible} >
                {icon}
            </div>
        );
    }
});

module.exports = ToggleAsideButton;