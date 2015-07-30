var React = require('react');

var Todo = React.createClass({
    propTypes: {
        todo: React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            text: React.PropTypes.string.isRequired
        }),
        // 삭제 처리를 I/F로 정의
        onDelete: React.PropTypes.func.isRequired
    },
    // 부모에게 이벤트 처리를 위임한다.
    _onDelete() {
        this.props.onDelete(this.props.todo.id);
    },
    render() {
        return (
            <div>
                <span>{this.props.todo.text}</span>
                <button onClick={this._onDelete}>delete</button>
            </div>
        );
    }
});

module.exports = Todo;