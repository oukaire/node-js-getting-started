'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const v = require('validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cors());                                        /* CONFIRM, new CORS */

var MongoClient = require('mongodb').MongoClient, 
    assert = require('assert');
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/landmarkz';
var db = MongoClient.connect(mongoUri, function(error, database) { assert.equal(null, error); db = database; });

/* REMEMBER TO CLOSE db : db.close() */

app.get('/checkins.json', function(request, response) {
    response.send('you are trying to get checkins.json?');
});

app.get('/', function(request, response) {
    response.render('index.html');
});

app.post('/sendLocation', function(request, response) { /* TODO: status code */

    const theDate = new Date();
    const theLogin = request.body.login;
    var theLat = request.body.lat;
    var theLng = request.body.lng;
    var resObj = '';

    if (!validateCheckIn(theLogin, theLat, theLng)) {
        response.send('{"error":"Whoops, something is wrong with your data!"}');
    } 
    else {
        theLat = v.toFloat(theLat);
        theLng = v.toFloat(theLng);

        resObj = {"login":theLogin,"lat":theLat,"lng":theLng,"created_at":theDate};
        writeToDatabase(db, resObj);
        resObj = readFromDatabase(db);
        db.close();                             /* REM to CLOSE db */
        response.send(resObj);
    }
});

app.listen(process.env.PORT || 8888);


/**************************************************************
 *  put in a package perhaps? Make cleaner
 *************************************************************/
function validateCheckIn(login, lat, lng)
{
    if (login == '') return 0;
    if (!v.isFloat(lat, {min:-90, max:90}) || !v.isFloat(lng, {min:-180, max:180})) return 0;
    return 1;
}

function writeToDatabase(db, toInsert)
{
    var people = db.collection('checkins');

    people.insert(toInsert, function(e, result) {
        assert.equal(e, null);
        assert.equal(1, result.result.n);
    });
}

function readFromDatabase(db)
{
    return '(^-^)';   
}


