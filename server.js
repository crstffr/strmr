var fs = require('fs');
var auth = require('http-auth');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var authMiddle = auth.connect(auth.basic({
    realm: '',
    file: __dirname + '/users.htpasswd'
}));

// app.use(authMiddle); this doesn't work
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));

app.get('/id', require('./api/id/id.get'));
app.post('/files', require('./api/files/files.post'));

app.listen(8080);

console.log('Server started at: http://localhost:8080');
