var React = require('react');
var Dialog = require('rc-dialog');

var elTree, container;

var TitleCheckingDialog = React.createClass({
    getInitialState: function() {
        elTree = this.props.elTree;
        return {value: ''};
    },

    componentDidMount: function() {
        $(React.findDOMNode(this.refs._dialog)).on("keydown", function(event) {
            if (event.keyCode == 13) {
                this.props.actionItem();
            }
        });
    },

    _IsRedundancy: function() {
        var node = $(elTree).tree('getSelectedNode'), nodeParent;
        var title = document.getElementById('this-title').value;
        var type = this.props.type;

        if (node == false) { node = $(elTree).tree('getNodeById', 0); }
        nodeParent = (node.type == 'note')? node.parent: node;

        var val = _redundancyCheck(nodeParent, title);

        if(val== false) {
            var redundancy = document.getElementById('redundancy-alert');
            redundancy.style.display = "block";
        }
        else {
            this.props.actionItem(title, type, node);
            this.props.handleClose();
        }
    },

    handleChange: function(event) {
        this.setState({value: event.target.value});
    },

    render : function() {
        return (
            <div id="renameTitle" ref="_dialog">
                <div className="redundancyCheckDialog-text"><span>이름을 입력해주세요.</span></div>
                <input id="this-title" className="inputRename" type='text' onChange={this.handleChange} value={this.state.value} />
                <span id="redundancy-alert" style={{"color":"red",  "display":"none"}}>! 중복된 이름입니다.</span>
                <div className="redundancyCheckDialog-btnMenu">
                    <button className="ok" onClick={this._IsRedundancy} >확인</button>
                    <button className="no" onClick={this.props.handleClose} >취소</button>
                </div>
            </div>
        );
    }
});


function _redundancyCheck(parentNode, noteTitle) {
    var i;
    for ( i=0; i < parentNode.children.length; i++) {
        var child = parentNode.children[i];
        if(child.name == noteTitle) { break; }
    }

    if (parentNode.children.length == i) { return true; }
    else { return false; }
}


module.exports = TitleCheckingDialog;