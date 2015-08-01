var React = require('react');
var Todo = require('./Todo');

var TodoList = React.createClass({
    getInitialState() {
        return {
            todos: [
                {id:1, text:"advent calendar1"},
                {id:2, text:"advent calendar2"},
                {id:3, text:"advent calendar3"}
            ]
        };
    },
    // TodoList는 이 컴포넌트가 관리하고 있으므로 삭제 처리도 여기에 존재한다.
    deleteTodo(id) {
        this.setState({
            todos: this.state.todos.filter(function(todo) {
                return todo.id !== id;
            }, this)
        });
    },
    render() {
        var todos = this.state.todos.map(function(todo) {
            return <li className="" key={todo.id}><Todo onDelete={this.deleteTodo} todo={todo} /></li>;
        }, this);

        return <ul>{todos}</ul>;
    }
});

module.exports = TodoList;