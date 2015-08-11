var React = require('react');

var DirectoryViewer = React.createClass({
    render: function() {
        return (
            <div id="directory-viewer">
                <div className="header">디렉토리</div>
                <div className="content"></div>
            </div>
        );
    }
});

module.exports = DirectoryViewer;