var ipcRenderer = require('electron').ipcRenderer;

var requestId = 0;

var ipcStorage = {
    get: function(key, callback) {
        
        requestId += 1;
        
        var thisRequestId = requestId;
        
        var request = {
            id: thisRequestId
        };
        
        ipcRenderer.send('getDB', request);
        
        ipcRenderer.on('getDBCompleted', function(event, args) {
            var id = args.id;
            
            if (id === thisRequestId) {
                callback({
                    accounts: args.docs
                });    
            }
        });
    },
    
    set: function(objects, callback) {
        var objs = objects.accounts;
        
        requestId += 1;
        
        var thisRequestId = requestId;
        
        var request = {
            id: thisRequestId,
            doc: objs
        };
        
        ipcRenderer.send('putDB', request);
        
        ipcRenderer.on('putDBCompleted', function(event, args) {
            var id = args.id;
            
            if (id === thisRequestId) {
                callback();    
            }
        });
    }
};