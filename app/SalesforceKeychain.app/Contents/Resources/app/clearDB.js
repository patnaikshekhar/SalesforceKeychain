'use strict';

var Datastore = require('nedb');
var db = new Datastore({ filename: __dirname + '/settings.db', autoload: true });

db.remove({}, {multi: true}, function() {
    console.log('Done');
});

