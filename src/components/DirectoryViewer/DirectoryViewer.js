var React = require('react');
var jqtree = require('jqtree');
var Dialog = require('rc-dialog');

var WebGetUtils = require('../../utils/WebGetUtils');
var Constants = require('../../constants/Constants');
var DirectoryActionCreator = require('../../actions/DirectoryActionCreator');
var NoteStore = require('../../stores/NoteStore');

var RemoveDialog = require('./RemoveDialog');
var TitleCheckingDialog = require('./TitleCheckingDialog');


var elTree, container;
var _id, _selectedNode = null, _selectedNoteId = 0;
var lastId= 0, preNodeId = 0;


function showDialog(content, props) {
    if (!container) {
        container = document.createElement('div');
        container.setAttribute("id", "redundancyCheckDialog");
        document.body.appendChild(container);
    }

    var close = props.onClose;
    props.onClose = function() {
        if(close) { close(); }
        React.unmountComponentAtNode(container);
    };

    var dialog = React.render(<Dialog {...props} renderToBody={false}>{content}</Dialog>, container);
    dialog.show();
    return dialog;
}


function blockBtn(_nodeId){
    if(_nodeId == 0) return;
    $('#btn_mod'+_nodeId).css("display","inline");
    $('#btn_del'+_nodeId).css("display","inline");
}
function noneBtn(_nodeId){
    $('#btn_mod'+_nodeId).css("display","none");
    $('#btn_del'+_nodeId).css("display","none");
}


