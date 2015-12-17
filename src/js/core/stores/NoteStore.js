import Parse from '../../controller/Parse';
import Actions from '../../controller/Actions';
import Flowing from '../../controller/Flowing';


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
            Parse.insert('TextObj', {
                text: payload.text
            }, (err, res) => {
                if (err) console.log("Error: ", err);
                console.log("Saved: ", res);
                resolve();
            });
        });
    }
);

export default NoteStore;