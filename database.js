module.exports.write = writeCollection;
module.exports.read = readCollection;


/* functions */


 function getCol(e, collection) {
        assert.equal(e, null);
        collection.find().toArray(function(e, arr) {
            assert.equal(e, null);
            fn(col, arr);
        });
    }

    if (col == 'landmarks') {
        db.collection('landmarks').createIndex({'geometry':"2dsphere"}, function(e, index) { 
        db.collection('landmarks', function (error, Col) {
            Col.find({geometry:{$near:{$geometry:{type:"Point",coordinates:[theLng,theLat]},$minDistance: 1000,$maxDistance: 1500}}}).toArray(function(e, arr) {
                console.log("arr => ", arr);
            });

        });
    });

    }

    db.collection(col, getCol);