var express = require('express');
var cors = require('cors'); /* to enable CORS */
var bodyParser = require('body-parser'); 
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/sendLocation', cors(), function(request, response) {

    var theLogin = request.body.login;
    var theLat = request.body.lat;
    var theLng = request.body.lng;
    var returnObject = {"login":theLogin,"lat":theLat,"lng":theLng};
    // JSON.stringify(returnObject) ? perhaps
    response.send(returnObject);
});

app.listen(process.env.PORT || 8888);
