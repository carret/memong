import _ from 'underscore';
import SceneTypes from './SceneTypes';


var _id = 0;
var _scenes = {};
var _sceneNames = [];
var _state = {};
var _processHashTable = null;

var SCENE_TYPES = [
    SceneTypes.START,
    SceneTypes.END,
    SceneTypes.PROCESS,
    SceneTypes.DECISION
];

var helperFunc = {
    checkProtoScenes: (_scenes) => {
        if (_scenes.constructor !== Array)
            throw new Error('new Scenario(...): Invalid scenes.');

        return true;
    },

    checkScene: (_scene) => {
        if (typeof _scene.name !== 'string')
            throw new Error("new Scenario(...): Scene's name must be String.");

        if (!_.contains(SCENE_TYPES, _scene.sceneType))
            throw new Error("new Scenario(...): Invalid scene's type. You can use scene types: var SceneType = require('scenario-maker').SceneType");

        if (typeof _scene.task !== 'function')
            throw new Error("new Scenario(...): Scene's task must be function.");

        return true;
    },

    checkSceneName: (_name) => {
        if (_.contains(_sceneNames, _name))
            throw new Error("new Scenario(...): Scene's name must be unique.");

        return true;
    },

    makeScene: (_scene) => {
        return {
            name: _scene.name,
            sceneType: _scene.type,
            task: _scene.task,
            nextScene: _scene.nextScene
        };
    }
};


class Scenario {
    constructor(startScene, scenes, endScene) {
        this.id = _id++;
        this._process = null;

        this.START_SCENE = null;
        this.END_SCENE = null;

        helperFunc.checkProtoScenes(scenes);

        if (helperFunc.checkSceneName(startScene.name)) {
            _scenes[startScene.name] = helperFunc.makeScene(startScene);
            _sceneNames.push(startScene.name);
        }

        if (helperFunc.checkSceneName(endScene.name)) {
            _scenes[endScene.name] = helperFunc.makeScene(endScene);
            _sceneNames.push(endScene.name);
        }

        this.START_SCENE = startScene.name;
        this.END_SCENE = endScene.name;

        for (let idx=0, len=scenes.length; idx<len; idx++) {
            if (helperFunc.checkSceneName(scenes[idx].name))
                _scenes[scenes[idx].name] = helperFunc.makeScene(scenes[idx]);
        }

        for (let prop in _scenes)
            helperFunc.checkScene(_scenes[prop]);

        this._makeProcess();
    }

    _makeProcess() {
        if (this._process !== null) {
            console.warn("Scenario._makeProcess(...): Already process is initialized.");
            return;
        }

        this._makeProcessHashTable();
        this._process = () => {
            _processHashTable[this.START_SCENE]();
        };
    }

    _makeProcessHashTable() {
        if (_processHashTable !== null) {
            console.warn("Scenario._makeProcessHashTable(...): Already processHashTable is initialized.");
            return;
        }

        _processHashTable = {};

        var that = {
            id: this.id,
            getCurrentScene: this.getCurrentScene,
            getState: this.getState,
            setState: this.setState
        };

        for (let prop in _scenes) {
            var resolveNextScene = null;
            var rejectNextScene = null;

            switch(_scenes[prop].sceneType) {
                case SceneTypes.START:
                case SceneTypes.PROCESS:
                    resolveNextScene = _scenes[prop].nextScene;
                    rejectNextScene = this.END_SCENE;
                    break;

                case SceneTypes.DECISION:
                    resolveNextScene = _scenes[prop].nextScene.success;
                    rejectNextScene = _scenes[prop].nextScene.failed;
                    break;
            }

            _processHashTable[_scenes[prop].name] = (function(scene, bindingObj, _resolveNextScene, _rejectNextScene) {
                var _promise = function() {
                    return new Promise(scene.task.bind(this));
                }.bind(bindingObj);

                return (function() {
                    _promise().then(() => {
                        if (_resolveNextScene === null) return;
                        _processHashTable[_resolveNextScene]();
                    })['catch'](() => {
                        if (_rejectNextScene === null) return;
                        _processHashTable[_rejectNextScene]();
                    });
                });
            })(_scenes[prop], that, resolveNextScene, rejectNextScene);
        }
    }

    playScenario() {
        if (_scenes.length === 0) {
            console.warn('Scenario.execute(...): Scenes are not initialized.');
            return;
        }

        if (this._process === null) {
            console.warn('Scenario.execute(...): Process is not initialized.');
            return;
        }

        this._process();
    }

    addState(state) {
        if (_state.hasOwnProperty(this.id)) {
            console.warn("Scenario.addState(...): Already states are added.");
            return;
        }

        if (typeof state !== 'object')
            throw new Error('Scenario.addState(...): States must be object.');

        _state[this.id] = state;
    }

    getState() {
        if (!_state.hasOwnProperty(this.id)) {
            console.warn("Scenario.getState(...): States are not initialized.");
            return;
        }

        return _.clone(_state[this.id]);
    }

    setState(state) {
        if (typeof state !== 'object')
            throw new Error('Scenario.setState(...): States must be object.');

        if (!_state.hasOwnProperty(this.id)) {
            console.warn('Scenario.setState(...): States are not initialized. Do "addState(...)" to initialize.');
            return;
        }

        for (var prop in state)
            _state[this.id][prop] = state[prop];

    }
}

export default Scenario;