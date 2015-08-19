var React = require('react');
var Dialog = require('rc-dialog');

var MemoActionCreator = require('../../actions/MemoActionCreator');


var container;

function showDialog(content, props) {
    if (!container) {
        container = document.createElement('div');
        container.setAttribute("id", "memoDeleteDialog");
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
    getInitialState : function() {
        return {
            value:''
        }
    },

    componentDidMount: function() {
        $(React.findDOMNode(this.refs._dialog)).on("keydown", function(event) {
            event.preventDefault();
            if (event.keyCode == 13) {
                this.props.deleteItem();
            }
        });
    },

    _deleteItem: function() {
        this.props.deleteItem();
        this.props.handleClose();
    },

    render : function() {
        return (
            <div ref="_dialog">
                <div className="memoDeleteDialog-text"><span>정말로 삭제하시겠습니까?</span></div>
                <div className="memoDeleteDialog-btnMenu">
                    <button onClick={this._deleteItem} >예</button>
                    <button onClick={this.props.handleClose} >아니요</button>
                </div>
            </div>
        );
    }
});


var MemoItem = React.createClass({
    _onDelete: function() {
        MemoActionCreator.deleteMemo(this.props.memo);
    },

    _onClose: function() {
        this.d.close();
    },

    handleTrigger: function () {
        this.d = showDialog(<DialogContent deleteItem={this._onDelete} handleClose={this._onClose} />,{
            title: <p className="memoDeleteDialog-title">메모 삭제</p>,
            animation: 'zoom',
            maskAnimation: 'fade',
            onBeforeClose: this.beforeClose,
            style: {width: 300}
        });
    },

    _onEditStart: function() {
        MemoActionCreator.startEditMemoFromMemoViewer(this.props.memo);
    },

    render: function() {
        return (
            <div className="memo-viewer-item">
                <span className="title" onClick={this._onEditStart}>
                    {this.props.memo.title}
                </span>
                <div>
                    <button className="btn_delete" onClick={this.handleTrigger}>
                        <i className="material-icons">&#xE872;</i>
                    </button>
                </div>
            </div>
        );
    }
});

module.exports = MemoItem;