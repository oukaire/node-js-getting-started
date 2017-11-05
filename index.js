var express = require('express');
var app = express();
var bodyParser = require('body-parser'); 

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
        var theLogin = request.body.login;
        var theLat = request.body.lat;
        var theLng = request.body.lng;
        var returnObject = {"login":theLogin,"lat":theLat,"lng":theLng};
        response.send(returnObject);
});

app.listen(process.env.PORT || 8888);
