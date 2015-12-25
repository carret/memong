import Parse from '../../controller/Parse';
import Actions from '../../controller/Actions';
import Flowing from '../../controller/AppFlowing';


var text = "";

var NoteStore = {
    getText: () => {
        return text;
    }
};

Flowing.register(
    Actions.TestActions.SUBMIT_TEXT,
    (payload) => {
        text = payload.text;
        return new Promise((resolve, reject) => {
            var TestingObj = Parse.Object.extend("Testing");
            var obj = new TestingObj();

            obj.set('text', payload.text);
            obj.save(null, {
                success: (res) => {
                    console.log("Saved: ", res);
                    resolve();
                },
                error: (res,err) => {
                    console.log("Error: ", err);
                }
            });
        });
    }
);

export default NoteStore;