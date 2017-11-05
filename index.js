var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser'); 
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(request, response) {
    response.send("Hello world");
});

app.get('/pikachu', function(request, response) {
    console.log(request);
    response.send("You've won the game!");
});

app.post('/sendLocation', function(request, response) {

    /* enable Cross-Origin Resource Sharing FOR POST `/sendLocation` */
    app.use(cors());

    var theLogin = request.body.login;
    var theLat = request.body.lat;
    var theLng = request.body.lng;
    //var returnObject = {"login":theLogin,"lat":theLat,"lng":theLng};
    response.send('{"people":[],"landmarks":[]}');
});

app.listen(process.env.PORT || 8888);