var DirectoryViewer = React.createClass({
    _initComponent : function(){
        elTree = React.findDOMNode(this.refs.tree1);
    },

    _getDataToDB : function () {
        var that = this;

        WebGetUtils.getDirectory(function(_data) {
            var treeData = _data.tree;
            _id = _data.count;

            $(elTree).tree({
                data: treeData,
                autoOpen: true,
                dragAndDrop: true,
                keyboardSupport: false,

                onCreateLi: function(node, $li) {
                    switch(node.type) {
                        case 'folder':
                            $li.find('.jqtree-title').before('<span class="node-icon"><i class="material-icons">&#xE2C7;</i></span>');
                            break;

                        case 'note':
                            $li.find('.jqtree-title').before('<span class="node-icon isNote"><i class="material-icons">&#xE873;</i></span>');
                            break;
                    }

                    $li.find('.jqtree-title').after('<button class="btn_delNode" id="btn_del'+ node.id +'" style="display:none;">' + '<i class="material-icons">&#xE872;</i></button>');
                    $li.find('.jqtree-title').after('<button class="btn_modNode" id="btn_mod'+ node.id +'" style="display:none;">' + '<i class="material-icons">&#xE3C9;</i></button>');


                    $('#btn_mod'+lastId).bind( 'click', that.handleTrigger_RenameNode );
                    $('#btn_del'+lastId).bind( 'click', that.handleTrigger_RemoveNode );

                    lastId = node.id;
                }
            });
        });
    },

    /* FOR BIND TREE EVENT */
    _treeClickEvent : function(event){
        if (event.node) {
            var node = event.node;

            if(_selectedNode == node) { event.preventDefault(); return; }

            _selectedNode = node;
            if (node.type == 'note') {
                DirectoryActionCreator.requestNote(_selectedNode.id);
            }

            if (preNodeId != 0) { noneBtn(preNodeId); }
            blockBtn(node.id);

            preNodeId = node.id;

            if (lastId != 0) {
                $('#btn_mod'+lastId).bind('click', this.handleTrigger_RenameNode );
                $('#btn_del'+lastId).bind('click', this.handleTrigger_RemoveNode );
                lastId = 0;
            }
        }
    },

    _treeMoveEvent : function(event) {
        var treeData;

        if(event.move_info.target_node.type == "note" && event.move_info.position == "inside") { event.preventDefault(); }
        else if(event.move_info.moved_node.id == 0) { event.preventDefault(); }
        else if(event.move_info.target_node.id == 0 && event.move_info.position == 'before') { event.preventDefault(); }
        else {
            event.move_info.do_move();
            treeData = $(elTree).tree('toJson');
            DirectoryActionCreator.moveNode_updateDB(treeData, Constants.DirectoryAPIType.CHANGE_TREE);
        }

    },

    _treeInitEvent : function(){
        this._onChange();
    },

    _bindTreeEvent: function() {
        var that = this;

        $(elTree).bind(
            'tree.click', function(event){ that._treeClickEvent(event); } );

        $(elTree).bind(
            'tree.move', function(event){ that._treeMoveEvent(event); } );

        $('#tree1').bind(
            'tree.init',  function(event){ that._treeInitEvent() }  );
    },

    /* FOR USER EVENT TRIGGER */
    _addNodeToTree : function(_title, _type){
        var position;
        var node = $(elTree).tree('getSelectedNode');
        var treeData;

        if (node == false) { node = $(elTree).tree('getNodeById', 0); }
        position = (node.type == 'note')? 'addNodeAfter':'appendNode';

        $(elTree).tree(
            position,
            {
                label: _title,
                type: _type,
                id: _id++
            },
            node
        );
        treeData = $(elTree).tree('toJson');

        if(_type == 'note') { DirectoryActionCreator.addNote_updateDB(treeData, Constants.DirectoryAPIType.ADD_NOTE, _title); }
        else { DirectoryActionCreator.addFolder_updateDB(treeData, Constants.DirectoryAPIType.ADD_FOLDER);
            this._onChange();}
    },

    _renameNode : function(_title, _type, _node) {
        var node = _node;
        var treeData;

        $(elTree).tree('updateNode', node, _title);
        treeData = $(elTree).tree('toJson');

        this._onChange();

        if (node.type == 'note') DirectoryActionCreator.renameNote_updateDB(treeData, Constants.DirectoryAPIType.RENAME_NOTE, _title, node.id);
        else  DirectoryActionCreator.renameFolder_updateDB(treeData, Constants.DirectoryAPIType.CHANGE_TREE, _title);
    },

    _deleteNode : function(treeData, node, childrenOfFolder) {

        if(node.type=='note') { DirectoryActionCreator.deleteNote_updateDB(treeData, Constants.DirectoryAPIType.DELETE_NOTE, node.id); }
        else { DirectoryActionCreator.deleteFolder_updateDB(treeData, Constants.DirectoryAPIType.DELETE_FOLDER, childrenOfFolder); }
    },

    _onChange : function(){
        var selector;

        if(_selectedNode != null) { blockBtn(_selectedNode.id);}
        if(_selectedNoteId != 0) {
            selector = $('#btn_mod'+_selectedNoteId);
            selector.parent().children('span').css('font-weight','normal');
        }

        _selectedNoteId = NoteStore.getNoteNodeID();
        selector = $('#btn_mod'+_selectedNoteId);
        selector.parent().children('span').css('font-weight','800');
    },

    componentWillMount : function(){
        NoteStore.removeInitListener(this._onChange);
    },
    componentDidMount: function() {
        NoteStore.addInitListener(this._onChange);

        this._initComponent();
        this._getDataToDB();
        this._bindTreeEvent();
    },

    _onClose: function() {
        this.d.close();
    },

    handleTrigger_AddNote: function () {
        this.d = showDialog(<TitleCheckingDialog actionItem={this._addNodeToTree} handleClose={this._onClose} elTree={$(elTree)} selectedNode={_selectedNode}  type='note'/>,{
            title: <p className="redundancyCheckDialog-title">노트 생성</p>,
            animation: 'zoom',
            maskAnimation: 'fade',
            onBeforeClose: this.beforeClose,
            style: {width: 300}
        });
    },

    handleTrigger_AddFolder: function () {
        this.d = showDialog(<TitleCheckingDialog actionItem={this._addNodeToTree} handleClose={this._onClose} elTree={$(elTree)}  selectedNode={_selectedNode}  type='folder'/>,{
            title: <p className="redundancyCheckDialog-title">폴더 생성</p>,
            animation: 'zoom',
            maskAnimation: 'fade',
            onBeforeClose: this.beforeClose,
            style: {width: 300}
        });
    },

    handleTrigger_RenameNode: function () {

        this.d = showDialog(<TitleCheckingDialog actionItem={this._renameNode} handleClose={this._onClose} elTree={$(elTree)}  selectedNode={_selectedNode} type='rename'/>,{
            title: <p className="redundancyCheckDialog-title">타이틀 변경</p>,
            animation: 'zoom',
            maskAnimation: 'fade',
            onBeforeClose: this.beforeClose,
            style: {width: 300}
        });
    },

    handleTrigger_RemoveNode: function () {
        this.d = showDialog(<RemoveDialog actionItem={this._deleteNode} handleClose={this._onClose} elTree={$(elTree)} selectedNode={_selectedNode} type='remove'/>,{
            title: <p className="confirmDialog-title">아이템 삭제</p>,
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
                    <button className = "btn_addNode" onClick={this.handleTrigger_AddNote} >노트 추가하기</ button>
                    <button className = "btn_addNode" onClick={this.handleTrigger_AddFolder} >폴더 추가하기</ button>
                </div>
                <div className="content"> <div id="tree1" ref="tree1" className="directory-viewer-tree"></div></div>
            </div>
        )
    }
});

module.exports = DirectoryViewer;