var React = require('react');
<<<<<<< HEAD
////var TodoList = require('./components/TodoList');
//var Header = require('./components/Header');
//
//React.render(
//    <Header/>,
//    document.getElementById('app')
//);

var ProductCategoryRow = React.createClass({
    render : function() {
        return (
            <tr><th colSpan="2">{this.props.category}</th></tr>
        );
    }
})

var ProductRow = React.createClass({
    render:function() {
        var name = this.props.product.stocked ?
            this.props.product.name :
            <span style={{color : 'red' }} >
                {this.props.product.name}
            </span>
        return (
            <tr>
                <td>{name}</td>
                <td>{this.props.product.price}</td>
            </tr>
        )
    }
});

var ProductTable = React.createClass({
    render : function() {
        console.log(this.props);
        var rows = [];
        var lastCategory = null;
        this.props.products.forEach(function(product) {
            if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
                return;
            }
            if (product.category !== lastCategory) {
                rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
            }
            rows.push(<ProductRow product={product} key={product.name} />);
            lastCategory = product.category;
        }.bind(this));
        return (
            <table>
                <thread>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thread>
                <tbody>{rows}</tbody>
            </table>
        );
    }
})

var SearchBar = React.createClass({
    handleChange:function() {
        this.props.onUserInput {
            this.props.onUserInput(this.refs.filterTextInput.getDOMNode().value, this.refs.inStockOnlyInput.getDOMNode().checked);
        }
    },
    render: function() {
        return (
            <form>
                <input type="text" placeholder="Search..." value={this.props.filterText} ref="filterTextInput" onChange={this.handleChange}/>
                <p>
                    <input type="checkbox" checked={this.props.inStockOnly} ref="inStockOnlyInput" onChange={this.handleChange}/>
                    {' '}
                    Only show products in stock
                </p>
            </form>
        );
    }
});


var FilterableProductTable = React.createClass({
    getInitialState : function() {
        return {
            filterText : '',
            inStockOnly : false
        };
    },
    handleUserInput:function(filterText, isStockOnly) {
        this.setState({
            filterText:filterText,
            isStockOnly:isStockOnly
        });
    },
    render: function() {
        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    onUserInput={this.handleUserInput}/>
                <ProductTable
                    products={this.props.products}
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly} />
            </div>
        );
    }
});

var PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
    {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
    {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

React.render(
    <FilterableProductTable products={PRODUCTS} />,
=======

//var MemoViewer = require('./components/MemoViewer/MemoViewer');
var Editor = require('./components/Editor/Editor');
var MemoActions = require('./actions/MemoActions');

MemoActions.initMemo([]);

React.render(
    <div className="app">
        <Editor />
    </div>,
>>>>>>> seokju
    document.getElementById('app')
);
