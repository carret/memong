var React = require('react');
var Autosuggest = require('react-autosuggest');
var utils = require('./utils');
var cookie = require('react-cookie');

var WebGetUtils = require('../../utils/WebGetUtils');

var SearchStore = require('../../stores/SearchStore');
var jwt = require('jwt-simple');
var pkgInfo = require('../../../package');
var userToken = cookie.load('token', null);
var userName;

var word;
var thisCallback;
if ( userToken != null ) {
    userName = jwt.decode(userToken, pkgInfo.oauth.token.secret).username;
}

function getIndexingTable() {
    //return {table : SearchStore.getSearchResult()}
    return SearchStore.getSearchResult();
}


var AutoInput = React.createClass({
    componentDidMount: function() {
        SearchStore.addChangeListener(this._onChange); //Store의 데이터 변경을 감지하는 Listener 등록
    },
    onSuggestionFocused:function(suggestion) { // In this example 'suggestion' is a string
        console.log('Suggestion focused: [' + suggestion + ']');
    },
    getSuggestion:function(input, callback) {
        word = input;
        thisCallback = callback;
        WebGetUtils.getIndexingTable(userName, input);
    },
    _onChange : function() {
        var result = getIndexingTable();
        var requestDelay = 50 + Math.floor(300 * Math.random());
        const escapedInput = utils.escapeRegexCharacters(word.trim());
        const suburbMatchRegex = new RegExp('\\b' + encodeURI(escapedInput), 'i');
        var suggestions = result.filter(function (memo) {
            return suburbMatchRegex.test(memo.title,  decodeURI(memo.title), memo.summary, decodeURI(memo.summary));
        }).sort(function (suburbObj1, suburbObj2) {
            //suburbObj1.suburb.toLowerCase().indexOf(lowercasedInput);
            //suburbObj2.suburb.toLowerCase().indexOf(lowercasedInput);
        });
        setTimeout(function() {
            thisCallback(null, suggestions), requestDelay;
        });
    },
    renderSuggestion : function(suggestionObj, input) {
        return (
            <span>
                <strong>{decodeURI(suggestionObj.title)}</strong><br/>
                <small style={{ color: '#777' }}>{decodeURI(suggestionObj.summary)}</small>
            </span>
        );
    },
    onSuggestionSelected:function(suggestion, event) {
        event.preventDefault();
        console.log(suggestion);
    },
    getSuggestionValue:function(suggestionObj) {
        return decodeURI(suggestionObj.title);
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
