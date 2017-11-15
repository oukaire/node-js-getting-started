var bodyParser = require('body-parser'); 
var express = require('express');               /* to make app */
var cors = require('cors');                     /* to enable CORS */
var app = express();

function validReq(login, lat, lng)              /* validates credentials */
{
    if (login == '') return 0;
    if (lat < -90 || lat > 90) return 0;
    if (lng < -180 || lng > 180) return 0;
    return 1;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/checkins.json', function(request, response) {
    response.send('you are trying to get checkins?');
});

app.get('/', function(request, response) {
    response.render('index.html');
}); 

app.post('/sendLocation', cors(), function(request, response) {

    var theLogin = request.body.login;
    var theLat = request.body.lat;
    var theLng = request.body.lng;
    var theDate = new Date();           /* for created_at */
    var resObj = '';

    if (validReq(theLogin, theLat, theLng) == 0) {
        response.send('{"error":"Whoops, something is wrong with your data!"}');
    } 
    else {
        returnObject = {"login":theLogin,"lat":theLat,"lng":theLng};
        resObj = {"people":[returnObject],"landmarks":0};

        /* dont use : JSON.stringify(resObj) */
        response.send(resObj);
    }
});

app.listen(process.env.PORT || 8888);
