'use strict';

var React = require('react');

var MemoViewer = require('./components/MemoViewer/MemoViewer');
var Editor = require('./components/Editor/Editor');
var MemoActions = require('./actions/MemoActions');
var Header = require('./components/Header/Header');
MemoActions.initMemo([]);

React.render(React.createElement(
    'div',
    { className: 'app' },
    React.createElement(Header, null),
    React.createElement(
        'div',
        { className: 'content' },
        React.createElement(MemoViewer, null),
        React.createElement(Editor, null)
    )
), document.getElementById('app'));
'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var MemoActionConstants = require('../constants/MemoActionConstants');

var MemoActions = {
    initMemo: function initMemo(_memos) {
        AppDispatcher.handleClientAction({
            actionType: MemoActionConstants.INIT_MEMO,
            memos: _memos
        });
    },

    addMemo: function addMemo(_targetEditMemo, _context) {
        AppDispatcher.handleClientAction({
            actionType: MemoActionConstants.ADD_MEMO,
            targetEditMemo: _targetEditMemo,
            context: _context
        });
    },

    deleteMemo: function deleteMemo(_targetCompleteMemo) {
        AppDispatcher.handleClientAction({
            actionType: MemoActionConstants.DELETE_MEMO,
            targetCompleteMemo: _targetCompleteMemo
        });
    },

    startEditMemo: function startEditMemo(_targetCompleteMemo) {
        AppDispatcher.handleClientAction({
            actionType: MemoActionConstants.START_EDIT_MEMO,
            targetCompleteMemo: _targetCompleteMemo
        });
    },

    completeEditMemo: function completeEditMemo(_targetEditMemo) {
        AppDispatcher.handleClientAction({
            actionType: MemoActionConstants.END_EDIT_MEMO,
            targetEditMemo: _targetEditMemo
        });
    }
};

module.exports = MemoActions;
'use strict';

var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
    INIT_MEMO: null,
    ADD_MEMO: null,
    DELETE_MEMO: null,
    START_EDIT_MEMO: null,
    END_EDIT_MEMO: null
});
'use strict';

var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
    COMPLETE_MEMO: null,
    EDIT_MEMO: null,
    NONE_MEMO: null,
    GLOBAL_EDIT_MEMO: null
});
'use strict';

var Dispatcher = require('flux').Dispatcher;

var AppDispatcher = new Dispatcher();

AppDispatcher.handleClientAction = function (action) {
    this.dispatch({
        source: 'VIEW_ACTION',
        action: action
    });
};

AppDispatcher.handleServerAction = function (action) {
    this.dispatch({
        source: 'SERVER_ACTION',
        action: action
    });
};

module.exports = AppDispatcher;
'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MemoActionConstants = require('../constants/MemoActionConstants');
var MemoTypeConstants = require('../constants/MemoTypeConstants');
var _ = require('underscore');
var sui = require('simple-unique-id');

//Memo Data
var _memos = [];
var globalEditMemo = {
    id: sui.generate("globalEditMemo"),
    name: null,
    value: "",
    type: MemoTypeConstants.GLOBAL_EDIT_MEMO
};
var matches = [];

//Private Function
//비공개 함수 영역입니다. 데이터를 수정합니다.

//서버로부터 불러온 초기 메모 데이터 설정
function initMemo(memos) {
    _memos = _memos.concat(memos);
    _memos.push(_.extend({}, globalEditMemo));
}

function addMemo(_targetEditMemo, _context) {
    var index = _indexOf(_memos, _targetEditMemo.id, "id");
    var newMemo = _.extend({}, {
        value: _context
    });
    _parseMemo(newMemo);

    _memos.splice(index, 0, newMemo);
}

function deleteMemo(_targetMemo) {
    var index = _indexOf(_memos, _targetMemo.id, "id");
    _memos.splice(index, 1);
}

function startEditMemo(_targetCompleteMemo) {
    var index = _indexOf(_memos, _targetCompleteMemo.id, "id");
    if (index == _memos.length - 2) {
        var value = _memos[index].value + _.last(_memos).value;
        _memos.splice(index, 2);
        _memos.push(_.extend(globalEditMemo, {
            id: sui.generate(value),
            value: value
        }));
    } else {
        _targetCompleteMemo.type = MemoTypeConstants.EDIT_MEMO;
        _memos[index] = _.extend({}, _memos[index], _targetCompleteMemo);
    }
}

