var React = require('react');
var jqtree = require('jqtree');
var WebPostUtils = require('../utils/WebPostUtils');
var elTree, addNoteDOM, addFolderDOM;
var _id= 8;
var _username = 'cho';

var DirectoryViewer = React.createClass({

    _initComponent : function(){
        elTree = React.findDOMNode(this.refs.tree1);
        addNoteDOM = React.findDOMNode(this.refs.btn_addN);
        addFolderDOM = React.findDOMNode(this.refs.btn_addF);
    },

    _getDataToDB : function () {

        var data = [
            {
                label: 'root', id: 0, type: 'folder',
                children: [
                    {
                        label: 'node1', id: 1, type: 'folder',
                        children: [
                            {label: 'child1', id: 2, type: 'note'},
                            {label: 'child2', id: 3, type: 'note'}
                        ]
                    },
                    {
                        label: 'node2', id: 4, type: 'folder',
                        children: [
                            {label: 'child3', id: 5, type: 'note'}
                        ]
                    }
                ]
            }];
        // 서버에서 가져오기


        WebPostUtils.postDirectory(_username);

        return data;
    },

    _initDirTreeDOM : function(){

        var treeData = this._getDataToDB();

        $(elTree).tree({
            data: treeData,
            autoOpen: true,
            dragAndDrop: true,

            onCreateLi: function(node, $li) {
                $li.find('.jqtree-title').after('<a class="icon_mod" id="btn_mod"  ref="btn_mod" onClick="btnMd_click();"  >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    mod</a>');
                $li.find('.jqtree-title').after('<a class="icon_del" id="btn_rm"  ref="btn_del" onClick="btnRm_click();" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; del</a>');
            }
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
            }
        );

        $(elTree).bind(
            'tree.select', function(event){ });
    },

    _addNoteToTree : function(){

        $(addNoteDOM).click(function() {

            var notePosition = null;
            var node = $(elTree).tree('getSelectedNode');

            if (node == false) node = $(elTree).tree('getNodeById', 0);
            console.log(node);
            if (node.type == 'note') notePosition = 'addNodeAfter';
            else notePosition = 'appendNode';

            $(elTree).tree(
                'addNodeAfter',
                {
                    label: 'new_note',
                    type: 'note',
                    id: _id++
                },
                node
            );
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

    componentDidMount: function() {

        this._initComponent();
        this._initDirTreeDOM();

        this._onClickEvent();
        this._bindTreeEvent();
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