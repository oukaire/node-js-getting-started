'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const read = require('./readFromDatabase.js');
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
var theLat = '';
var theLng = '';
var toFind = null;

app.get('/checkins.json', function(request, response) {
    theLogin = request.query.login;
    if (theLogin === '') response.send([]);
    else {
        read.collection(db, 'people', {'login':theLogin}, function(e, collection, itsList) {
            if (e) throw e;
            response.send(itsList);
        });
    }
});

app.get('/', function(request, response) {
    db.collection('people').find().sort({ 'created_at': -1 }).toArray(
        function(e, list) {
            if (e) throw e;
            response.render('pages/home', { log: list });
        } 
    );
});

app.post('/sendLocation', function(request, response) { /* TODO: STATUS CODE */

    const theDate = new Date();
    theLogin = request.body.login;
    theLat = request.body.lat;
    theLng = request.body.lng;
    var theObj = '',
        done = 0;

    if (theLogin == '' || !v.isFloat(theLat, {min:-90, max:90}) || !v.isFloat(theLng, {min:-180, max:180})) {
        response.send('{"error":"Whoops, something is wrong with your data!"}');
    } 
    else {
        theLat = v.toFloat(theLat);
        theLng = v.toFloat(theLng);
        theObj = {'login':theLogin,'lat':theLat,'lng':theLng,'created_at':theDate};
        
        db.collection('people').insert(theObj, function(e, obj) {
            if (e || obj.result.n != 1) response.sendStatus(500);
        });
        
        theObj = {'people':[],'landmarks':[]};

        Object.keys(theObj).forEach(key => {
            toFind = (key == 'people') ? (null) : ({geometry:{$near:{$geometry:{type:"Point",coordinates:[theLng,theLat]},$minDistance: 0,$maxDistance: 1609.34}}});
            read.collection(db, key, toFind, function(e, key, itsList) {
                if (e) throw e;
                theObj[key] = itsList;
                if (done) response.send(theObj);
                done++;
            });
        });
    } 
});

app.listen(process.env.PORT || 8888);
