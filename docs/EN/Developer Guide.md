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

After gulp default task, it will build source codes under the ``src`` folder. And automatically access to ``http://loaclhost:3000``. Is will be synced when you access local server by port ``3000`` because of [browser-sync](http://www.browsersync.io/).


> **NOTE 1**: NOTE 1: Will thorw error when MongoDB and Redis are NOT excuting. Make sure to excute after install them.

> **NOTE 2**: If commands cannot find ``gulp``, do ``$ npm install -g gulp`` and try to build source codes by gulp again.


## Architecture

![memong-architecture](https://farm1.staticflickr.com/728/22903475152_7265387735_k.jpg)

The modules are loaded by **[browserify](http://browserify.org/)** which follows [AMD(Asynchronous Module Definition)](https://github.com/amdjs/amdjs-api/wiki/AMD).

