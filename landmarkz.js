'use strict';

const v = require('validator');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
//app.use(cors());                                        /* CONFIRM, new CORS */

/*
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/landmarkz';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, dbConnection) {  *//* HANDLE ERROR *//*
    db = dbConnection;
}); */

app.get('/checkins.json', function(request, response) {
    response.send('you are trying to get checkins?');
});

app.get('/', function(request, response) {
    response.render('index.html');
}); 

function validateReq(login, lat, lng)
{
    if (login == '') return 0;
    if (!v.isFloat(lat, {min:-90, max:90}) || !v.isFloat(lng, {min:-180, max:180})) return 0;
    return 1;
}

app.post('/sendLocation', function(request, response) { /* TODO: status code */

    var theLogin = request.body.login;
    var theLat = request.body.lat;
    var theLng = request.body.lng;
    var theDate = new Date();                   /* for created_at */
    var resObj = '';

    if (validateReq(theLogin, theLat, theLng) == 0) {
        response.send('{"error":"Whoops, something is wrong with your data!"}');
    } 
    else {
        theLat = v.toFloat(theLat);
        theLng = v.toFloat(theLng);

        var returnObject = {"login":theLogin,"lat":theLat,"lng":theLng}; 
        resObj = {"people":[returnObject],"landmarks":0};

        response.send(returnObject);
    }
});

app.listen(process.env.PORT || 8888);
