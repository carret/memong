# memong

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
│── .gitnore                    # .gitnore
│── gulpfile.js                 # Gulp 빌드 구성
│── db.js                       # MongoDB Connect
│── passports.js                # Facebook/Google Login Connect
│── app.js                      # 서버 사이드 Startup 스크립트
│── trash.js                    # 휴지통
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



### 레이아웃 구성

```
┌─────────────────────────────────────────────────────┐
│┌───────────────────────────────────────────────────┐│
││                      Header                       ││
│└───────────────────────────────────────────────────┘│
│┌───────────────────────────────────────────────────┐│
││ Main                                              ││
││┌────────────────┐┌───────────────────────────────┐││
│││      Aside     ││            Section            │││
│││                ││                               │││
│││                ││                               │││
│││                ││                               │││
│││                ││                               │││
│││                ││                               │││
│││                ││                               │││
│││                ││                               │││
│││                ││                               │││
│││                ││                               │││
│││                ││                               │││
│││                ││                               │││
││└────────────────┘└───────────────────────────────┘││
│└───────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```
레이아웃은 크게 다음과 같이 이루어져 있습니다.
main.js에서 Header와 Main 컴포넌트를 불러옵니다. 
Header와 Main 컴포넌트는 state를 관리합니다. 해당 컴포넌트의 state는 asideVisible이나 memoSearcherActive 등등 Store와 관련 없이 View의 상태를 결정합니다.


**Header 레이아웃 구성**
```
┌──────────────────────────────────────────────────────────────────────────┐
│ Header                                                                   │
│┌──────┐┌──────┐           ┌────────────┐┌────────────┐┌─────────────────┐│
││ Logo ││ Logo │           │  Exporter  ││  Memo      ││     Account     ││
││ Icon ││      │           │            ││  Searcher  ││ (Login/Logout)  ││
│└──────┘└──────┘           └────────────┘└────────────┘└─────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```
Header은 다음과 같이 이루어져 있습니다.
Logo Icon과 Logo는 왼쪽으로 정렬됩니다.
Exporter, MemoSearcher, Account는 오른쪽으로 정렬됩니다.

MemoSearcher는 메모 검색기입니다.
Account는 계정을 관리합니다. Account Store와 연결되고, 로그인 상태에 따라 Login 또는 Logout 버튼을 나타냅니다.
Exporter는 노트를 Export합니다. 추후 구현 예정입니다.


**Main 레이아웃 구성**
```
┌──────────────────────────────────────────────────────────────────────────┐
│ Main                                                                     │
│┌──────────────────────────────┐┌────────────────────────────────────────┐│
││ Aside                        ││ Section                                ││
││┌─────────────┐┌─────────────┐││┌──────────────────────────────────────┐││
│││ Directory   ││ Memo        ││││              Note Header             │││
│││ Viewer      ││ Viewer      ││││ ──────────────────────────────────── │││
│││             ││             ││││                                      │││
│││             ││             ││││                                      │││
│││             ││             ││││                                      │││
│││             ││             ││││                                      │││
│││             ││             ││││                                      │││
│││             ││             ││││                                      │││
│││             ││             ││││                                      │││
│││             ││             ││││                 Editor               │││
│││             ││             ││││                                      │││
│││             ││             ││││                                      │││
│││             ││             ││││                                      │││
│││             ││             ││││                                      │││
│││             ││             ││││                                      │││
│││             ││             ││││                                      │││
│││             ││             ││││                                      │││
│││             ││             ││││                                      │││
││└─────────────┘└─────────────┘││└──────────────────────────────────────┘││
│└──────────────────────────────┘└────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```
Main은 Aside와 Section으로 나뉩니다.
Aside는 고정값입니다. (230px + 270px) Aside는 NoteHeader에 있는 ToggleAsideButton으로 show & hide가 가능합니다.
Section은 Aside를 제외한 나머지 공간을 차지합니다. 
