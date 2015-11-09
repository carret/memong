# memong

### 소개
[memong](http://memong.xyz)은 웹 클라우드 텍스트 에디터입니다. [memong](http://memong.xyz)의 특징은 다음과 같습니다.

1. 마크다운을 지원합니다.
2. 텍스트 내용을 ``메모``라는 단위로 구분하여 관리합니다.
3. 타이핑 중심의 텍스트 에디터로 키보드 단축키를 지원합니다.


해당 프로젝트의 팀 커뮤니티로 [Trello](https://trello.com/b/T4XVwb2J/carret)를 사용하였습니다.


### 팀원
* 김재욱 (cmdhema@gmail.com)
* 장초롱 (crjang91@gmail.com)
* 나석주 (seokmaTD@gmail.com)


## 문서
* 한국어
	* [소개](https://github.com/carret/memong/blob/master/docs/KR/Introduction(KR).md)
	* API Reference

* English
	* [Introduction](https://github.com/carret/memong/blob/master/docs/EN/Introduction(EN).md)
	* API Reference



### 디렉토리 구성

```
.
├── /assets/                    # Image Aseets
├── /build/                     # 컴파일 아웃풋(Compile Output)
├── /docs/                      # 문서
├── /node_modules/              # 노드 모듈
├── /routes/                    # 서버 라우터
│   ├── /api/                   # WebAPI
│   └── /routes.js              # 라우터
├── /models/                    # MongoDB 모델(Model)
├── /src/                       # 소스 코드(Source Codes)
│   ├── /actions/               # Flux - 액션 생성기(action creator)
│   ├── /components/            # Flux - React 컴포넌트
│   ├── /constants/             # 상수(Constants)
│   ├── /dispatcher/            # Flux - Dispathcer
│   ├── /stores/                # Flux - Store
│   ├── /styles/                # Less Stylesheet
│   ├── /utils/                 # WebAPI 유틸리티
│   ├── /views/                 # View 템플릿
│   └── /main.js                # 클라이언트 사이드 Startup 스크립트
│── .gitignore                  # .gitignore
│── gulpfile.js                 # Gulp 빌드 구성
│── db.js                       # MongoDB 연결
│── passports.js                # Facebook/Google 로그인 인증
│── app.js                      # 서버 사이드 Startup 스크립트
└── package.json                # 노드 모듈 구성
```


### 빌드 및 실행 시키기
먼저 git clone을 합니다.

```shell
$ git clone https://github.com/carret/memong.git
```

그 다음 노드 모듈을 설치합니다.

```shell
$ npm install
```

노드 모듈 설치 후 gulp로 빌드하기 위해서 gulp 모듈을 전역으로 설치합니다. 설치 후 default Task를 실행하여 소스코드를 빌드합니다.

```shell
$ npm install -g gulp
$ gulp                          
```

명령어 입력시 빌드 및 브라우저 실행이 됩니다. 같은 포트(3000)로 접속할 경우 Browser-Sync에 의해 동기화됩니다. 또한, 소스 코드 변경시 자동으로 빌드 및 브라우저 새로고침을 실행합니다.


### Editor 사용법
**TAB**: 아래 메모로 포커스 이동.

**방향키 아래**: 아래 메모로 포커스 이동.(TAB이랑 똑같은 기능)

**방향키 위**: 위 메모로 포커스 이동.

**Shift + ENTER**: 메모 편집 완료.

**BACKSPACE**: 아래 메모로 포커스 이동.
