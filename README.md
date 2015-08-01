# memong

### 디렉토리 구성

```
.
├── /build/                     # 컴파일 아웃풋(Compile Output)
├── /models/                    # DB 모델링 코드 
├── /node_modules/              # 노드 모듈들
├── /routes/                    # REST API 
├── /src/                       # 앱의 소스 코드
│   ├── /actions/               # Flux - 액션
│   ├── /components/            # Flux - React 컴포넌트들
│   ├── /constants/             # Flux - 액션 상수
│   ├── /dispatcher/            # Flux - Dispathcer
│   ├── /stores/                # Flux - Store
│   ├── /css/                   # CSS
│   ├── /views/                 # EJS
│   └── /main.js                # 클라이언트 사이드 Startup 스크립트
│── gulpfile.js                 # Gulp 빌드 구성
│── db.js                 # MongoDB 연결 소스
│── app.js                      # 서버 사이드 Startup 스크립트
└── package.json                # 노드 모듈 구성
```

### 빌드 및 실행 시키기

```shell
$ gulp                          
```

명령어 입력시 빌드 및 브라우저 실행이 됩니다. 같은 포트로 접속할 경우 Browser-Sync에 의해 동기화됩니다. 또한, 소스 코드 변경시 자동으로 빌드 및 브라우저 새로고침을 실행합니다.
