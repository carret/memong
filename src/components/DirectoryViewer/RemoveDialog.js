var React = require('react');
var Dialog = require('rc-dialog');

var elTree, container;

var RemoveDialog = React.createClass({
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

    _removeNode: function() {

        var result = _noteCheck();
        if (result.value == true) {
            this.props.actionItem(result.tree, result.node, result.childrenOfFolder);
            this.props.handleClose();
        }
        else
        {
            var redundancy = document.getElementById('remove-alert');
            redundancy.style.display = "block";
        }
    },

    handleChange: function(event) {
        this.setState({value: event.target.value});
    },

    render : function() {
        return (
            <div ref="_dialog">
                <div className="redundancyCheckDialog-text"><span>정말 삭제하시겠습니까?</span></div>
                <span id="remove-alert" style={{"color":"red",  "display":"none"}}>! 마지막 노트는 삭제할 수 없습니다.</span>
                <div className="redundancyCheckDialog-btnMenu">
                    <button onClick={this._removeNode} >확인</button>
                    <button onClick={this.props.handleClose} >취소</button>
                </div>
            </div>
        );
    }
});

function _noteCheck(){

    var _node =  $(elTree).tree('getSelectedNode');
    var _treeData, _preTreeData = $(elTree).tree('toJson');
    var _childrenOfFolder = _node.getData();

    $(elTree).tree('removeNode', _node);
    _treeData = $(elTree).tree('toJson');

    var stringData  = _treeData.toString();

    if(stringData.indexOf('note') == -1)  {
        $(elTree).tree('loadData', JSON.parse(_preTreeData));
        return {value : false};
    }
    else{
        return{
            value : true,
            node :  _node,
            childrenOfFolder: _childrenOfFolder,
            tree : _treeData
        };
    }
}

module.exports = RemoveDialog;