# memong

### 소개
memong은 웹 클라우드 텍스트 에디터입니다.

1. 마크다운을 지원합니다.
2. 텍스트 내용을 ``메모``라는 단위로 구분하여 관리합니다.
3. 타이핑 중심의 텍스트 에디터로 여러 키보드 단축키를 지원합니다.

다음은 해당 프로젝트의 개발툴 및 서비스입니다.

``node.js``, ``mongoDB``, ``Redis``, `React.js`, `jQuery`, `Flux`, `less`, `gulp`

Site: [http://memong.xyz](http://memong.xyz)

Trello: [https://trello.com/b/T4XVwb2J/carret](https://trello.com/b/T4XVwb2J/carret)

Git: [https://github.com/carret/memong](https://github.com/carret/memong)


**저자**
* 김재욱(cmdhema@gmail.com)
* 장초롱(crjang91@gmail.com)
* 나석주(seokmaTD@gmail.com)


### 디렉토리 구성

```
.
├── /build/                     # 컴파일 아웃풋(Compile Output)
├── /node_modules/              # 노드 모듈들
├── /routes/                    # 서버 라우터
│   ├── /api/                   # WebAPI
│   └── /routes.js              # 라우터
├── /models/                    # MongoDB Models
├── /src/                       # 앱의 소스 코드
│   ├── /actions/               # Flux - 액션 생성기(action creator)
│   ├── /components/            # Flux - React 컴포넌트들
│   ├── /constants/             # Flux - 액션 상수
│   ├── /dispatcher/            # Flux - Dispathcer
│   ├── /stores/                # Flux - Store
│   ├── /styles/                # Less Stylesheet
│   ├── /utils/                 # WebAPI 유틸리티, 서버로부터 데이터를 받고 보냅니다.
│   ├── /views/                 # EJS
│   └── /main.js                # 클라이언트 사이드 Startup 스크립트
│── .gitignore                  # .gitignore
│── gulpfile.js                 # Gulp 빌드 구성
│── db.js                       # MongoDB Connect
│── passports.js                # Facebook/Google Login Connect
│── app.js                      # 서버 사이드 Startup 스크립트
└── package.json                # 노드 모듈 구성
```


### 빌드 및 실행 시키기

```shell
$ gulp                          
```

명령어 입력시 빌드 및 브라우저 실행이 됩니다. 같은 포트로 접속할 경우 Browser-Sync에 의해 동기화됩니다. 또한, 소스 코드 변경시 자동으로 빌드 및 브라우저 새로고침을 실행합니다.


### Editor 사용법
**TAB**: 아래 메모로 포커스 이동.

**방향키 아래**: 아래 메모로 포커스 이동.(TAB이랑 똑같은 기능)

**방향키 위**: 위 메모로 포커스 이동.

**Shift + ENTER**: 메모 편집 완료.

**BACKSPACE**: 아래 메모로 포커스 이동.
