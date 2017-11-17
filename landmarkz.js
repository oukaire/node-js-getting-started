'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const v = require('validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var MongoClient = require('mongodb').MongoClient, 
    assert = require('assert');
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/landmarkz';
var db = MongoClient.connect(mongoUri, function(e, database) { assert.equal(null, e); db = database; });
var theLogin = '';
var theLat = '00';
var theLng = '00';
var toFind = null;

app.get('/checkins.json', function(request, response) {
    theLogin = request.query.login;
    if (!validCheckIn('0', '0')) response.send([]);
    else {
        readCollection('people', {'login':theLogin}, function(collection, itsList) {
            response.send(itsList);
        });
    }
});

app.get('/', function(request, response) {
    
    db.collection('people').find().sort({'created_at': -1}, 
        function(e, list) {
            assert.equal(e, null);
            response.render('pages/homepage', { log: list });
        }
    );
});

app.post('/sendLocation', function(request, response) { /* TODO: status code */

    const theDate = new Date();
    theLogin = request.body.login;
    theLat = request.body.lat;
    theLng = request.body.lng;
    var resObj = '';
    var done = 0;

    if (!validCheckIn(theLat, theLng)) {
        response.send('{"error":"Whoops, something is wrong with your data!"}');
    } 
    else {
        theLat = v.toFloat(theLat);
        theLng = v.toFloat(theLng);
        resObj = {"login":theLogin,"lat":theLat,"lng":theLng,"created_at":theDate};
        
        writeCollection('people', resObj);
        resObj = {'people':[],'landmarks':[]};

        Object.keys(resObj).forEach(key => {
            toFind = (key === 'people') ? (null) : ({geometry:{$near:{$geometry:{type:"Point",coordinates:[theLng,theLat]},$minDistance: 1,$maxDistance: 1609.34}}});
            readCollection(key, toFind, function(collection, itsList) {
                resObj[collection] = itsList;
                if (done) response.send(resObj), done++;
            });
        });
    }
});

app.listen(process.env.PORT || 8888);


function validCheckIn(lat, lng)
{
    if (theLogin === '') return 0;
    if (!v.isFloat(lat, {min:-90, max:90}) || !v.isFloat(lng, {min:-180, max:180})) return 0;
    return 1;
}

function writeCollection(col, toInsert)
{
    db.collection(col).insert(toInsert, function(e, result) {
        assert.equal(e, null);
        assert.equal(1, result.result.n);
    });
}

function readCollection(col, searchKey, fn)
{
    function getList(e, collection) {
        assert.equal(e, null);
        collection.find(searchKey).toArray(function(e, arr) {
            assert.equal(e, null);
            fn(col, arr);
        });
    }

    if (col === 'landmarks') {
        db.collection(col).createIndex({'geometry':"2dsphere"}, function(e, _) { 
            assert.equal(e, null);
            db.collection(col, getList);
        });
    }
    else db.collection(col, getList); 
}
