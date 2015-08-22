var React = require('react');
var async = require('async');
var jqtree = require('jqtree');
var WebPostUtils = require('../../utils/WebPostUtils');
var Constants = require('../../constants/Constants');
var DirectoryActions = require('../../actions/DirectoryAction');
var DirectoryStore = require('../../stores/DirectoryStore');

var elTree, addNoteDOM, addFolderDOM;
var _id;
var _username = 'true';

function _redundancyCheck(parentNode, noteTitle, callback)
{
    var i;
    for ( i=0; i < parentNode.children.length; i++) {
        var child = parentNode.children[i];

        console.log(child.name);
        if(child.name == noteTitle) break;
    }

    if(parentNode.children.length == i)  callback();
    else callback('Duplicated Name');

};

function getTree() {
    return DirectoryStore.getTree();
}


var DirectoryViewer = React.createClass({

    _initComponent : function(){
        elTree = React.findDOMNode(this.refs.tree1);
        addNoteDOM = React.findDOMNode(this.refs.btn_addN);
        addFolderDOM = React.findDOMNode(this.refs.btn_addF);
    },


    _getDataToDB : function () {

        WebPostUtils.loadDirectory(_username,function(_data){

            var treeData = _data.tree;
            _id = _data.count;

            console.log(_data);
            $(elTree).tree({
                data: treeData,
                autoOpen: true,
                dragAndDrop: true,

                onCreateLi: function(node, $li) {
                    $li.find('.jqtree-title').after('<a class="icon_mod" id="btn_mod"  ref="btn_mod" onClick="btnMd_click();"  >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    mod</a>');
                    $li.find('.jqtree-title').after('<a class="icon_del" id="btn_rm"  ref="btn_del" onClick="btnRm_click();" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; del</a>');
                }
            });
        });
    },

    _treeSelectEvent : function(event){

        if (event.node) {
            var node = event.node;
            console.log(node);
            var n =  $(elTree).find(node);
            console.log($(n));
            $(n).find('a').css('background-color', 'red');
            console.log($(n).find('a').css('background-color'));
        }
        else {
            // event.node is null
            // a node was deselected
            // e.previous_node contains the deselected node
        }
    }, // testing......

    _bindTreeEvent: function() {

        $(elTree).bind(
            'tree.move', function(event){
                if(event.move_info.target_node.type == "note" && event.move_info.position == "inside") event.preventDefault();
                else if(event.move_info.moved_node.id == 0) event.preventDefault();
                else if(event.move_info.target_node.id == 0 && event.move_info.position == 'before')  event.preventDefault();

                console.log(($(elTree).tree('getTree')).children);
            }
        );

        $(elTree).bind(
            'tree.select', function(event){ });
    },

    _addNoteToTree : function(){

        $(addNoteDOM).click(function() {

            var noteTitle = 'new_note' + (_id+1); // 다이얼로그 입력
            var node = $(elTree).tree('getSelectedNode');
            var treeData, preTreeData=  $(elTree).tree('toJson');

            if (node == false) node = $(elTree).tree('getNodeById', 0);
            if (node.type == 'note') node = node.parent;

            _redundancyCheck(node, noteTitle,function(err) {

                if(err == null) {

                    $(elTree).tree(
                        'appendNode',
                        {
                            label: noteTitle,
                            type: 'note',
                            id: _id++
                        },
                        node
                    );
                    treeData = $(elTree).tree('toJson');

                    console.log(preTreeData);
                    $(elTree).tree('loadData', JSON.parse(preTreeData));

                    DirectoryActions.addNote_updateDB(treeData, Constants.DirectoryAPIType.ADD_NOTE, noteTitle);
                }
                else
                    console.log(err); // 안내 alert 띄움
            });

        })
    },

    _addFolderToTree : function() {

        $(addFolderDOM).click(function() {

            var folderPosition = null;
            var node = $(elTree).tree('getSelectedNode');

            if(node == false) node = $(elTree).tree('getNodeById', 0);

            if(node.type == 'note') folderPosition = 'addNodeAfter';
            else folderPosition = 'appendNode';

            $(elTree).tree(
                folderPosition,
                {
                    label: 'new_folder',
                    type: 'folder',
                    id: _id++
                },
                node
            );

        })

    },

    _onClickEvent : function(){

        this._addFolderToTree();
        this._addNoteToTree();

    },

    componentWillMount: function(){
        DirectoryStore.removeTreeChangeListener(this._onChange);
    },

    componentDidMount: function() {

        DirectoryStore.addTreeChangeListener(this._onChange);

        this._initComponent();
        this._getDataToDB();

        this._onClickEvent();
        this._bindTreeEvent();
    },

    _onChange: function() {

        $(elTree).tree('loadData', JSON.parse(getTree()));
    },
    render: function() {
        return (
            <div id="directory-viewer">
                <div className="header">디렉토리</div>
                <div className="addNode">
                    <button ref="btn_addN">add note</ button>
                    <button ref="btn_addF">add folder</ button> </div>
                <div className="content"> <div id="tree1" ref="tree1"
                                               className="directory-viewer-tree"></div>
                </div>
            </div>
        )
    }
});

module.exports = DirectoryViewer;