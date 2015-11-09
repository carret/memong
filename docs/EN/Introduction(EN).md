# memong

### Introduction
[memong](http://memong.xyz) is a Web Cloud Text Editor. memong has special features.

1. Support Makrdown.
2. Managed contexts by ``memo`` which is separated from texts.
3. Focus on Typing.
4. Support many keyboard shortcuts.


We used [Trello](https://trello.com/b/T4XVwb2J/carret) for team communicate.


### Teams
* Jae Wook, Kim (cmdhema@gmail.com)
* Chorong, Jang (crjang91@gmail.com)
* Seok Ju, Na (seokmaTD@gmail.com)


### Directory

```
.
├── /assets/                    # Image Aseets
├── /build/                     # Compile Output
├── /docs/                      # Documents
├── /node_modules/              # Node Modules
├── /routes/                    # Server Router
│   ├── /api/                   # WebAPI
│   └── /routes.js              # Router
├── /models/                    # MongoDB Models
├── /src/                       # Source Codes
│   ├── /actions/               # Flux - Action Creator
│   ├── /components/            # Flux - React Components
│   ├── /constants/             # Constants
│   ├── /dispatcher/            # Flux - Dispathcer
│   ├── /stores/                # Flux - Store
│   ├── /styles/                # Less Stylesheet
│   ├── /utils/                 # WebAPI Utils
│   ├── /views/                 # View Templete
│   └── /main.js                # Client Side Startup Script
│── .gitignore                  # .gitignore
│── gulpfile.js                 # Gulp Build
│── db.js                       # MongoDB Connect
│── passports.js                # Facebook/Google Login Auth
│── app.js                      # Server Side Startup Script
└── package.json                # Package Manager
```


### Build & Run
First, ``git clone`` to get project.

```shell
$ git clone https://github.com/carret/memong.git
```

Install node modules.

```shell
$ npm install
```

After install node modules, install [gulp](http://gulpjs.com/) module by global to build project by gulp. Run defulat ``gulp task`` to build source codes.

```shell
$ npm install -g gulp
$ gulp                          
```

You can access same screen when you use port 3000 by [browser-sync](http://www.browsersync.io/). In addition when you modify source codes, it will be build source codes and refresh browser automatically.


### How to use Editor
**TAB**: Focus move to down ``memo``.

**Arrow Down**: Focus move to down ``memo``.(same as TAB)

**Arrow Up**: Focus move to up ``memo``.

**Shift + ENTER**: Complete ``memo`` editing.

**BACKSPACE**: Focus move to up ``memo``.
