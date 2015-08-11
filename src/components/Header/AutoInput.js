var React = require('react');
var Autosuggest = require('react-autosuggest');
var utils = require('./utils');

var suburbs = [{"suburb":"15.07.31 DB","postcode":"Aaaaaaaaaaa"},
    {"suburb":"14.08.23 네트워크","postcode":"가나다라마바사아자차카 타파"},
    {"suburb":"14.08.23 DB","postcode":"가나다라마바"},
    {"suburb":"15.02.10 네트워크","postcode":"weiojffjlaksfnlewiouwefsdf"},
    {"suburb":"15.02.10 DB","postcode":"weeeerrqwerwqr"},
    {"suburb":"15.01.12 DB","postcode":"asdfqwer"},
    {"suburb":"15.02.10 DB","postcode":"bbbbbbbkkkkkk"},
    {"suburb":"14.10.10 자료구조","postcode":"HelloKKKK"}];

var AutoInput = React.createClass({
    getSuggestion:function(input, callback) {
        const escapedInput = utils.escapeRegexCharacters(input.trim());
        const lowercasedInput = input.trim().toLowerCase();
        const suburbMatchRegex = new RegExp('\\b' + escapedInput, 'i');
        var suggestions = suburbs.filter(function(suburb) {
            return suburbMatchRegex.test(suburb.suburb + ", " + suburb.postcode);
        }).sort( function(suburbObj1, suburbObj2) {
            suburbObj1.suburb.toLowerCase().indexOf(lowercasedInput);
            suburbObj2.suburb.toLowerCase().indexOf(lowercasedInput);
        });

        callback(null, suggestions);
    },
    renderSuggestion : function(suggestionObj, input) {
        return (
            <span>
                <strong>{suggestionObj.suburb}</strong><br/>
                <small style={{ color: '#777' }}>{suggestionObj.postcode}</small>
            </span>
        );
    },
    render :function() {
        return (
            <div className="custom-renderer-example">
              <Autosuggest className="react-autosuggest" suggestions={this.getSuggestion} suggestionRenderer={this.renderSuggestion} />
            </div>
        );
    }
});

module.exports=AutoInput;