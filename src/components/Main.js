var React = require('react');

var DirectoryViewer = require('./DirectoryViewer/DirectoryViewer');
var MemoViewer = require('./MemoViewer/MemoViewer');
var NoteHeader = require('./NoteHeader/NoteHeader');
var Editor = require('./Editor/Editor');

var AsideDOM;
var SectionDOM;

var cookie = require('react-cookie');
var MemoSearcher = require('./MemoSearcher/MemoSearcher');
var Dialog = require('rc-dialog');



var container;

function showDialog(content, props) {
    if (!container) {
        container = document.createElement('div');
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
    render : function() {
        return (
            <div id='loginModel'>
                <div>
                    <a className="facebook-login" href="/login/facebook"><img src="./facebook.png" /><span>Facebook으로 시작하기</span></a>
                </div>
                <div>
                    <a className="google-login" href="/login/google"><img src="./google.png" /><span>Google로 시작하기</span></a>
                </div>
            </div>
        );
    }
});

var Main = React.createClass({
    getInitialState: function() {
        return {
            asideVisible: true,
            mainWidth: window.innerWidth
        }
    },

    handleTrigger: function () {
        this.d = showDialog(<DialogContent />,{
            title: <p className="dialog-title">로그인</p>,
            animation: 'zoom',
            maskAnimation: 'fade',
            onBeforeClose: this.beforeClose,
            style: {width: 400}
        });
    },


    componentDidMount: function() {
        AsideDOM = $(React.findDOMNode(this.refs._aside));
        SectionDOM = $(React.findDOMNode(this.refs._section));

        window.addEventListener('resize', this._handleResize);

        SectionDOM.css("width", this.state.mainWidth - 502);

        if ( cookie.load('username') != null ) {
            this.setState({isLogin:true})
        }
        else {
            this.setState({isLogin:false})
        }

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
            setTimeout(function () {
                SectionDOM.css("width", this.state.mainWidth - 502);
            }.bind(this), 500);
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
                <div className="section1">
                    <div className="section1-inner">
                        <span className="title"><strong># memong</strong></span>
                        <span className="content">노트에 생각을 적고, 생각을 메모로 나누세요.<br />모든 것이 타이핑으로 이루어집니다.</span>
                        <button className="startNow" onClick={this.handleTrigger}><span>시작하기</span></button>
                    </div>
                    <img src="./frontFinal.jpg" />
                </div>
                <div className="section2">
                    <div className="section2-inner">
                        <div className="item">
                            <i className="material-icons">&#xE22B;</i>
                            <span className="context">memong은 웹 클라우드 텍스트 에디터입니다. 여러분의 생각을 적을 수 있습니다. 에버노트와 뭐가 다르냐고요?</span>
                        </div>
                        <div className="item">
                            <i className="material-icons">&#xE245;</i>
                            <span className="context">우선 memong은 마크다운 에디터입니다. 마크다운으로 빠르고 아름다운 타이포그래피를 만들 수 있습니다.</span>
                        </div>
                        <div className="item">
                            <i className="material-icons">&#xE873;</i>
                            <span className="context">또, 하나의 주제에 대한 노트를 만들고 그에 대한 생각들을 메모로 나눌 수 있습니다. memong은 여러분들의 글을 메모 단위로 관리합니다.</span>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="section3">
                    <div className="section3-inner">
                        <div className="item">
                            <img className="img1" src="./front-section3-1.svg" />
                            <div className="main">
                                <span className="header">1. 메모를 생성하세요</span>
                                <span className="content">memong은 마크다운 기반의 에디터입니다. 여러분들의 노트의 내용은 <strong># h1</strong>을 기준으로 메모로 분리됩니다. 여러분들의 메모들은 노트를 이루는 단위가 됩니다. memong은 여러분들의 글을 메모 단위로 관리합니다.</span>
                            </div>
                        </div>
                        <div className="item">
                            <div className="main">
                                <span className="header">2. 내용을 입력하세요</span>
                                <span className="content">여러 헤더들과 링크, 이미지, 리스트 등을 메모안에 입력하세요! 마크다운을 사용하기 때문에 오로지 텍스트로만 이루어집니다. 이는 텍스트만으로도 빠르고 싶게 아름다운 타이포그래피를 만들 수 있도록 합니다.</span>
                            </div>
                            <img className="img2" src="./front-section3-2.svg" />
                        </div>
                        <div className="item">
                            <img className="img3" src="./front-section3-3.svg" />
                            <div className="main">
                                <span className="header">3. 편집을 완료하세요</span>
                                <span className="content">memong은 여러분들이 불필요한 마우스 사용을 하지 않도록 키보드 단축키를 지원합니다. <strong>TAB</strong>을 눌러 다음 메모로 이동하세요. <strong>Shift+Enter</strong>을 눌러 내용 편집을 완료하세요. 여러분들의 손의 움직임을 낭비하지 마세요. 그저 키보드로 타이핑만 하면 됩니다.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="section4">
                    <div className="section4-inner">
                        <span className="title">지금 시작하세요!</span>
                        <span className="content">마크다운 기반의 웹 클라우드 텍스트 에디터, memong으로 타이핑 중심의 메모 작성을 경험해보세요.</span>
                        <button className="startNow" onClick={this.handleTrigger}><span>시작하기</span></button>
                    </div>
                </div>
                <div className="team-info">
                    <div className="team-info-outer">
                        <div className="team-info-inner">
                            <div className="item">
                                <div className="profile"><img src="./kjwook.png" /></div>
                                <div className="content">
                                    <span className="name">김재욱</span>
                                    <span className="email">cmdhema@gmail.com</span>
                                </div>
                            </div>
                            <div className="item">
                                <div className="profile"><img src="./cho.png" /></div>
                                <div className="content">
                                    <span className="name">장초롱</span>
                                    <span className="email">crjang91@gmail.com</span>
                                </div>
                            </div>
                            <div className="item">
                                <div className="profile"><img src="./seokju.png" /></div>
                                <div className="content">
                                    <span className="name">나석주</span>
                                    <span className="email">seokmaTD@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <span className="copyRight">COPYRIGHT © 2015 memong</span>
                    <span className="git"><a href="https://github.com/carret/memong">Git</a></span>
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