function endEditMemo(_targetEditMemo) {
    var index = _indexOf(_memos, _targetEditMemo.id, "id");
    _parseMemo(_targetEditMemo);

    _memos[index] = _.extend({}, _memos[index], _targetEditMemo);
}

//Helper Function
//도우미 함수입니다.
// _indexOf: 메모의 위치를 찾습니다.
// _parseMemo: 메모의 내용을 입력받아 저장 가능한 메모로 반환합니다.
function _indexOf(arr, searchId, property) {
    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i][property] === searchId) return i;
    }
    return -1;
}

function _parseMemo(memo) {
    var props = {};

    matches = memo.value.match(/^(#)[ \t].+/gm);

    if (matches != undefined) {
        if (matches.length == 1) {
            props.name = matches[0].slice(2, matches[0].length);
            props.type = MemoTypeConstants.COMPLETE_MEMO;
        } else {
            throw Error("Fatal Error: 잘못된 메모입니다. 다시 코딩하세요. 이 오류는 나와서는 안됩니다.");
        }
    } else {
        props.name = "none-memo";
        props.type = MemoTypeConstants.NONE_MEMO;
    }

    props.id = sui.generate(props.name);
    return _.extend(memo, props);
}

//Public Function
//공개 함수 영역입니다. 데이터를 반환합니다.
var MemoStore = _.extend({}, EventEmitter.prototype, {
    getMemo: function getMemo() {
        return _memos;
    },

    emitChange: function emitChange() {
        this.emit('change'); //데이터가 변경됬을 때, 이벤트를 발생합니다.
    },

    addChangeListener: function addChangeListener(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function removeChangeListener(callback) {
        this.removeListener('change', callback);
    }
});

//Regist Callback Function
//디스패처에 Store의 콜백 함수를 등록합니다.
AppDispatcher.register(function (payload) {
    var action = payload.action;

    switch (action.actionType) {
        case MemoActionConstants.INIT_MEMO:
            initMemo(action.memos);
            break;

        case MemoActionConstants.ADD_MEMO:
            addMemo(action.targetEditMemo, action.context);
            break;

        case MemoActionConstants.DELETE_MEMO:
            deleteMemo(action.targetCompleteMemo);
            break;

        case MemoActionConstants.START_EDIT_MEMO:
            startEditMemo(action.targetCompleteMemo);
            break;

        case MemoActionConstants.END_EDIT_MEMO:
            endEditMemo(action.targetEditMemo);
            break;

        default:
            return true;
    }

    MemoStore.emitChange(); //데이터가 변경됬음을 ControllView(components/Editor)에 알립니다.
    return true;
});

module.exports = MemoStore;
'use strict';

var React = require('react');
var MemoActions = require('../../actions/MemoActions');
var Remarkable = require('remarkable');
var md = new Remarkable({
    html: false, // Enable HTML tags in source
    xhtmlOut: false, // Use '/' to close single tags (<br />)
    breaks: true, // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-', // CSS language prefix for fenced blocks
    linkify: false, // Autoconvert URL-like text to links
    typographer: false,
    quotes: '“”‘’'
});

var CompleteMemo = React.createClass({
    displayName: 'CompleteMemo',

    startEditMemo: function startEditMemo() {
        MemoActions.startEditMemo(this.props.memo);
    },

    render: function render() {
        var context = md.render(this.props.memo.value);
        return React.createElement(
            'div',
            { className: 'complete-memo', onClick: this.startEditMemo },
            React.createElement('div', { dangerouslySetInnerHTML: { __html: context } })
        );
    }
});

module.exports = CompleteMemo;
'use strict';

var React = require('react');
var MemoActions = require('../../actions/MemoActions');
var MemoTypeConstants = require('../../constants/MemoTypeConstants');
var MemoActionConstants = require('../../constants/MemoActionConstants');
var _ = require('underscore');

var Textarea = require('react-textarea-autosize');

var regEx = /^(#)[ \t].+/gm;
var matches = new Array();

var EditMemo = React.createClass({
    displayName: 'EditMemo',

    getInitialState: function getInitialState() {
        return {
            value: this.props.memo.value,
            actionType: MemoActionConstants.END_EDIT_MEMO
        };
    },

    componentDidMount: function componentDidMount() {
        var value = this.props.memo.value;
        React.findDOMNode(this.refs._textarea).selectionStart = value.length;
        React.findDOMNode(this.refs._textarea).selectionEnd = value.length;
        React.findDOMNode(this.refs._textarea).focus();
    },

    _handleValueInput: function _handleValueInput(_value) {
        this.setState({ value: _value });

        var value = this.state.value;
        matches = value.match(regEx);

        if (matches != undefined) {
            if (matches.length == 2) {
                this.setState({ actionType: MemoActionConstants.ADD_MEMO }, function () {
                    React.findDOMNode(this.refs._textarea).blur();
                });
            }
        }
    },

    _handleAction: function _handleAction() {
        var value = this.state.value;
        var result = "";

        switch (this.state.actionType) {
            case MemoActionConstants.END_EDIT_MEMO:
                result = value;
                MemoActions.completeEditMemo(_.extend({}, this.props.memo, {
                    value: result
                }));
                break;

            case MemoActionConstants.ADD_MEMO:
                matches = value.match(regEx);
                result = value.slice(0, value.indexOf(matches[1], matches[0].length));
                this.setState({ value: value.slice((value.indexOf(matches[1], matches[0].length), value.length)) });

                MemoActions.addMemo(this.props.memo, result);
                React.findDOMNode(this.refs._textarea).focus();
                break;
        }
    },

    render: function render() {
        var valueLink = {
            value: this.state.value,
            requestChange: this._handleValueInput
        };

        return React.createElement(
            'div',
            { className: 'edit-memo' },
            React.createElement(Textarea, { ref: '_textarea',
                className: 'edit-memo-textarea',
                valueLink: valueLink,
                onBlur: this._handleAction
            })
        );
    }
});

module.exports = EditMemo;
//Component Type: Controll View

'use strict';

var React = require('react');
var MemoStore = require('../../stores/MemoStore');
var MemoTypeConstants = require('../../constants/MemoTypeConstants');
var _ = require('underscore');

var CompleteMemo = require('./CompleteMemo');
var EditMemo = require('./EditMemo');
var GlobalEditMemo = require('./GlobalEditMemo');
var NoneMemo = require('./NoneMemo');

function getMemos() {
    return {
        memos: MemoStore.getMemo()
    };
}

var Editor = React.createClass({
    displayName: 'Editor',

    getInitialState: function getInitialState() {
        return getMemos();
    },

    componentDidMount: function componentDidMount() {
        MemoStore.addChangeListener(this._onChange); //Store의 데이터 변경을 감지하는 Listener 등록
    },

    componentWillUnmount: function componentWillUnmount() {
        MemoStore.removeChangeListener(this._onChange); //Listener 삭제
    },

    render: function render() {
        var items = _.map(this.state.memos, function (memo) {
            var type = memo.type;
            switch (type) {
                case MemoTypeConstants.COMPLETE_MEMO:
                    return React.createElement(CompleteMemo, { memo: memo, key: memo.id });

                case MemoTypeConstants.EDIT_MEMO:
                    return React.createElement(EditMemo, { memo: memo, key: memo.id });

                case MemoTypeConstants.NONE_MEMO:
                    return React.createElement(NoneMemo, { memo: memo, key: memo.id });

                case MemoTypeConstants.GLOBAL_EDIT_MEMO:
                    return React.createElement(GlobalEditMemo, { memo: memo, key: memo.id });
            }
        });

        return React.createElement(
            'div',
            { className: 'editor' },
            items
        );
    },

    _onChange: function _onChange() {
        this.setState(getMemos()); //Store의 데이터가 변경되었을 시 데이터를 불러온다.
        console.log(this.state.memos);
    }
});

module.exports = Editor;
'use strict';

var React = require('react');
var MemoActions = require('../../actions/MemoActions');
var MemoActionConstants = require('../../constants/MemoActionConstants');
var MemoTypeConstants = require('../../constants/MemoTypeConstants');
var _ = require('underscore');

var Textarea = require('react-textarea-autosize');

var regEx = /^(#)[ \t].+/gm;
var matches = new Array();

var GlobalEditMemo = React.createClass({
    displayName: 'GlobalEditMemo',

    getInitialState: function getInitialState() {
        return {
            value: this.props.memo.value,
            actionType: MemoActionConstants.END_EDIT_MEMO
        };
    },

    componentDidMount: function componentDidMount() {
        var value = this.props.memo.value;
        React.findDOMNode(this.refs._textarea).selectionStart = value.length;
        React.findDOMNode(this.refs._textarea).selectionEnd = value.length;
        React.findDOMNode(this.refs._textarea).focus();
    },

    _handleValueInput: function _handleValueInput(_value) {
        this.setState({ value: _value });

        var value = this.state.value;
        matches = value.match(regEx);

        if (matches != undefined) {
            if (matches.length == 2) {
                this.setState({ actionType: MemoActionConstants.ADD_MEMO }, function () {
                    React.findDOMNode(this.refs._textarea).blur();
                });
            }
        }
    },

    _handleAction: function _handleAction() {
        var value = this.state.value;
        var result = "";
        var updateValue = "";

        switch (this.state.actionType) {
            case MemoActionConstants.END_EDIT_MEMO:
                if (value == "") {
                    return;
                }
                result = value;
                this.setState({ value: "" });
                break;

            case MemoActionConstants.ADD_MEMO:
                matches = value.match(regEx);
                result = value.slice(0, value.indexOf(matches[1], matches[0].length));
                updateValue = value.slice(value.indexOf(matches[1], matches[0].length), value.length);
                this.setState({
                    value: updateValue,
                    actionType: MemoActionConstants.END_EDIT_MEMO
                });
                break;
        }
        MemoActions.addMemo(_.extend(this.props.memo, {
            value: updateValue
        }), result);
        React.findDOMNode(this.refs._textarea).focus();
    },

    render: function render() {
        var valueLink = {
            value: this.state.value,
            requestChange: this._handleValueInput
        };
        return React.createElement(
            'div',
            { className: 'global-edit-memo' },
            React.createElement(Textarea, { ref: '_textarea',
                className: 'global-edit-memo-textarea',
                valueLink: valueLink,
                onBlur: this._handleAction
            })
        );
    }
});

module.exports = GlobalEditMemo;
'use strict';

var React = require('react');
var MemoActions = require('../../actions/MemoActions');
var Remarkable = require('remarkable');
var md = new Remarkable({
    html: false, // Enable HTML tags in source
    xhtmlOut: false, // Use '/' to close single tags (<br />)
    breaks: true, // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-', // CSS language prefix for fenced blocks
    linkify: false, // Autoconvert URL-like text to links
    typographer: false,
    quotes: '“”‘’'
});

var NoneMemo = React.createClass({
    displayName: 'NoneMemo',

    startEditMemo: function startEditMemo() {
        MemoActions.startEditMemo(this.props.memo);
    },

    render: function render() {
        var context = md.render(this.props.memo.value);
        return React.createElement(
            'div',
            { className: 'none-memo', onClick: this.startEditMemo },
            React.createElement('div', { dangerouslySetInnerHTML: { __html: context } })
        );
    }
});

module.exports = NoneMemo;
'use strict';

var React = require('react');
var Autosuggest = require('react-autosuggest');

var suburbs = ['Cheltenham', 'Mill Park', 'Mordialloc', 'Nunawading'];

var AutoInput = React.createClass({
    displayName: 'AutoInput',

    getSuggestion: function getSuggestion(input, callback) {
        var regex = new RegExp('^' + input, 'i');
        var suggestions = suburbs.filter(function (suburb) {
            return regex.test(suburb);
        });

        callback(null, suggestions);
    },
    render: function render() {
        return React.createElement(Autosuggest, { suggestions: this.getSuggestion });
    }
});

module.exports = AutoInput;
'use strict';

var React = require('react');
var LoginDialog = require('./LoginDialog');
var AutoInput = require('./AutoInput');
var mui = require('material-ui');
var Dialog = mui.Dialog;

var Header = React.createClass({
    displayName: 'Header',

    render: function render() {
        return React.createElement(AutoInput, null)
        //<nav className="navbar navbar-inverse navbar-fixed-top">
        //    <div className="container">
        //        <div className="navbar-header">
        //            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
        //                <span className="sr-only">Toggle navigation</span>
        //                <span className="icon-bar"></span>
        //                <span className="icon-bar"></span>
        //                <span className="icon-bar"></span>
        //            </button>
        //            <a className="navbar-brand">memong</a>
        //        </div>
        //        <div id="navbar" className="navbar-collapse collapse">
        //            <form className="navbar-form navbar-right">
        //                <div className="form-group">
        //
        //                </div>
        //                <button type="submit" className="btn btn-success" onClick={this.showLoginDialog}>Sign in</button>
        //            </form>
        //        </div>
        //    </div>
        //</nav>
        ;
    },
    showLoginDialog: function showLoginDialog() {
        this.refs.dialog.show();
    }
});

module.exports = Header;
/**
 * Created by Jaewook on 2015-08-01.
 */
'use strict';

var React = require('react');
var mui = require('material-ui');
var Dialog = mui.Dialog;

var LoginDialog = React.createClass({
    displayName: 'LoginDialog',

    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    _onDialogSubmit: function _onDialogSubmit() {},
    render: function render() {

        //Standard Actions
        var standardActions = [{ text: 'Cancel' }, { text: 'Submit', onTouchTap: this._onDialogSubmit, ref: 'submit' }];

        return React.createElement(
            'div',
            null,
            React.createElement(
                Dialog,
                {
                    title: 'Super Secret Password',
                    actions: standardActions,
                    ref: 'loginDialog' },
                '1-2-3-4-5'
            )
        );
    }
});

module.exports = LoginDialog;
"use strict";

/**
 * Created by Jaewook on 2015-08-05.
 */
// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
'use strict';

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  escapeRegexCharacters: escapeRegexCharacters
};
'use strict';

var React = require('react');
var MemoActions = require('../../actions/MemoActions');

var MemoItem = React.createClass({
    displayName: 'MemoItem',

    _onDelete: function _onDelete() {
        MemoActions.deleteMemo(this.props.memo);
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'memo-viewer-item' },
            React.createElement(
                'div',
                { className: 'memo-viewer-item-name' },
                React.createElement(
                    'h3',
                    null,
                    this.props.memo.name
                )
            ),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'button',
                    { className: 'memo-viewer-item-button', onClick: this._onDelete },
                    '삭제'
                )
            )
        );
    }
});

