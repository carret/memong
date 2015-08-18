var React = require('react');

var DirectoryViewer = require('./DirectoryViewer/DirectoryViewer');
var MemoViewer = require('./MemoViewer/MemoViewer');
var NoteHeader = require('./NoteHeader/NoteHeader');
var Editor = require('./Editor/Editor');

var AsideDOM;
var SectionDOM;

var cookie = require('react-cookie');

var Main = React.createClass({

    getInitialState: function() {
        return {
            asideVisible: true,
            mainWidth: window.innerWidth
        }
    },


    componentDidMount: function() {
        AsideDOM = $(React.findDOMNode(this.refs._aside));
        SectionDOM = $(React.findDOMNode(this.refs._section));

        window.addEventListener('resize', this._handleResize);

        SectionDOM.css("width", this.state.mainWidth - 502);
    },

    componentWillUnmount: function() {
        window.removeEventListener('resize', this._handleResize);
    },

    _handleResize: function() {
        this.setState({mainWidth: window.innerWidth});
        if (this.state.asideVisible) {
            SectionDOM.css("width", this.state.mainWidth - 502);
        }
        else {
            SectionDOM.css("width", this.state.mainWidth);
        }
    },

    _toggleAside: function() {
        if (!this.state.asideVisible) {
            AsideDOM.removeClass('hide');
            SectionDOM.removeClass('hide');
            SectionDOM.animate({
                "width": this.state.mainWidth - 502
            }, 650);
        }
        else {
            AsideDOM.addClass('hide');
            SectionDOM.addClass('hide');
            SectionDOM.css("width", this.state.mainWidth);
        }
        this.setState({ asideVisible: !this.state.asideVisible });
    },

    render: function() {
        console.log(this.props.isLogin);
        var item = (this.props.isLogin) ?
            (<div>
                <div ref="_aside" id="aside">
                    <DirectoryViewer />
                    <MemoViewer />
                </div>
                <div ref="_section" id="section">
                    <NoteHeader toggleAsideVisible={this._toggleAside} asideVisible={this.state.asideVisible} />
                    <Editor />
                </div>
            </div>)
            :
            (<div>memong은 클라우드 기반 다크다운 메모장입니다.</div>);

        return(
            <div ref="_main" id="main">
                {item}
            </div>
        );
    }
});

module.exports = Main;