var React = require('react');

var DirectoryViewer = require('./DirectoryViewer/DirectoryViewer');
var MemoViewer = require('./MemoViewer/MemoViewer');
var NoteHeader = require('./NoteHeader/NoteHeader');
var Editor = require('./Editor/Editor');

var AsideDOM;
var SectionDOM;

var Description = require('./Description');
var Editor = require('./Editor');

var Main = React.createClass({

    render: function() {
        return(

            <div ref="_main" id="main">
                <div ref="_aside" id="aside">
                    <DirectoryViewer />
                    <MemoViewer />
                </div>
                <div ref="_section" id="section">
                    <NoteHeader toggleAsideVisible={this._toggleAside} asideVisible={this.state.asideVisible} />
                    <Editor />
                </div>
            </div>
        );
    }
});

module.exports = Main;