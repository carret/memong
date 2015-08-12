/**
 * Created by Jaewook on 2015-08-01.
 */

exports.doRoutes = function(app) {
    app.get ('/', index)
    app.get('/typography', function(req,res){
        res.render('__static__typography');
    });
    require('./api/login').doRoutes(app)
    require('./api/note').doRoutes(app)
    require('./api/memo').doRoutes(app)
}

var index = function(req, res) {
    //User is login
    //console.log(req.session);
    res.render('index', {title : "memong"})
}