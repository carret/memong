import React from 'react';

import Flowing from '../../controller/AppFlowing';
import Actions from '../../controller/Actions';

import NoteStore from '../stores/NoteStore';


class HelloParse extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: "", result: "1" };
    }

    componentDidMount() {
        Flowing.subscribe(
            Actions.TestActions.SUBMIT_TEXT,
            (payedload) => {
                this.setState({
                    result: NoteStore.getText()
                });
            }
        );
    }

    submitText() {
        Flowing.dispatch(
            Actions.TestActions.SUBMIT_TEXT,
            { text: this.state.text }
        );
    }

    handleTextChange(event) {
        this.setState({
            text: event.target.value
        });
    }

    render() {
        var text = this.state.text;
        return (
            <div className="inputer">
                <input type="text" className="inputer-input" value={text} onChange={this.handleTextChange.bind(this)} />
                <button className="inputer-submitBtn" onClick={this.submitText.bind(this)}>Submit</button>
                <span className="inputer-result">{ this.state.result }</span>
            </div>
        );
    }
}

export default HelloParse;