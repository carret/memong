var React = require('react');
var jqtree = require('jqtree');
var Dialog = require('rc-dialog');
var async = require('async');
var WebPostUtils = require('../../utils/WebPostUtils');
var Constants = require('../../constants/Constants');
var DirectoryActions = require('../../actions/DirectoryAction');
var DirectoryStore = require('../../stores/DirectoryStore');

var elTree, addNoteDOM, addFolderDOM;
var _id;
var _username = 'rong';

var lastId= 0, preNodeId = 0;
var _selectedNode;
var container;

function showDialog(content, props) {

    if (!container) {
        container = document.createElement('div');
        container.setAttribute("id", "redundancyCheckDialog");
        document.body.appendChild(container);
    }

    var close = props.onClose;
    props.onClose = function() {
        if(close)
            close();
        React.unmountComponentAtNode(container);
    };

    var dialog = React.render(<Dialog {...props} renderToBody={false}>{content}</Dialog>, container);
    dialog.show();
    return dialog;
}

var DialogContent = React.createClass({

    getInitialState: function() {
        return {value: ''};
    },

    componentDidMount: function() {
        $(React.findDOMNode(this.refs._dialog)).on("keydown", function(event) {
            if (event.keyCode == 13) {
                this.props.addNoteItem();
            }
        });
    },

    _IsRedundancy: function() {

        console.log(this.props.selectedNode);

        var node = $(elTree).tree('getSelectedNode'), nodeParent;
        var _title = document.getElementById('title').value;

        if (node == false) node = $(elTree).tree('getNodeById', 0);
        nodeParent = (node.type == 'note')? node.parent: node;


        var val = _redundancyCheck____(nodeParent, _title);

        if(val== false) console.log('중복!');
        else {
            this.props.addNoteItem(_title);
            this.props.handleClose();
        }
    },

    _addNoteItem: function() {
        var _title = document.getElementById('title').value;
        this.props.addNoteItem(_title);
        this.props.handleClose();
    },


    handleChange: function(event) {

        this.setState({value: event.target.value});
    },

    render : function() {

        return (

            <div ref="_dialog">
                <div className="redundancyCheckDialog-text"><span>생성할 노트의 이름을 입력해주세요!</span></div>
                <input id="title" type='text' onChange={this.handleChange} value={this.state.value} />
                <div className="redundancyCheckDialog-btnMenu">
                    <button onClick={this._IsRedundancy} >생성</button>
                    <button onClick={this.props.handleClose} >취소</button>
                </div>
            </div>
        );
    }
});


function _redundancyCheck____(parentNode, noteTitle)
{
    var i;
    for ( i=0; i < parentNode.children.length; i++) {
        var child = parentNode.children[i];
        if(child.name == noteTitle) break;
    }

    if(parentNode.children.length == i)  true;
    else return false;

}

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

function visibleBtn(_nodeId){

    if(_nodeId == 0) return;

    $('#btn_mod'+_nodeId).css("visibility","visible");
    $('#btn_del'+_nodeId).css("visibility","visible");
}

function hiddenBtn(_nodeId){
    $('#btn_mod'+_nodeId).css("visibility","hidden");
    $('#btn_del'+_nodeId).css("visibility","hidden");
}

