var React = require('react');


var MemoSearcher = React.createClass({
    render: function() {
        var content = (this.props.memoSearcherActive == true) ?
            (<div className="inputer">
                <input placeholder="Search Memo..."/>
                <button onClick={this.props.disableMemoSearcher}>
                    <i className="material-icons">&#xE14C;</i>
                </button>
            </div>) :
            (<button className="header-menu" onClick={this.props.activeMemoSearcher}>
                <i className="material-icons">&#xE8B6;</i>
            </button>);

        return (
            <div id="memo-searcher">
                {content}
            </div>
        );
    }
});

module.exports = MemoSearcher;