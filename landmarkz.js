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
    db.collection('people').find().sort({ 'created_at': -1 }).toArray(
        function(e, list) {
            if (e) throw e;
            response.render('pages/homepage', { log: list });
        } 
    );
});

app.post('/sendLocation', function(request, response) { /* TODO: STATUS CODE */

    const theDate = new Date();
    theLogin = request.body.login;
    theLat = request.body.lat;
    theLng = request.body.lng;
    var theObj = '';
    var done = 0;

    if (theLogin == '' || !v.isFloat(theLat, {min:-90, max:90}) || !v.isFloat(theLng, {min:-180, max:180})) {
        response.send('{"error":"Whoops, something is wrong with your data!"}');
    } 
    else {
        theLat = v.toFloat(theLat);
        theLng = v.toFloat(theLng);
        theObj = {'login':theLogin,'lat':theLat,'lng':theLng,'created_at':theDate};
        
        db.collection('people').insert(theObj, function(e, obj) {
            if (e || obj.result.n != 1) response.send(500);
        });
        
        theObj = {'people':[],'landmarks':[]};

        Object.keys(theObj).forEach(key => {
            toFind = (key == 'people') ? (null) : ({geometry:{$near:{$geometry:{type:"Point",coordinates:[theLng,theLat]},$minDistance: 1,$maxDistance: 1609.34}}});
            readCollection(key, toFind, function(e, key, itsList) {
                if (e) response.status(500);
                theObj[key] = itsList;
                if (done) response.send(theObj);
                done++;
            });
        });
    } 
});

app.listen(process.env.PORT || 8888);

function readCollection(coll, searchKey, fn)
{
    function getList(e, collection) {
        if (e) fn(e, coll, []);
        collection.find(searchKey).toArray(function(e, arr) {
            if (e) fn(e, coll, []);
            fn(null, coll, arr);
        });
    }

    if (coll === 'landmarks') {
        db.collection(coll).createIndex({'geometry':"2dsphere"}, function(e, ind) { 
            if (e) fn(e, coll, []);
            db.collection(coll, getList);
        });
    }
    else db.collection(coll, getList); 
}
