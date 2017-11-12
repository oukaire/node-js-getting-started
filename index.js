var bodyParser = require('body-parser'); 
var express = require('express');
var cors = require('cors');                     /* to enable CORS */
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(request, response) {
    response.send('Web server running');
}); 

app.post('/sendLocation', cors(), function(request, response) {

    var theLogin = request.body.login;
    var theLat = request.body.lat;
    var theLng = request.body.lng;
    var returnObject = {"login":theLogin,"lat":theLat,"lng":theLng};
    var returnMessage = JSON.stringify(returnObject);
    response.send('{"people":[],"landmarks":[]}');
});

app.listen(process.env.PORT || 8888);
