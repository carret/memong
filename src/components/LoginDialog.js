/**
 * Created by Jaewook on 2015-08-01.
 */
var React = require('react');

var DIalog = React.createClass({
    render: function() {
        return <button onclick="location.href='/login/facebook'">Facebook Login</button>
    }
});

module.exports = Header;