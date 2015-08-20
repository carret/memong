var React = require('react');
var jqtree = require('jqtree');
var directoryTreeDOM, addNoteDOM, addFolderDOM;

var DirectoryViewer = React.createClass({

    componentDidMount: function() {

        directoryTreeDOM = React.findDOMNode(this.refs.tree1);
        addNoteDOM = React.findDOMNode(this.refs.btn_addN);
        addFolderDOM = React.findDOMNode(this.refs.btn_addF);



        var data = [
            {
                label: 'node1', id: 1,
                children: [
                    { label: 'child1', id: 2 },
                    { label: 'child2', id: 3 }
                ]
            },
            {
                label: 'node2', id: 4,
                children: [
                    { label: 'child3', id: 5 }
                ]
            }
        ];

        $(directoryTreeDOM).tree({
            data: data,
            autoOpen: true,
            dragAndDrop: true,

            onCreateLi: function(node, $li) {
                $li.find('.jqtree-title').after('<a class="icon_mod">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    mod</a>');
                $li.find('.jqtree-title').after('<a class="icon_del">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; del</a>');
            }
        });


        $(addNoteDOM).click(function()
        {
            console.log($(directoryTreeDOM));
            var node1 = $((directoryTreeDOM), 'getNodeByName', 'child1');
            console.log(node1);
            $(directoryTreeDOM).tree(
                'addNodeAfter',
                {
                    label: 'new_node',
                    id: 456
                },
                node1
            );

        });
    },

    render: function() {
        return (
            <div id="directory-viewer">
                <div className="header">디렉토리</div>
                <div className="addNode">
                    <button ref="btn_addN">add note</ button>
                    <button ref="btn_addF">add folder</ button> </div>
                <div className="content"> <div ref="tree1"
                                               className="directory-viewer-tree"></div> </div>
            </div>
        )
    }
});

module.exports = DirectoryViewer;