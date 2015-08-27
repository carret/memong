var db = require('../../db');
var Index = db.model('Index');

var Constants = require('../../src/constants/Constants');

exports.doRoutes = function(app) {
    app.get(Constants.API.GET_SEARCH , searchNoteAndMemo);
};


var searchNoteAndMemo = function (req, res) {
    var word = req.query.word;
    var user = req.query.username;

    Index.find({word: { $regex : word }, username: user}, function(err, memos) {
        if ( err ) { res.send(err); }
        else {
            var result = [];
            var memoIds = [];
            for ( var i = 0; i < memos.length; i++ ) {
                if ( memos[i].memos == null )
                    continue;
                for ( var j = 0; j < memos[i].memos.length; j++ ) {
                    var search = {
                        title : encodeURI(" " + memos[i].memos[j].memo.title),
                        summary : encodeURI(" " + memos[i].memos[j].memo.summary),
                        memoId : memos[i].memos[j].memo.memoId
                    };
                    if ( memoIds.indexOf(memos[i].memos[j].memo.memoId) == -1 ) {
                        memoIds.push(memos[i].memos[j].memo.memoId);
                        result.push(search);
                    }
                    var search = {
                        title : memos[i].memos[j].memo.title,
                        summary : memos[i].memos[j].memo.summary
                    };
                    if ( memoIds.indexOf(memos[i].memos[j].memo.memoId) == -1 ) {
                        memoIds.push(memos[i].memos[j].memo.memoId);
                        result.push(search);
                    }
                }
            }
            console.log(result);
            res.send({memos : result});
        }
    });
};