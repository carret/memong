var db = require('../../db');
var Note = db.model('Note');



var note = new Note();

 exports.doRoutes = function(app) {
 //app.get('/memo', getMemo)
 app.post('/memo/add', addMemo)
 app.post('/memo/save', saveMemo)
 };

 var getMemo = function(req, res) {

};

var addMemo = function(req ,res) {

    Note.update({name: 'test'},{$push: {memos:
    {
        header : '11',
        main : '11'
    }}},{upsert:true},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Successfully added");
        }
        res.end();
    });
};

var saveMemo = function(req, res) {

    Note.findOne({'name':'update--'},function(err,test){ // �̺κ� ��� , ���丮 �� �� �޾ƿ��� �� �ʿ� ����
        if(err){
            console.err(err);
            throw err;
        }

        res.send(200,test);

        /* test ��
        test.memos.push({
            header : '77',
            main : '777'
        });*/

        Note.update({_id: test['_id']},test,{upsert:true},function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Successfully updated");
            }
            res.end();
        });
    });
};
