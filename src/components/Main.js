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
            (<div id="front">
                <div className="section1"><img src="./front.jpg" /></div>
                <div className="section2">
                    <div className="section2-inner">
                        <div className="item">
                            <i className="material-icons">&#xE22B;</i>
                            <span className="context">memongade는 에디터입니다. 여러분의 생각과 회의 내용을 적을 수 있습니다. 에버노트와 뭐가 다르냐고요?</span>
                        </div>
                        <div className="item">
                            <i className="material-icons">&#xE245;</i>
                            <span className="context">우선 memongade는 마크다운 기반입니다. 마크다운에 능숙한 여러분은 쉽게 메모를 작성할 수 있습니다.</span>
                        </div>
                        <div className="item">
                            <i className="material-icons">&#xE873;</i>
                            <span className="context">또, 하나의 노트에 여러 메모를 작성합니다. 여러분이 글을 분리하지 마세요. 여러 생각을 하나의 노트에 모으세요.</span>
                        </div>
                    </div>
                </div>
            </div>);

        return(
            <div ref="_main" id="main">
                {item}
            </div>
        );
    }
});

module.exports = Main;