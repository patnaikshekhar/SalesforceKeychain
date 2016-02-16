var ipcRenderer = require('electron').ipcRenderer;
var remote = require('remote'); 
var dialog = remote.require('dialog');
var fs = require('fs');

var Helper = {
    openWindow: function(url, username, password) {
        ipcRenderer.send('openWindow', {
            username: username,
            password: password,
            url: url
        });
    },
    
    download: function(json) {
        var options = { filters: [
            { name: 'export', extensions: ['json'] }
        ]};
        
        dialog.showSaveDialog(options, function (fileName) {
            if (fileName === undefined) return;
            fs.writeFile(fileName, JSON.stringify(json), function (err) {});
        });
    }
};