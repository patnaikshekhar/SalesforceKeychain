var ipcRenderer = require('electron').ipcRenderer;

var requestId = 0;

var ipcBrowsers = {
    getBrowsers: function(callback) {
        
        requestId += 1;
        
        var thisRequestId = requestId;
        
        var request = {
            id: thisRequestId
        };
        
        ipcRenderer.send('getBrowsers', request);
        
        ipcRenderer.on('getBrowsersCompleted', function(event, args) {
            var id = args.id;
            var browsers = args.browsers; 
            var selected = args.selected;
            
            if (id === thisRequestId) {
                callback(browsers, selected)
            }
        });
    },
    
    setDefaultBrowser: function(name, callback) {
        
        requestId += 1;
        
        var thisRequestId = requestId;
        
        var request = {
            id: thisRequestId,
            name: name
        };
        ipcRenderer.send('setDefaultBrowser', request);
        
        ipcRenderer.on('setDefaultBrowserCompleted', function(event, args) {
           callback();
        });
    }
};