var DirectoryViewer = React.createClass({


    _initComponent : function(){
        elTree = React.findDOMNode(this.refs.tree1);
        //addFolderDOM = React.findDOMNode(this.refs.btn_addFolder);
    },

    _getDataToDB : function () {

        WebPostUtils.loadDirectory(_username,function(_data){

            var treeData = _data.tree;
            _id = _data.count;

            $(elTree).tree({

                data: treeData,
                autoOpen: true,
                dragAndDrop: true,

                onCreateLi: function(node, $li) {

                    $li.find('.jqtree-title').after('<button className="btn_modNode" id="btn_mod'+ node.id +'" style="visibility:hidden;"> mod </button>');
                    $li.find('.jqtree-title').after('<button className="btn_delNode" id="btn_del'+ node.id +'" style="visibility:hidden;"> del </button>');

                    $('#btn_mod'+lastId).click(function() {
                        var node = $(elTree).tree('getSelectedNode'), nodeParent;
                        var newTitle = 'newTitle...';
                        var treeData, preTreeData=  $(elTree).tree('toJson');

                        nodeParent = (node.type == 'note')? node.parent: node;

                        _redundancyCheck(nodeParent, newTitle,function(err) {

                            if(err == null) {

                                $(elTree).tree('updateNode', node, newTitle);
                                treeData=  $(elTree).tree('toJson');
                                $(elTree).tree('loadData', JSON.parse(preTreeData));

                                console.log(newTitle);
                                if(node.type == 'note') DirectoryActions.renameNote_updateDB(treeData, Constants.DirectoryAPIType.RENAME_NOTE ,newTitle,node.id);
                                else DirectoryActions.renameFolder_updateDB(treeData, Constants.DirectoryAPIType.CHANGE_TREE ,newTitle);
                            }
                            else
                                console.log(err); // 안내 alert 띄움
                        });


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

                    _selectedNode = node;

                    if(preNodeId !=0) hiddenBtn(preNodeId);
                    visibleBtn(node.id);

                    preNodeId = node.id;

                    if(lastId != 0) {

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

    _addNoteToTree : function(_value){

            console.log(_value);

            var noteTitle = _value;
            var notePosition; // 다이얼로그 입력
            var node = $(elTree).tree('getSelectedNode'), nodeParent;
            var treeData, preTreeData=  $(elTree).tree('toJson');

            if (node == false) node = $(elTree).tree('getNodeById', 0);

            notePosition = (node.type == 'note')? 'addNodeAfter':'appendNode';
            nodeParent = (node.type == 'note')? node.parent: node;

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

            /*_redundancyCheck(nodeParent, noteTitle,function(err) {

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
            });*/

    },

    _addFolderToTree : function() {

        $(addFolderDOM).click(function() {

            var folderTitle = 'new_folder' + (_id+1), folderPosition; // 다이얼로그 입력
            var node = $(elTree).tree('getSelectedNode'), nodeParent;
            var treeData, preTreeData=  $(elTree).tree('toJson');

            if (node == false) node = $(elTree).tree('getNodeById', 0);
            folderPosition = (node.type == 'note')? 'addNodeAfter':'appendNode';
            nodeParent = (node.type == 'note')? node.parent: node;

            _redundancyCheck(nodeParent, folderTitle,function(err) {

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

    componentWillMount: function(){
        DirectoryStore.removeTreeChangeListener(this._onChange);
    },

    componentDidMount: function() {

        DirectoryStore.addTreeChangeListener(this._onChange);
        this._initComponent();

        this._getDataToDB();
        this._treeSelectEvent();
        this._bindTreeEvent();
    },

    _onChange: function() {

        $(elTree).tree('loadData', JSON.parse(getTree()));
    },

    _onClose: function() {
        this.d.close();
    },

    handleTrigger: function () {
        this.d = showDialog(<DialogContent addNoteItem={this._addNoteToTree} handleClose={this._onClose} selectedNode={_selectedNode} />,{
            title: <p className="redundancyCheckDialog-title">노트 생성</p>,
            animation: 'zoom',
            maskAnimation: 'fade',
            onBeforeClose: this.beforeClose,
            style: {width: 300}
        });
    },


    render: function() {
        return (

            <div id="directory-viewer">
                <div className="header">디렉토리</div>
                <div className="addNode">
                    <button className = "btn_addNode" onClick={this.handleTrigger} >add note</ button>
                    <button className = "btn_addNode"  ref="btn_addFolder">add folder</ button>
                    </div>
                <div className="content"> <div id="tree1" ref="tree1"
                                               className="directory-viewer-tree"></div>
                </div>
            </div>
        )
    }
});

module.exports = DirectoryViewer;