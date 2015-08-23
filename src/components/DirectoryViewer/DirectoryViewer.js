var React = require('react');
var async = require('async');
var jqtree = require('jqtree');
var WebPostUtils = require('../../utils/WebPostUtils');
var Constants = require('../../constants/Constants');
var DirectoryActions = require('../../actions/DirectoryAction');
var DirectoryStore = require('../../stores/DirectoryStore');
var NodeBtn  = require('./NodeBtn');

var elTree, addNoteDOM, addFolderDOM, renameNodeDOM, removeNodeDOM;
var _id;
var _username = 'rong';

var lastId= 0;

function _redundancyCheck(parentNode, noteTitle, callback)
{
    var i;
    for ( i=0; i < parentNode.children.length; i++) {
        var child = parentNode.children[i];
        if(child.name == noteTitle) break;
    }

    if(parentNode.children.length == i)  callback();
    else callback('Duplicated Name');

}

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

                    $li.find('.jqtree-title').after('<button id="btn_mod'+ node.id +'"> mod </button>');
                    $li.find('.jqtree-title').after('<button id="btn_del'+ node.id +'"> del </button>');

                    $('#btn_mod'+lastId).click(function() {
                        var node = $(elTree).tree('getSelectedNode');
                        var newTitle = 'newTitle...';
                        var treeData, preTreeData=  $(elTree).tree('toJson');

                        console.log(node);
                        $(elTree).tree('updateNode', node, newTitle);
                        treeData=  $(elTree).tree('toJson');
                        $(elTree).tree('loadData', JSON.parse(preTreeData));

                        console.log(newTitle);
                        if(node.type == 'note') DirectoryActions.renameNote_updateDB(treeData, Constants.DirectoryAPIType.RENAME_NOTE ,newTitle,node.id);
                        else DirectoryActions.renameFolder_updateDB(treeData, Constants.DirectoryAPIType.CHANGE_TREE ,newTitle);

                    });

                    $('#btn_del'+lastId).click(function() {
                            var node = $(elTree).tree('getSelectedNode');
                            var treeData, preTreeData = $(elTree).tree('toJson');
                            var childrenOfFolder = node.getData;

                            $(elTree).tree('removeNode', node);
                            treeData = $(elTree).tree('toJson');
                            $(elTree).tree('loadData', JSON.parse(preTreeData));

                            console.log(childrenOfFolder);

                            if(node.type=='note') DirectoryActions.deleteNote_updateDB(treeData, Constants.DirectoryAPIType.DELETE_NOTE, node.id);
                            else DirectoryActions.deleteFolder_updateDB(treeData, Constants.DirectoryAPIType.DELETE_FOLDER, childrenOfFolder);
                        }
                    );

                    lastId = node.id;
                }
            });
        });
    },

    _treeSelectEvent : function(){

        $(elTree).bind(
            'tree.click',

            function(event) {
                console.log('event');
                if (event.node) {

                    var node = event.node;


                    console.log(lastId);
                    if(lastId != 0) {

                        console.log(lastId);

                        $('#btn_mod'+lastId).click(function () {
                            var node = $(elTree).tree('getSelectedNode');
                            var newTitle = 'newTitle...';
                            var treeData, preTreeData=  $(elTree).tree('toJson');

                            console.log(node);
                            $(elTree).tree('updateNode', node, newTitle);
                            treeData=  $(elTree).tree('toJson');
                            $(elTree).tree('loadData', JSON.parse(preTreeData));

                            console.log(newTitle);
                            if(node.type == 'note') DirectoryActions.renameNote_updateDB(treeData, Constants.DirectoryAPIType.RENAME_NOTE ,newTitle,node.id);
                            else DirectoryActions.renameFolder_updateDB(treeData, Constants.DirectoryAPIType.CHANGE_TREE ,newTitle);
                        });

                        $('#btn_del'+lastId).click(function() {
                            var node = $(elTree).tree('getSelectedNode');
                            var treeData, preTreeData=  $(elTree).tree('toJson');
                            var childrenOfFolder = node.getData;

                            $(elTree).tree('removeNode', node);
                            treeData=$(elTree).tree('toJson');
                            $(elTree).tree('loadData',JSON.parse(preTreeData));

                            console.log(childrenOfFolder);

                            if(node.type=='note') DirectoryActions.deleteNote_updateDB(treeData, Constants.DirectoryAPIType.DELETE_NOTE, node.id);
                            else DirectoryActions.deleteFolder_updateDB(treeData, Constants.DirectoryAPIType.DELETE_FOLDER, childrenOfFolder);
                        });

                        lastId=0;
                    }
                }
                else {
                    // event.node is null
                    // a node was deselected
                    // e.previous_node contains the deselected node
                }
            }
        );
    }, // testing......

    _bindTreeEvent: function() {

        $(elTree).bind(
            'tree.move', function(event){

                var treeData, preTreeData=  $(elTree).tree('toJson');

                if(event.move_info.target_node.type == "note" && event.move_info.position == "inside") event.preventDefault();
                else if(event.move_info.moved_node.id == 0) event.preventDefault();
                else if(event.move_info.target_node.id == 0 && event.move_info.position == 'before')  event.preventDefault();

                else {

                    event.move_info.do_move();
                    treeData = $(elTree).tree('toJson');
                    $(elTree).tree('loadData', JSON.parse(preTreeData));
                    console.log(treeData);

                    DirectoryActions.moveNode_updateDB(treeData, Constants.DirectoryAPIType.CHANGE_TREE);
                }
            }
        );
    },

    _addNoteToTree : function(){

        $(addNoteDOM).click(function() {

            var noteTitle = 'new_note' + (_id+1), notePosition; // 다이얼로그 입력
            var node = $(elTree).tree('getSelectedNode');
            var treeData, preTreeData=  $(elTree).tree('toJson');

            if (node == false) node = $(elTree).tree('getNodeById', 0);
            notePosition = (node.type == 'note')? 'addNodeAfter':'appendNode';

            _redundancyCheck(node, noteTitle,function(err) {

                if(err == null) {

                    $(elTree).tree(
                        notePosition,
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

            var folderTitle = 'new_folder' + (_id+1), folderPosition; // 다이얼로그 입력
            var node = $(elTree).tree('getSelectedNode');
            var treeData, preTreeData=  $(elTree).tree('toJson');

            if (node == false) node = $(elTree).tree('getNodeById', 0);
            folderPosition = (node.type == 'note')? 'addNodeAfter':'appendNode';

            _redundancyCheck(node, folderTitle, function(err) {

                if(err == null) {

                    $(elTree).tree(
                        folderPosition,
                        {
                            label: folderTitle,
                            type: 'folder',
                            id: _id++
                        },
                        node
                    );
                    treeData = $(elTree).tree('toJson');

                    console.log(preTreeData);
                    $(elTree).tree('loadData', JSON.parse(preTreeData));

                    DirectoryActions.addFolder_updateDB(treeData, Constants.DirectoryAPIType.ADD_FOLDER);
                }
                else
                    console.log(err); // 안내 alert 띄움
            });
        });
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
        this._treeSelectEvent();
        this._onClickEvent();
        this._bindTreeEvent();

        //var allButtonElements = $(elTree).find('button');
       // var findBtn = $('button.btn_mod58').find( allButtonElements );

       // $("#btn_mod58" ).css( "border", "3px solid red" );
    },

    _onChange: function() {

        $(elTree).tree('loadData', JSON.parse(getTree()));
    },

    render: function() {
        return (

            <div id="directory-viewer">
                <NodeBtn />
                <div className="header">디렉토리</div>
                <div className="addNode">
                    <button ref="btn_addN">add note</ button>
                    <button ref="btn_addF">add folder</ button>
                    </div>
                <div className="content"> <div id="tree1" ref="tree1"
                                               className="directory-viewer-tree"></div>
                </div>
            </div>
        )
    }
});

module.exports = DirectoryViewer;