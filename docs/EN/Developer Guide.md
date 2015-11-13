# Developer Guide
Documentation for **Developer**.

## Directory

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

## Getting Start

### Pre-requisites

* [Git](http://git-scm.com/)
* [node.js / npm](https://nodejs.org/en/)
* [gulp](http://gulpjs.com/)


### Download Project

* Git Clone.

```shell
$ git clone https://github.com/carret/memong.git
```

* Download development tools.

```shell
$ npm install
```

### Build & Run

Use gulp to build source codes.


```shell
$ gulp
```

> **NOTE:** You might need to install gulp by global when the ``$ gulp`` commands cause error. Try to install gulp by global: ``$ npm install -g gulp``, and re-try the build.


## Architecture

![memong-architecture](https://farm1.staticflickr.com/728/22903475152_7265387735_k.jpg)

The modules are loaded by **[browserify](http://browserify.org/)** which follows [AMD(Asynchronous Module Definition)](https://github.com/amdjs/amdjs-api/wiki/AMD).

