var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));

app.get('/id', require('./api/id/id.get'));
app.post('/movie', require('./api/movie/movie.post'));
app.post('/tvshow', require('./api/tvshow/tvshow.post'));

app.listen(808);
