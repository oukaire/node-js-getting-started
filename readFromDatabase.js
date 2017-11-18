/* - Onyi Ukay, Nov 17, 2017
 * this is a cliché function, merely written for practicing splicing files
 * into multiple documents.
 * 
 * reads searchKey from a collection in db, then calls fn passing 
 * error, collection(key) & the search Key's associating list 
 */

exports.collection = function read(db, coll, searchKey, fn) {

    function getList(e, collection) {
        if (e) fn(e, coll, []);

        collection.find(searchKey).toArray(function(e, arr) {
            if (e) fn(e, coll, []);
            fn(null, coll, arr);
        });
    }

    if (coll === 'landmarks') {

        db.collection(coll).createIndex({'geometry':"2dsphere"}, function(e, _) { 
            if (e) fn(e, coll, []);
            db.collection(coll, getList);
        });
    }
    else db.collection(coll, getList); 
}