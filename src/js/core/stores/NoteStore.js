import Parse from '../../controller/Parse';
import Flowing from '../../controller/Flowing';


var text = "";
var NoteStore = {
    getText: () => {
        return text;
    }
};


Flowing.register(
    'SUBMIT_TEXT',
    (payload) => {
        text = payload.text;

        return new Promise((resolve, reject) => {
            var TextObj = Parse.Object.extend('TextObj');
            var _testTextObj = new TextObj();
            _testTextObj.save({
                text: payload.text
            }).then((obj) => {
                resolve(obj);
            });
        });
    }
);

export default NoteStore;