var fs = require('fs');
var moment = require('moment');
var express = require('express');
var bodyParser = require('body-parser');

var srcApp = express();
var distApp = express();


// Serves source code
var server1 = srcApp.listen(4000, function() {

    srcApp.use(express.static(__dirname + '/'));

    srcApp.get('/', function(req, res) {
        res.sendFile(__dirname + '/index.html');
    });

    // POST method route
    srcApp.use(bodyParser.urlencoded({
        extended: true
    }));
    srcApp.post('/', function(req, res) {
        console.log(req.body);
        res.sendStatus(200);

        //current time
        var now = moment().format();
        //changed the format of received data
        var receivedData = '{ "' + now + '" : ' + JSON.stringify(req.body, null, 4) + '\n},';

        //write file with requests
        fs.appendFile('contactform.json', receivedData, function(err) {

            if (err) {
                console.log(err);
            } else {
                console.log("Data has been added!");
            }
        });

    });

    //404 not found
    srcApp.get('*', function(req, res) {
        res.sendFile(__dirname + '/404.html');
        console.log('Get request for ' + req.url + ' (src)');
    });

    var host = server1.address().address;
    var port = server1.address().port;
    console.log('Source code listening at http://%s:%s', host, port);
});

// Serves distribution code
var server2 = distApp.listen(8000, function() {

    distApp.use(express.static(__dirname + '/dist'));

    distApp.get('/', function(req, res) {
        res.sendFile(__dirname + '/dist/index.html');
    });

    //404 not found
    distApp.get('*', function(req, res) {
        res.sendFile(__dirname + '/dist/404.html');
        console.log('Get request for ' + req.url + ' (dist)');
    });

    var host = server2.address().address;
    var port = server2.address().port;
    console.log('Distribution code listening at http://%s:%s', host, port);
});