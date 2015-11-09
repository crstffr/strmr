// Prevent the server from running as root
var uid = parseInt(process.env.SUDO_UID);
if (uid) {
    process.setuid(uid);
}

var fs = require('fs');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(express.static('public'));

app.get('/id', require('./api/id/id.get'));
app.post('/files', require('./api/files/files.post'));

https.createServer({
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem')
}, app).listen(8443);

console.log('Server started at https://localhost:8443');
