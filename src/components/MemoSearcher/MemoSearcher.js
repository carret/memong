var React = require('react');
var Autosuggest = require('react-autosuggest');
var utils = require('./utils');

var suburbs = [{"suburb":"15.07.31 DB","postcode":"Aaaaaaaaaaa"},
    {"suburb":"14.08.23 네트워크","postcode":"가나다라마바사아자차카 타파"},
    {"suburb":encodeURI("14.08.23 DB"),"postcode":encodeURI(" 가나다라마바")},
    {"suburb":"15.02.10 네트워크","postcode":"weiojffjlaksfnlewiouwefsdf"},
    {"suburb":"15.02.10 DB","postcode":"weeeerrqwerwqr"},
    {"suburb":encodeURI("arduino"),"postcode":"asdfqwer"},
    {"suburb":encodeURI("15.02.10 network"),"postcode":"bbbbbbbkkkkkk"},
    {"suburb":encodeURI(" 김재욱 안녕하세요 하하"),"postcode":"bbbbbbbkkkkkk"},
    {"suburb":encodeURI("자료구조 structure"),"postcode":"HelloKKKK"}];

var AutoInput = React.createClass({
    onSuggestionFocused:function(suggestion) { // In this example 'suggestion' is a string
        console.log('Suggestion focused: [' + suggestion + ']');
    },
    getSuggestion:function(input, callback) {
        const suburbMatchRegex = new RegExp('\\b' + encodeURI(input), 'i');
        var suggestions = suburbs.filter(function(suburb) {
            return suburbMatchRegex.test(suburb.suburb + "," + decodeURI(suburb.suburb)+"," + suburb.postcode+","+decodeURI(suburb.postcode));
        }).sort( function(suburbObj1, suburbObj2) {
            //suburbObj1.suburb.toLowerCase().indexOf(lowercasedInput);
            //suburbObj2.suburb.toLowerCase().indexOf(lowercasedInput);
        });

        callback(null, suggestions);
    },
    renderSuggestion : function(suggestionObj, input) {
        return (
            <span>
                <strong>{decodeURI(suggestionObj.suburb)}</strong><br/>
                <small style={{ color: '#777' }}>{decodeURI(suggestionObj.postcode)}</small>
            </span>
        );
    },
    onSuggestionSelected:function(suggestion, event) {
        console.log("event", event);
       event.preventDefault();
        console.log(suggestion);
    },
    getSuggestionValue:function(suggestionObj) {
        return decodeURI(suggestionObj.suburb);
    },
    render :function() {
        var inputAttributes = {
            id : 'memo-searcher',
            placeholder : 'Input Memo Title'
        };
        return (
            <div className="custom-renderer-example">
                <Autosuggest className="react-autosuggest"
                             suggestions={this.getSuggestion}
                             onSuggestionSelected={this.onSuggestionSelected}
                             suggestionValue={this.getSuggestionValue}
                             suggestionRenderer={this.renderSuggestion}
                             scrollBar={true}
                             inputAttributes={inputAttributes}
                             ref={function() {document.getElementById('memo-searcher').focus();}}/>
            </div>
        );
    }
});

module.exports=AutoInput;
