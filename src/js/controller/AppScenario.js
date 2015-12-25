import SceneTypes from './utils/SceneTypes';
import Scenario from './utils/Scenario';

var AppStart = {
    name: 'App Start',
    type: SceneTypes.START,
    task: function(resolve, reject) {
        console.log("App Start");
        resolve();
    },
    nextScene: 'Login'
};

var AppProcess = [
    {
        name: 'Login',
        type: SceneTypes.DECISION,
        task: function(resolve, reject) {
            console.log("Login");
            this.setState({
                state1: "login"
            });
            if (true) resolve();
            else reject();
        },
        nextScene: {
            success: 'Login Success',
            failed: 'Login Failed'
        }
    },
    {
        name: 'Login Success',
        type: SceneTypes.PROCESS,
        task: function(resolve, reject) {
            console.log("Login Success");
            console.log("State: ", this.getState());
            this.setState({
                state2: "Login Success"
            });
            resolve();
        },
        nextScene: 'Login Success Two'
    },
    {
        name: 'Login Success Two',
        type: SceneTypes.PROCESS,
        task: function(resolve, reject) {
            console.log("Login Success Two");
            setTimeout(() => {
                resolve();
            }, 2500);
        },
        nextScene: 'App End'
    },
    {
        name: 'Login Failed',
        type: SceneTypes.PROCESS,
        task: function(resolve, reject) {
            console.log("Login Failed");
            this.setState({
                state2: "Login Failed"
            });
            resolve();
        },
        nextScene: 'App End'
    }
];

var AppEnd = {
    name: 'App End',
    type: SceneTypes.END,
    task: function(resolve, reject) {
        console.log("App End");
        console.log("states", this.getState());
        resolve();
    },
    nextScene: null
};


var AppScenario = new Scenario(AppStart, AppProcess, AppEnd);

AppScenario.addState({
    state1: '123',
    state2: '456'
});

export default AppScenario;