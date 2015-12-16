import _ from 'underscore';

var Flowing = null;
var _flows = {};


var helperFunc = {
    idTypeCheck: (id) => {
        let type = typeof id;
        if (type === 'undefined'
            || type === 'null'
            || type === 'NaN'
            || type === 'Number')
            return false;

        return true;
    }
};


class _Flowing {
    constructor() {}

    createFlow(flowId) {
        if (!helperFunc.idTypeCheck(flowId))
            throw new Error('FlowController.createFlow(...): Type of ID must be Immutable.');

        if (_flows.hasOwnProperty(flowId))
            throw new Error('FlowController.addFlow(...): ' + id + ' is not a unique ID.');

        _flows[flowId] = _.extend({}, {
            registers: [],
            subscribes: []
        });
    }

    createFlows(flowIds) {
        if (flowIds === undefined || flowIds.length === 0) {
            console.warn("FlowController.createFlows(...): No flows to create");
            return;
        }

        for (let idx=0; idx<flowIds.length; idx++) {
            if (!helperFunc.idTypeCheck(flowIds[idx]))
                throw new Error('FlowController.createFlows(...):' + flowIds[idx] + ' Type of ID must be Immutable.');

            if (_flows.hasOwnProperty(flowIds[idx]))
                throw new Error('FlowController.createFlows(...): Already has flow with ID ' + flowIds[idx]);

            _flows[flowIds[idx]] = _.extend({}, {
                registers: [],
                subscribes: []
            });
        }
    }

    deleteFlow(flowId) {
        if (!_flows.hasOwnProperty(flowId)) {
            throw new Error('FlowController.deleteFlow(...): does not have flow which id is ' + flowId);
        }
        delete _flows[flowId];
    }

    dispatch(flowId, payload) {
        let thisFlow = _flows[flowId];
        let main = () => {
            var tasks = [];
            for (let idx=0; idx<thisFlow.registers.length; idx++) {
                tasks.push(thisFlow.registers[idx](payload));
            }
            return Promise.all(tasks);
        };

        main().then(function(results) {
            var _payedload = results ? results : null;
            for (let idx=0; idx<thisFlow.subscribes.length; idx++) {
                thisFlow.subscribes[idx](_payedload);
            }
        }).catch(function(errors) {
            var _payedload = errors ? errors : null;
            for (let idx=0; idx<thisFlow.subscribes.length; idx++) {
                thisFlow.subscribes[idx](_payedload);
            }
        });
    }

    register(flowId, callback) {
        _flows[flowId].registers.push(callback);
    }

    subscribe(flowId, callback){
        _flows[flowId].subscribes.push(callback);
    }
}


Flowing = new _Flowing();

export default Flowing;