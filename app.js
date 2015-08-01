var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var routes = require('./routes/routes.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.engine('.ejs', require('ejs').__express);
app.set('views', __dirname + '/build/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/build'));



app.listen(8888);

routes.doRoutes(app);

console.log("Running at Port 8888");