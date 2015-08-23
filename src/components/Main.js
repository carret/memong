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
                <hr />
                <div className="section3">
                    <div className="section3-inner">
                        <div className="item">
                            <img src="http://placehold.it/200x200" />
                            <div className="main">
                                <span className="header">1. 메모를 생성하세요</span>
                                <span className="content">memongade는 마크다운 기반의 에디터입니다. 여러분들의 노트는 <strong># h1</strong>을 기준으로 메모로 분리됩니다. 여러분들의 메모들은 노트를 이루는 단위가 됩니다. 그리고 쉽게 원하는 내용을 검색할 수 있습니다.</span>
                            </div>
                        </div>
                        <div className="item">
                            <div className="main">
                                <span className="header">2. 내용을 입력하세요</span>
                                <span className="content">여러 헤더들과 링크, 이미지, 리스트 등을 메모안에 입력하세요! 모든 것이 마크다운 기반으로 여러분들의 타이핑이 중심이 됩니다.</span>
                            </div>
                            <img src="http://placehold.it/200x200" />
                        </div>
                        <div className="item">
                            <img src="http://placehold.it/200x200" />
                            <div className="main">
                                <span className="header">3. 편집을 완료하세요</span>
                                <span className="content">memongade는 여러분들이 불필요한 마우스 사용을 하지 않도록 키보드 단축키를 지원합니다. <strong>TAB</strong>을 눌러 다음 메모로 이동하세요. <strong>Shift+Enter</strong>을 눌러 내용 편집을 완료하세요. 여러분들의 손의 움직임을 낭비하지 마세요. 그저 키보드로 타이핑만 하면 됩니다.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="section4">
                    <div className="section4-inner">
                        <span className="title">지금 시작하세요!</span>
                        <span className="content">마크다운 기반의 에디터, memongade로 타이핑 중심의 메모 작성을 경험해보세요.</span>
                        <button className="startNow"><span>시작하기</span></button>
                    </div>
                </div>
                <div className="team-info">
                    <div className="team-info-outer">
                        <div className="team-info-inner">
                            <div className="item">
                                <div className="profile"><img src="http://placehold.it/150x150" /></div>
                                <div className="content">
                                    <span className="name">김재욱</span>
                                    <span className="email">cmdhema@gmail.com</span>
                                </div>
                            </div>
                            <div className="item">
                                <div className="profile"><img src="http://placehold.it/150x150" /></div>
                                <div className="content">
                                    <span className="name">장초롱</span>
                                    <span className="email">crjang91@gmail.com</span>
                                </div>
                            </div>
                            <div className="item">
                                <div className="profile"><img src="http://placehold.it/150x150" /></div>
                                <div className="content">
                                    <span className="name">나석주</span>
                                    <span className="email">seokmaTD@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer">
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