module.exports = MemoItem;
'use strict';

var React = require('react');
var MemoStore = require('../../stores/MemoStore');
var MemoTypeConstants = require('../../constants/MemoTypeConstants');
var _ = require('underscore');

var MemoItem = require('./MemoItem');

function getMemos() {
    return {
        memos: MemoStore.getMemo()
    };
}

var MemoViewer = React.createClass({
    displayName: 'MemoViewer',

    getInitialState: function getInitialState() {
        return getMemos();
    },

    componentDidMount: function componentDidMount() {
        MemoStore.addChangeListener(this._onChange); //Store의 데이터 변경을 감지하는 Listener 등록
    },

    componentWillUnmount: function componentWillUnmount() {
        MemoStore.removeChangeListener(this._onChange); //Listener 삭제
    },

    _onChange: function _onChange() {
        this.setState(getMemos()); //Store의 데이터가 변경되었을 시 데이터를 불러온다.
        console.log(this.state.memos);
    },

    render: function render() {
        var items = _.map(this.state.memos, function (memo) {
            if (memo.type == MemoTypeConstants.COMPLETE_MEMO) {
                return React.createElement(MemoItem, { memo: memo, id: memo.id });
            }
        });

        return React.createElement(
            'div',
            { className: 'memo-viewer' },
            items
        );
    }
});

module.exports = MemoViewer;
//# sourceMappingURL=all.js.map