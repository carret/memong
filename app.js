var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

var routes = require('./routes/routes.js');

var passports = require('./passports');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('myKey'));
app.use(session({
    secret: 'myKey',
    proxy: true,
    resave: true,
    saveUninitialized: true}));
app.engine('.ejs', require('ejs').__express);
app.set('views', __dirname + '/build/views');
app.set('view engine', 'ejs');
app.use(passports.initialize());
app.use(passports.session());
app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/assets'));

routes.doRoutes(app);

app.listen(8888);

console.log("Running at Port 8888");