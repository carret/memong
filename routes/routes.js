/**
 * Created by Jaewook on 2015-08-01.
 */

exports.doRoutes = function(app) {
    app.get ('/', index)
    require('./api/login').doRoutes(app)
    require('./api/note').doRoutes(app)
    require('./api/memo').doRoutes(app)
}

var index = function(req, res) {
    //ÄíÅ° Ã¼Å©
    res.render('index', {title : "memong"})
}