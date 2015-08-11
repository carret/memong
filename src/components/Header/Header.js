var React = require('react')
var LoginBtn = require('./Login');
var AutoInput=require('./AutoInput');


var Header = React.createClass({
    render: function() {
        return (
                <div>
                    <AutoInput />
                    <LoginBtn />
                </div>
        );
    },
});


module.exports = Header;