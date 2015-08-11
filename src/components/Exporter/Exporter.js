var React = require('react');

var Exporter = React.createClass({
    render: function() {
        return (
            <div id="exporter" onClick={this.props.handleExport}>
                <button className="header-menu">
                    <i className="material-icons">&#xE2C4;</i>
                </button>
            </div>
        )
    }
});

module.exports = Exporter;