var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));

app.get('/id', require('./api/id/id.get'));
app.post('/files', require('./api/files/files.post'));

app.listen(8080);

console.log('Server started at: http://localhost:8080');
