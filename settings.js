'use strict';

// Used as the Data Storage mechanism
const Datastore = require('nedb');
const db = new Datastore({ filename: `${__dirname}/settings.db`, autoload: true });

module.exports = {
    getAllSettings(callback) {
    
        db.find({}, function(err, docs) {
            if (err) {
                callback({});        
            } else {
                
                const settingsObject = docs.reduce((acc, setting) => {
                    
                    let obj = {};
                    obj[setting.name] = setting.value;
                    return Object.assign(acc, obj);
                        
                }, {})
                
                callback(settingsObject);
            }
        });
    
    },
    
    setSettings(obj, callback) {
        db.remove({}, {multi: true}, () => {
            const modifiedObject = Object.keys(obj).map((key) => ({
                name: key,
                value: obj[key]
            }));
            db.insert(modifiedObject, (err, docs) => {
                callback(err);    
            });    
        });
    }
};