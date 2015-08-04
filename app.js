var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

var routes = require('./routes/routes.js');

var passports = require('./passports');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.engine('.ejs', require('ejs').__express);
app.set('views', __dirname + '/build/views');
app.set('view engine', 'ejs');
app.use(passports.initialize());
app.use(passports.session());
app.use(express.static(__dirname + '/build'));

//passports.initializePassport();
routes.doRoutes(app);

app.get('/comments.json', function(req, res) {
    fs.readFile('comments.json', function(err, data) {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(JSON.parse(data));
    });
});

app.post('/comments.json', function(req, res) {
    fs.readFile('comments.json', function(err, data) {
        var comments = JSON.parse(data);
        comments.push(req.body);
        fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err) {
            res.setHeader('Cache-Control', 'no-cache');
            res.json(comments);
        });
    });
});

app.listen(8888);

console.log("Running at Port 8888");