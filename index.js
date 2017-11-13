var bodyParser = require('body-parser'); 
var express = require('express');
var cors = require('cors');                     /* to enable CORS */
var app = express();

function validReq(login, lat, lng) 
{
    if (lat < -90 || lat > 90) return 0;
    if (lng < -180 || lng > 180) return 0;
    if (login == '') return 0;
    return 1;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(request, response) {
    response.send('Assignment 3 server up and running');
}); 

app.post('/sendLocation', cors(), function(request, response) {

    var theLogin = request.body.login;
    var theLat = request.body.lat;
    var theLng = request.body.lng;
    var resObj = '';

    if (validReq(theLogin, theLat, theLng) == 0) {
        response.send('{"error":"Whoops, something is wrong with your data!"}');
    } 
    else {
        returnObject = {"login":theLogin,"lat":theLat,"lng":theLng};
        resObj = {"people":[returnObject],"landmarks":0};
        response.send(JSON.stringify(resObj));
    }
});

app.listen(process.env.PORT || 8888);
