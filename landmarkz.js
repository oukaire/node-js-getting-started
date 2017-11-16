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
var theLat = 9999;
var theLng = 9999;

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
    theLat = request.body.lat;
    theLng = request.body.lng;
    var resObj = '';
    var done = 0; /* bool */

    if (!validCheckIn(theLogin, theLat, theLng)) {
        response.send('{"error":"Whoops, something is wrong with your data!"}');
    } 
    else {
        theLat = v.toFloat(theLat);
        theLng = v.toFloat(theLng);
        resObj = {"login":theLogin,"lat":theLat,"lng":theLng,"created_at":theDate};
        writeCollection(db, 'people', resObj);

        resObj = {'people':[],'landmarks':[]};      /* TODO */

        Object.keys(resObj).forEach(key => {
            readCollection(db, key, function(collection, itsList) {
                resObj[collection] = itsList;
                if (done) response.send(JSON.stringify(resObj));
                done++;
            });
        });
    }
});

app.listen(process.env.PORT || 8888);


function validCheckIn(login, lat, lng)
{
    if (login == '') return 0;
    if (!v.isFloat(lat, {min:-90, max:90}) || !v.isFloat(lng, {min:-180, max:180})) return 0;
    return 1;
}

function writeCollection(db, col, toInsert)
{
    db.collection(col).insert(toInsert, function(e, result) {
        assert.equal(e, null);
        assert.equal(1, result.result.n);
    });
}

function readCollection(db, col, fn)
{
    function WithinAMile(e, collection) {
        assert.equal(e, null);
        collection.find({geometry:{$near:{$geometry:{type:"Point",coordinates:[theLng,theLat]},$minDistance: 1000,$maxDistance: 11609.34}}}).toArray(function(e, arr) {
            assert.equal(e, null);
            fn(col, arr);
        });
    }

    function getPpl(e, collection) {
        assert.equal(e, null);
        collection.find().toArray(function(e, arr) {
            assert.equal(e, null);
            fn(col, arr);
        });
    }

    if (col == 'landmarks') {
        db.collection(col).createIndex({'geometry':"2dsphere"}, function(e, index) { 
            assert.equal(e, null);
            db.collection('landmarks', WithinAMile);
        });
    }
    else db.collection(col, getPpl); 
}
